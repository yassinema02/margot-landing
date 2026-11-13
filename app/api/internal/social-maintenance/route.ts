import { createHash, timingSafeEqual } from 'node:crypto';
import { purgeVoteCopies } from '@/lib/server/voteCleanup';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function response(body:Record<string,unknown>,status=200):Response {
 return Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request):Promise<Response> {
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!key)return response({error:'unavailable'},503);
 const supplied=request.headers.get('authorization')??'';
 // Hashing first keeps the comparison fixed-length even for an invalid token.
 const digest=(value:string)=>createHash('sha256').update(value).digest();
 if(!timingSafeEqual(digest(supplied),digest(`Bearer ${key}`)))return response({error:'unauthorized'},401);
 let value:unknown;
 try{if(Number(request.headers.get('content-length')??0)>1024)return response({error:'invalid'},400);const text=await request.text();if(text.length>1024)return response({error:'invalid'},400);value=JSON.parse(text);}catch{return response({error:'invalid'},400);}
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==1||!('limit' in value)||!Number.isSafeInteger(value.limit)||Number(value.limit)<1||Number(value.limit)>100)return response({error:'invalid'},400);
 try{return response(await purgeVoteCopies(Number(value.limit)));}
 catch{console.warn('[social-maintenance] purge pending');return response({error:'unavailable'},503);}
}
