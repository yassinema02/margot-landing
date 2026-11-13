import { describe, expect, it } from "vitest";
import { POSTHOG_OPTIONS, pageviewUrl, posthogOptions } from "@/components/PostHogProvider";

// An invitation link carries a single-use token: whoever holds it can claim
// the invitation. PostHog must only ever see /i/:token.
const TOKEN = "0f8e2a4c-1b3d-4e5f-8a9b-0c1d2e3f4a5b";

describe("PostHogProvider", () => {
  it("sends /i/:token as the pageview URL", () => {
    expect(pageviewUrl("https://www.margotwardrobe.com", `/i/${TOKEN}`, "")).toBe("https://www.margotwardrobe.com/i/:token");
    expect(pageviewUrl("https://www.margotwardrobe.com", `/i/${TOKEN}`, "utm_source=whatsapp")).toBe(
      "https://www.margotwardrobe.com/i/:token?utm_source=whatsapp",
    );
  });

  it("keeps other pageview URLs as they are", () => {
    expect(pageviewUrl("https://www.margotwardrobe.com", "/download", "c=ig_bio")).toBe(
      "https://www.margotwardrobe.com/download?c=ig_bio",
    );
  });

  it("scrubs every event before it leaves the browser (autocapture, pageleave, clicks)", () => {
    const beforeSend = POSTHOG_OPTIONS.before_send;
    expect(typeof beforeSend).toBe("function");
    const out = (beforeSend as (e: unknown) => { properties: Record<string, unknown> })({
      uuid: "e1",
      event: "app_store_click",
      properties: {
        $current_url: `https://www.margotwardrobe.com/i/${TOKEN}`,
        $pathname: `/i/${TOKEN}`,
        placement: "social_invite",
      },
    });
    expect(JSON.stringify(out)).not.toContain(TOKEN);
    expect(out.properties.$pathname).toBe("/i/:token");
  });

  it("stays cookieless", () => {
    expect(POSTHOG_OPTIONS.persistence).toBe("memory");
    expect(POSTHOG_OPTIONS.capture_pageview).toBe(false);
  });

  it("disableFlags (invitation page): no /flags request, which would carry $initial_current_url", () => {
    const options = posthogOptions({ disableFlags: true });
    expect(options.advanced_disable_flags).toBe(true);
    expect(options.before_send).toBe(POSTHOG_OPTIONS.before_send);
    expect(options.persistence).toBe("memory");
  });

  it("the rest of the site keeps its options", () => {
    expect(posthogOptions({ disableFlags: false })).toBe(POSTHOG_OPTIONS);
    expect(POSTHOG_OPTIONS.advanced_disable_flags).toBeUndefined();
  });
});

it('strict vote disables automatic capture and projects only the three safe events',()=>{
 const options=posthogOptions({disableFlags:false,strictVote:true});expect(options.autocapture).toBe(false);expect(options.capture_pageleave).toBe(false);expect(options.advanced_disable_flags).toBe(true);
 const hook=options.before_send as (e:unknown)=>unknown;
 expect(hook({event:'$pageview',properties:{}})).toBeNull();
 const event=hook({event:'social_vote_web_voted',properties:{locale:'fr',platform:'ios',result:'ok',firstName:'Élo',choice:'a',$current_url:'/v/secret'},$set:{name:'Élo'}});
 expect(JSON.stringify(event)).not.toContain('Élo');expect(JSON.stringify(event)).not.toContain('secret');expect(JSON.stringify(event)).not.toContain('choice');
 expect(hook({event:'social_vote_web_voted',properties:{locale:'Élo'}})).toBeNull();
});

it('reconfigures an already loaded identified singleton and sends only anonymous valid transport envelope',async()=>{
 const {vi}=await import('vitest');vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY','phc_synthetic_project');vi.resetModules();
 const ph=(await import('posthog-js')).default;const wasLoaded=ph.__loaded;ph.__loaded=true;
 const id='01234567-89ab-4def-8abc-0123456789ab';let identified=true;
 const config=vi.spyOn(ph,'set_config').mockImplementation(()=>{});
 const reset=vi.spyOn(ph,'reset').mockImplementation(()=>{identified=false;});
 vi.spyOn(ph,'_isIdentified').mockImplementation(()=>identified);vi.spyOn(ph,'get_distinct_id').mockReturnValue(id);
 const capture=vi.spyOn(ph,'capture').mockImplementation(()=>undefined);
 const provider=await import('@/components/PostHogProvider');
 provider.captureVoteEvent('social_vote_web_voted',{locale:'fr',platform:'ios',result:'ok'});
 expect(config).toHaveBeenCalledWith(expect.objectContaining({autocapture:false,capture_pageleave:false,advanced_disable_flags:true,persistence:'memory'}));expect(reset).toHaveBeenCalledWith(true);expect(capture).toHaveBeenCalledTimes(1);
 const event={uuid:'01234567-89ab-4def-8abc-0123456789ac',timestamp:new Date(),event:'social_vote_web_voted',privateField:'secret',properties:{locale:'fr',platform:'ios',result:'ok',token:'/v/secret',distinct_id:'account-id',firstName:'Élo'},$set:{name:'Élo'}};
 const out=provider.strictVoteEvent(event)!;expect(out.properties).toEqual({locale:'fr',platform:'ios',result:'ok',token:'phc_synthetic_project',distinct_id:id});expect(Object.keys(out).sort()).toEqual(['event','properties','timestamp','uuid']);expect(JSON.stringify(out)).not.toMatch(/secret|account-id|Élo/);
 const report={...event,event:'social_reported',properties:{target_kind:'vote',reason:'privacy',locale:'fr',url:'/v/secret',firstName:'Élo',id:'private-id'}};
 expect(provider.strictVoteEvent(report)?.properties).toEqual({target_kind:'vote',reason:'privacy',token:'phc_synthetic_project',distinct_id:id});
 for(const reason of ['harassment','hate','sexual','violence','spam','privacy','other'])expect(provider.strictVoteEvent({...report,properties:{target_kind:'vote',reason}})).not.toBeNull();
 for(const properties of [{target_kind:'profile',reason:'privacy'},{target_kind:'vote',reason:'private text'},{target_kind:'vote'},{reason:'spam'}])expect(provider.strictVoteEvent({...report,properties})).toBeNull();
 identified=true;expect(provider.strictVoteEvent(report)).toBeNull();expect(provider.strictVoteEvent(event)).toBeNull();identified=false;expect(provider.strictVoteEvent({...event,uuid:'business-id'})).toBeNull();
 ph.__loaded=wasLoaded;vi.restoreAllMocks();vi.unstubAllEnvs();
});
