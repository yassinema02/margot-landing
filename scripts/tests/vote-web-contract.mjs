/** Opt-in physical contract helpers. Importing this module opens no socket. */
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import { readFileSync, writeFileSync, statSync, realpathSync, existsSync } from 'node:fs';
import { resolve, isAbsolute } from 'node:path';
import { createHash, randomUUID, randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const CANONICAL_ORIGIN = 'https://www.margotwardrobe.com';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function assertLoopbackUrl(value) {
  assert(typeof value === 'string' && /^https?:\/\/127\.0\.0\.1:[1-9][0-9]{0,4}\/?$/.test(value), 'literal_loopback_origin_required');
  const url = new URL(value);
  assert(Number(url.port) > 0 && Number(url.port) <= 65535 && !url.username && !url.password && !url.search && !url.hash, 'invalid_loopback_origin');
  return url;
}
export function checkConfig(config) {
  for (const name of ['apiOrigin', 'directOrigin', 'webOrigin', 'controlOrigin']) assertLoopbackUrl(config[name]);
  assert(config.webOrigin.startsWith('https:'), 'TLS_required');
  for (const name of ['serviceRoleKey', 'anonKey']) assert(typeof config[name] === 'string' && config[name].length > 30, 'synthetic_keys_required');
  for (const name of ['certificate', 'proofDir', 'sourceImage']) assert(isAbsolute(config[name]), 'absolute_local_paths_required');
  assert(typeof config.controlSecret === 'string' && config.controlSecret.length >= 32, 'control_secret_required');
  assert(config.webHost === 'www.margotwardrobe.com', 'canonical_host_required');
  return config;
}
export function privateJson(path) {
  assert((statSync(path).mode & 0o077) === 0, 'private_file_permissions_required');
  return JSON.parse(readFileSync(path, 'utf8'));
}
export function cookieFromResponse(header) {
  assert(typeof header === 'string', 'missing_cookie');
  const parts = header.split(';').map(s => s.trim());
  assert(parts[0].startsWith('__Secure-margot_vote_device='), 'unexpected_cookie');
  for (const part of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/v', 'Max-Age=691200']) assert(parts.includes(part), 'unsafe_cookie_attributes');
  return parts[0];
}
export function assertFinalEvidence({ storageFilesAfterPurge, lateCommitRejected, publicGetAfterRevoke, newAiCalls, newWearOutcomes, authUsersAfterPurge, physicalScanCompleted }) {
  assert(Array.isArray(storageFilesAfterPurge));
  assert(storageFilesAfterPurge.length === 0);
  assert(lateCommitRejected === true);
  assert(publicGetAfterRevoke.status === 404);
  assert(newAiCalls === 0);
  assert(newWearOutcomes === 0);
  assert(physicalScanCompleted === true);
  assert(Array.isArray(authUsersAfterPurge) && authUsersAfterPurge.length > 0 && authUsersAfterPurge.every(r => r.status === 404));
}
/** One held transport boundary, never a fabricated successful response. */
export class Barrier {
  spec = null; hits = 0; matches = 0; reached = false; waiters = []; releaseHeld = null; timer = null;
  arm(spec) {
    assert(!this.spec, 'barrier_already_armed');
    assert(['GET','POST','PUT','PATCH','DELETE'].includes(spec.method) && typeof spec.path === 'string' && spec.path.startsWith('/'), 'invalid_barrier');
    assert(['before','after'].includes(spec.phase) && ['hold','drop','fail'].includes(spec.mode), 'invalid_barrier');
    assert(spec.nth === undefined || (Number.isInteger(spec.nth) && spec.nth > 0 && spec.nth <= 100), 'invalid_barrier');
    assert(spec.bodyIncludes === undefined || (typeof spec.bodyIncludes === 'string' && spec.bodyIncludes.length > 0 && spec.bodyIncludes.length <= 256), 'invalid_barrier_body');
    this.spec = {...spec}; this.hits = 0; this.matches = 0; this.reached = false;
  }
  async hit(meta) {
    const s = this.spec;
    if (!s || this.reached || meta.method !== s.method || meta.phase !== s.phase || !(s.prefix ? meta.path.startsWith(s.path) : meta.path === s.path)) return 'pass';
    if (s.bodyIncludes && !meta.body?.includes(s.bodyIncludes)) return 'pass';
    this.matches++;
    if (this.matches !== (s.nth ?? 1)) return 'pass';
    this.hits++; this.reached = true;
    for (const waiter of this.waiters.splice(0)) waiter.resolve(this.snapshot());
    if (s.mode !== 'hold') return s.mode;
    return new Promise(resolveHeld => {
      this.releaseHeld = resolveHeld;
      this.timer = setTimeout(() => { this.releaseHeld = null; resolveHeld('drop'); }, 8000);
    });
  }
  wait(ms = 8000) {
    assert(Number.isInteger(ms) && ms > 0 && ms <= 8000);
    if (this.reached) return Promise.resolve(this.snapshot());
    return new Promise((resolveWait, reject) => {
      const waiter = {resolve: value => { clearTimeout(timer); resolveWait(value); }};
      const timer = setTimeout(() => { this.waiters = this.waiters.filter(w => w !== waiter); reject(new Error('barrier_timeout')); }, ms);
      this.waiters.push(waiter);
    });
  }
  snapshot() { return {armed: !!this.spec, hits: this.hits, matches: this.matches, reached: this.reached}; }
  release() { clearTimeout(this.timer); this.releaseHeld?.('pass'); this.releaseHeld = null; this.spec = null; }
}

/** Literal socket destination only; redirects are returned, never followed. */
export function localRequest(origin, path, {method = 'GET', headers = {}, body, certificate, canonical = false, timeout = 10000, maxBytes = 20 * 1024 * 1024} = {}) {
  const url = assertLoopbackUrl(origin);
  assert(typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !/[\r\n\\]/.test(path), 'invalid_request_path');
  assert(Number.isInteger(timeout) && timeout > 0 && timeout <= 60000);
  const bytes = body === undefined ? undefined : Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body));
  const requestHeaders = {...headers, ...(bytes ? {'content-length': String(bytes.length)} : {})};
  if (canonical) requestHeaders.host = 'www.margotwardrobe.com';
  const transport = url.protocol === 'https:' ? https : http;
  return new Promise((resolveRequest, reject) => {
    const req = transport.request({hostname: '127.0.0.1', port: Number(url.port), method, path, headers: requestHeaders,
      ...(url.protocol === 'https:' ? {ca: certificate, servername: canonical ? 'www.margotwardrobe.com' : '127.0.0.1', rejectUnauthorized: true} : {}), agent: false}, response => {
      const chunks = []; let size = 0;
      response.on('data', chunk => { size += chunk.length; if (size > maxBytes) response.destroy(new Error('response_too_large')); else chunks.push(chunk); });
      response.on('error', error => { clearTimeout(timer); reject(error); });
      response.on('end', () => { clearTimeout(timer); resolveRequest({status: response.statusCode, headers: response.headers, bytes: Buffer.concat(chunks)}); });
    });
    const timer = setTimeout(() => req.destroy(new Error('request_deadline')), timeout);
    req.on('error', error => { clearTimeout(timer); reject(error); });
    req.end(bytes);
  });
}
export async function control(origin, secret, command) {
  assertLoopbackUrl(origin); assert(typeof secret === 'string' && secret.length >= 32);
  const response=await localRequest(origin,'/',{method:'POST',body:command,headers:{authorization:`Bearer ${secret}`,'content-type':'application/json'},timeout:10000,maxBytes:65536});
  assert.equal(response.status,200,'control_failed'); return JSON.parse(response.bytes);
}
export function createClients(config) {
  checkConfig(config); const certificate = readFileSync(config.certificate);
  const request = (path, options = {}) => localRequest(config.apiOrigin, path, options);
  const rest = async (path, body, jwt = config.serviceRoleKey, method = 'POST') => {
    const response = await request(path, {method, body, headers: {apikey: config.anonKey, authorization: `Bearer ${jwt}`, 'content-type': 'application/json', prefer: 'return=representation'}});
    assert(response.status >= 200 && response.status < 300, `local_API_status_${response.status}`);
    return response.bytes.length ? JSON.parse(response.bytes) : null;
  };
  return {
    request, rest, rpc: (name, args, jwt) => {assert(/^[a-z_]+$/.test(name)); return rest(`/rest/v1/rpc/${name}`,args,jwt);},
    web: (path, options = {}) => localRequest(config.webOrigin, path, {certificate, canonical: true, ...options}),
    owner: (jwt, body) => localRequest(config.webOrigin, '/api/social-vote-link', {method:'POST', body, certificate, canonical:true, timeout:55000, headers:{authorization:`Bearer ${jwt}`,'content-type':'application/json'}}),
    control: command => control(config.controlOrigin, config.controlSecret, command),
  };
}
/** Bounded retry only for documented pending responses; quota delays are never bypassed. */
export async function prepareUntilComplete(client, jwt, body) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await client.owner(jwt, body);
    if (response.status === 200) return JSON.parse(response.bytes);
    const data = JSON.parse(response.bytes);
    assert(response.status === 202 && data.error === 'pending_media', `prepare_status_${response.status}_${data.error}`);
    const delay = Number(response.headers['retry-after'] ?? 1);
    assert(Number.isInteger(delay) && delay > 0 && delay <= 30, 'retry_requires_coordinator');
    await new Promise(resolveDelay => setTimeout(resolveDelay, delay * 1000));
  }
  throw Error('prepare_retry_bound');
}
/** Baseline uses real GoTrue, PostgREST, Storage and Node owner/public routes. */
export async function referenceFlow(config) {
  const c = createClients(config); const run = randomBytes(6).toString('hex');
  const ledger = {run, accountIntents:[], accounts:[], objects:[], votes:[], completed:false};
  const proof = realpathSync(config.proofDir);assert(!existsSync(resolve(proof,'ledger.private.json')),'reference_already_started');
  const save = () => writeFileSync(resolve(proof,'ledger.private.json'), JSON.stringify(ledger,null,2), {mode:0o600});
  save();
  const before = {};
  for (const table of ['ai_usage_log','outfit_feedback','wear_logs','outfit_exposures']) {
    before[table] = await c.rest(`/rest/v1/${table}?select=*&limit=100`,undefined,undefined,'GET');
    assert.equal(before[table].length,0,'dedicated_database_not_empty');
  }
  writeFileSync(resolve(proof,'outcomes-before.private.json'), JSON.stringify(before), {mode:0o600});
  async function account(label, withSocial = true) {
    const email = `vote8b-${run}-${label}@example.invalid`, password = randomBytes(24).toString('base64url');
    ledger.accountIntents.push({email}); save();
    const user = await c.rest('/auth/v1/admin/users',{email,password,email_confirm:true});
    assert(typeof user.id === 'string'); ledger.accounts.push(user.id); save();
    const session = await c.rest('/auth/v1/token?grant_type=password',{email,password},config.anonKey);
    assert.equal(session.user.id,user.id); assert(typeof session.access_token === 'string');
    await c.rest('/rest/v1/profiles',{id:user.id});
    if (withSocial) {
    await c.rpc('social_declare_birth_year',{p_birth_year:1990,p_birth_month:1},session.access_token);
    await c.rpc('social_create_profile',{p_username:`t8.${run}.${label}`,p_display_name:'Test'},session.access_token);
    }
    return {id:user.id,jwt:session.access_token};
  }
  await c.rest('/rest/v1/social_rollout?id=eq.true',{enabled:true},undefined,'PATCH');
  const owner = await account('a'), visitor = await account('b'), withoutSocial = await account('c',false);
  const sideEffectTables=['social_follows','social_invites','social_invite_claims','style_play_deliveries'],sideEffectsBefore={};
  for(const table of sideEffectTables)sideEffectsBefore[table]=await c.rest(`/rest/v1/${table}?select=*&limit=100`,undefined,undefined,'GET');
  const source = readFileSync(config.sourceImage); assert(source.length > 0 && source.length <= 10*1024*1024);
  const items=[];
  for (let i=0;i<4;i++) {
    const path = `${owner.id}/vote8b-${run}/studio-${i}.png`;
    ledger.objects.push({bucket:'wardrobe-images',path}); save();
    const upload = await c.request(`/storage/v1/object/wardrobe-images/${path}`,{method:'POST',body:source,headers:{apikey:config.anonKey,authorization:`Bearer ${config.serviceRoleKey}`,'content-type':'image/png','x-upsert':'false'}});
    assert.equal(upload.status,200,'source_upload_failed');
    const url = `${config.apiOrigin}/storage/v1/object/public/wardrobe-images/${path}`;
    const rows=await c.rest('/rest/v1/items',{user_id:owner.id,image_url:url,original_image_url:url,processed_image_url:url,category:i%2?'bottoms':'tops',name:'Test',status:'complete'},owner.jwt);
    assert.equal(rows.length,1); items.push(rows[0].id);
  }
  const vote=await c.rpc('social_create_vote',{p_client_id:randomUUID(),p_occasion:'Essai local',p_options:[{choice:'a',item_ids:items.slice(0,2),positions:['top','bottom'],source_outfit_id:null},{choice:'b',item_ids:items.slice(2),positions:['top','bottom'],source_outfit_id:null}],p_link_requested:true},owner.jwt);
  assert(typeof vote.id==='string');ledger.votes.push(vote.id);save();
  const prepared=await prepareUntilComplete(c,owner.jwt,{action:'prepare',voteId:vote.id,expectedRevision:vote.link_revision,firstName:'Test'});assert.equal(prepared.state,'prepared');
  const previews=[];
  for (const option of prepared.options) for (const piece of option.pieces) {
    const response=await c.owner(owner.jwt,{action:'preview_media',voteId:vote.id,revision:prepared.revision,manifestHash:prepared.manifestHash,mediaId:piece.mediaId});
    assert.equal(response.status,200);assert.equal(response.headers['content-type'],'image/jpeg');
    previews.push({id:piece.mediaId,sha256:sha256(response.bytes),bytes:response.bytes.length});
  }
  const mediaRows=await c.rest(`/rest/v1/style_vote_link_media?vote_id=eq.${vote.id}&select=*`,undefined,undefined,'GET');
  const canonicals=await c.rest(`/rest/v1/social_media_copies?owner_id=eq.${owner.id}&select=*`,undefined,undefined,'GET');
  for (const media of mediaRows) {
    const canonical=canonicals.find(row=>row.source_id===media.source_item_id);assert(canonical&&canonical.source_kind==='item'&&canonical.version===media.source_version&&canonical.large_path===media.source_path&&canonical.encrypted===false);
    const bytes=await c.request(`/storage/v1/object/authenticated/social-media/${media.source_path}`,{headers:{apikey:config.anonKey,authorization:`Bearer ${config.serviceRoleKey}`}});assert.equal(bytes.status,200);assert.equal(sha256(bytes.bytes),media.sha256);assert.equal(previews.find(p=>p.id===media.id)?.sha256,media.sha256);
  }
  const publicationRefusals=[];const validPublish={action:'publish',voteId:vote.id,revision:prepared.revision,manifestHash:prepared.manifestHash,consentVersion:1};
  for(const [label,body,status] of [
    ['consent_missing',Object.fromEntries(Object.entries(validPublish).filter(([k])=>k!=='consentVersion')),400],
    ['manifest_missing',Object.fromEntries(Object.entries(validPublish).filter(([k])=>k!=='manifestHash')),400],
    ['consent_stale',{...validPublish,consentVersion:0},400],
    ['manifest_stale',{...validPublish,manifestHash:prepared.manifestHash==='0'.repeat(64)?'1'.repeat(64):'0'.repeat(64)},409],
    ['revision_stale',{...validPublish,revision:prepared.revision+1},409]]){
    const refused=await c.owner(owner.jwt,body);assert.equal(refused.status,status,label);publicationRefusals.push({label,status:refused.status});
  }
  const publishedResponse=await c.owner(owner.jwt,{action:'publish',voteId:vote.id,revision:prepared.revision,manifestHash:prepared.manifestHash,consentVersion:1});
  assert.equal(publishedResponse.status,200);const published=JSON.parse(publishedResponse.bytes);
  assert.equal(published.state,'ready'); assert(published.url.startsWith(`${CANONICAL_ORIGIN}/v/`));
  const token=published.url.slice(`${CANONICAL_ORIGIN}/v/`.length);assert(/^[A-Za-z0-9_-]{43}$/.test(token));
  const route=`/v/${token}`;
  const html=await c.web(route);assert.equal(html.status,200);assert(html.bytes.includes(Buffer.from('noindex')));assert(html.headers['cache-control']?.includes('no-store'));assert.equal(html.headers['referrer-policy'],'no-referrer');
  for(const value of [owner.id,visitor.id,withoutSocial.id,vote.id,...items,...mediaRows.map(row=>row.path),...mediaRows.map(row=>row.source_path),config.serviceRoleKey])assert(!html.bytes.includes(Buffer.from(value)),'public_HTML_private_identifier');
  for (const preview of previews) { const media=await c.web(`${route}/media/${preview.id}`);assert.equal(media.status,200);assert.equal(sha256(media.bytes),preview.sha256); }
  const og=await c.web(`${route}/og`,{timeout:55000});assert.equal(og.status,200);assert(og.headers['content-type']?.includes('image/png'));
  const optimizerRefusals=[];for(const alias of [route+'/media/'+previews[0].id,route.replace('/v/','/%76/')+'/media/'+previews[0].id]){const optimized=await c.web('/_next/image?url='+encodeURIComponent(alias)+'&w=640&q=75');assert.equal(optimized.status,400);assert(!optimized.headers['content-type']?.startsWith('image/'));optimizerRefusals.push({status:optimized.status,encodedAlias:alias.includes('%')});}
  const mutationHeaders={origin:CANONICAL_ORIGIN,'content-type':'application/json'};
  const badOrigin=await c.web(`${route}/device`,{method:'POST',headers:{...mutationHeaders,origin:'https://example.invalid'}});assert.equal(badOrigin.status,403);
  const first=await c.web(`${route}/device`,{method:'POST',headers:mutationHeaders});assert.equal(first.status,200);
  const cookie=cookieFromResponse(first.headers['set-cookie']?.[0]);
  const confirmed=await c.web(`${route}/device`,{method:'POST',headers:{...mutationHeaders,cookie}});assert.equal(JSON.parse(confirmed.bytes).confirmed,true);
  const privateName='PrivateName'+run,privateReason='private-reason-'+run;
  for (const choice of ['a','b']) {const ballot=await c.web(`${route}/ballot`,{method:'POST',headers:{...mutationHeaders,cookie},body:{choice,firstName:privateName,reason:privateReason}});assert.equal(ballot.status,200);assert.equal(JSON.parse(ballot.bytes).choice,choice);}
  const afterBallotHtml=await c.web(route);for(const secret of [privateName,privateReason])assert(!afterBallotHtml.bytes.includes(Buffer.from(secret)),'public_HTML_private_reason');
  const dto=await c.rpc('social_get_vote',{p_vote_id:vote.id,p_delivery_id:null,p_reasons_before:null,p_reasons_limit:30},owner.jwt);
  const suggestion=await c.owner(visitor.jwt,{action:'suggestion',token});assert.equal(suggestion.status,200);assert.equal(JSON.parse(suggestion.bytes).suggestion.user_id,owner.id);
  const suggestionRefusals=[];
  for(const [label,jwt] of [['anon',config.anonKey],['service',config.serviceRoleKey]]){const denied=await c.request('/rest/v1/rpc/social_vote_link_suggestion',{method:'POST',body:{p_token_hash:sha256(Buffer.from(token))},headers:{apikey:config.anonKey,authorization:`Bearer ${jwt}`,'content-type':'application/json'}});assert(denied.status>=400&&denied.status<500,label+'_suggestion_grant');suggestionRefusals.push({label,status:denied.status});}
  const self=await c.owner(owner.jwt,{action:'suggestion',token});assert.equal(self.status,200);assert.equal(JSON.parse(self.bytes).suggestion,null);
  const noProfile=await c.owner(withoutSocial.jwt,{action:'suggestion',token});assert.equal(noProfile.status,503);const noProfileRpc=await c.request('/rest/v1/rpc/social_vote_link_suggestion',{method:'POST',body:{p_token_hash:sha256(Buffer.from(token))},headers:{apikey:config.anonKey,authorization:`Bearer ${withoutSocial.jwt}`,'content-type':'application/json'}});assert.equal(JSON.parse(noProfileRpc.bytes).message,'social_profile_required');suggestionRefusals.push({label:'without_social_profile',status:noProfile.status,rpcStatus:noProfileRpc.status});
  const wrongOwner=await c.request('/rest/v1/rpc/social_get_vote',{method:'POST',body:{p_vote_id:vote.id,p_delivery_id:null,p_reasons_before:null,p_reasons_limit:30},headers:{apikey:config.anonKey,authorization:`Bearer ${visitor.jwt}`,'content-type':'application/json'}});assert(wrongOwner.status>=400);assert.equal(JSON.parse(wrongOwner.bytes).message,'social_play_unavailable');
  for(const [blocker,target] of [[owner,visitor],[visitor,owner]]){await c.rpc('social_block',{p_target:target.id},blocker.jwt);try{const blocked=await c.owner(visitor.jwt,{action:'suggestion',token});assert.equal(blocked.status,200);assert.equal(JSON.parse(blocked.bytes).suggestion,null);}finally{await c.rpc('social_unblock',{p_target:target.id},blocker.jwt);}}
  await c.rest('/rest/v1/social_rollout?id=eq.true',{enabled:false},undefined,'PATCH');try{const disabled=await c.owner(visitor.jwt,{action:'suggestion',token});assert(disabled.status!==200||JSON.parse(disabled.bytes).suggestion===null);suggestionRefusals.push({label:'switch_off',status:disabled.status});}finally{await c.rest('/rest/v1/social_rollout?id=eq.true',{enabled:true},undefined,'PATCH');}
  const deleted=await c.request(`/auth/v1/admin/users/${withoutSocial.id}`,{method:'DELETE',headers:{apikey:config.anonKey,authorization:`Bearer ${config.serviceRoleKey}`}});assert.equal(deleted.status,200);
  const deletedToken=await c.owner(withoutSocial.jwt,{action:'suggestion',token});assert.equal(deletedToken.status,401);suggestionRefusals.push({label:'deleted_user_JWT',status:deletedToken.status});
  for(const table of sideEffectTables)assert.deepEqual(await c.rest(`/rest/v1/${table}?select=*&limit=100`,undefined,undefined,'GET'),sideEffectsBefore[table],'suggestion_created_'+table);
  const notifications=await c.rest(`/rest/v1/style_play_notifications?vote_id=eq.${vote.id}&channel=eq.web&select=actor_id,delivery_id,channel&limit=10`,undefined,undefined,'GET');
  assert(notifications.length>0 && notifications.every(row=>row.actor_id===null&&row.delivery_id===null));
  const activity=await c.rest(`/rest/v1/social_activity?recipient_id=eq.${owner.id}&kind=eq.vote_received&subject=cs.${encodeURIComponent(JSON.stringify({vote_id:vote.id}))}&select=actor_id,actor_ids,kind,subject&limit=10`,undefined,undefined,'GET');
  assert(activity.length>0&&activity.every(row=>row.actor_id===null&&row.actor_ids.length===0&&row.subject.vote_id===vote.id));
  writeFileSync(resolve(proof,'reference.private.json'),JSON.stringify({owner,visitor,items,vote,prepared,published,previews,mediaRows,canonicals,dto,notifications,activity,publicationRefusals,suggestionRefusals,optimizerRefusals,privateOwnerDenial:wrongOwner.status,sideEffectsUnchanged:sideEffectTables,badOriginStatus:badOrigin.status},null,2),{mode:0o600});
  ledger.completed=true;save();return {ledger,owner,visitor,vote,prepared,published,previews,dto,token};
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assert(process.argv.length===4 && process.argv[2]==='--config','usage: vote-web-contract.mjs --config <private-config>');
  assert(process.env.VOTE_WEB_LOCAL_CONTRACT==='1','explicit_local_runtime_required');
  const config=checkConfig(privateJson(resolve(process.argv[3])));
  // Source-relative paths never resolve a network destination. Full lifecycle,
  // barriers, parser and physical cleanup are coordinated by the local bench.
  await referenceFlow(config);
  process.stdout.write('reference_flow_passed; cleanup and race evidence still required\n');
}
