import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it,vi} from 'vitest';
vi.mock('next/navigation',()=>({useRouter:()=>({refresh:vi.fn()}),usePathname:()=>'/v/'+ 'A'.repeat(43),useSearchParams:()=>new URLSearchParams()}));
import {VotePage} from '@/components/VotePage';
import {VOTE_COPY} from '@/lib/voteCopy';
import type {PublicVoteSnapshot,PublicVoteReadResult} from '@/lib/server/voteAccess';
const token='A'.repeat(43);
function snapshot():PublicVoteSnapshot {return {version:1,firstName:'Élo',initials:'É',occasion:'Dîner',endsAt:'2099-01-01T00:00:00Z',expiresAt:'2099-01-08T00:00:00Z',closed:false,options:['a','b'].map(choice=>({choice,pieces:[{name:'Pull',category:'tops',imageUrl:`https://www.margotwardrobe.com/v/${token}/media/00000000-0000-0000-0000-000000000001`},{name:null,category:'jeans',imageUrl:`https://www.margotwardrobe.com/v/${token}/media/00000000-0000-0000-0000-000000000002`}]})) as PublicVoteSnapshot['options']};}
function render(result:PublicVoteReadResult,locale:'fr'|'en'|'es'='fr'){return renderToStaticMarkup(createElement(VotePage,{result,locale}));}
it('public_projection_only: renders only snapshot, never private metadata or third-party ballot',()=>{
 const s={...snapshot(),owner_id:'owner-secret',avatar:'avatar-secret',path:'privateStoragePath',reason:'private-reason',vote_id:'vote-secret'};
 const html=render({status:'ok',snapshot:s,myChoice:null});
 for(const value of ['owner-secret','avatar-secret','privateStoragePath','private-reason','vote-secret'])expect(html).not.toContain(value);
 expect(html).toContain('Dîner');expect(html).toContain('object-contain');expect(html).not.toContain('srcset');
 expect(html).toContain('min-h-[44px]');expect(html).toContain('aria-live="polite"');expect(html).toContain('maxLength="40"');expect(html).toContain('maxLength="160"');
});
it('hostile_text_and_account_switch: React escapes hostile public text and isolates bidi',()=>{
 const s=snapshot();s.firstName='<img src=x onerror=alert(1)>';s.occasion='<a href="https://evil.test">x</a>\u202e';s.options[0].pieces[0].name='<script>alert(1)</script>';
 const html=render({status:'ok',snapshot:s,myChoice:null});
 expect(html).not.toContain('<script>');expect(html).not.toContain('<a href="https://evil.test');expect(html).toContain('&lt;img');expect(html).toContain('<bdi>');
});
it.each(['fr','en','es'] as const)('one_soft_invitation and own-choice announcement in %s',locale=>{
 const html=render({status:'ok',snapshot:snapshot(),myChoice:'b'},locale);
 expect(html.split('data-vote-invitation="true"')).toHaveLength(2);expect(html).toContain(VOTE_COPY[locale].pitch);expect(html).toContain('aria-pressed="true"');expect(html).toContain('B');
 const closed=render({status:'ok',snapshot:{...snapshot(),closed:true},myChoice:null},locale);expect(closed).not.toContain('<form');expect(closed.split('data-vote-invitation="true"')).toHaveLength(2);expect(closed).toContain(VOTE_COPY[locale].closed);
});
it.each([{status:'unavailable'},{status:'limited',retryAfter:45},{status:'service_unavailable'}] as const)('preserves denial $status without images or ballot',result=>{
 const html=render(result);expect(html).not.toContain('<img');expect(html).not.toContain('<form');expect(html).not.toContain('data-vote-invitation');if(result.status==='limited')expect(html).toContain('45');
});
