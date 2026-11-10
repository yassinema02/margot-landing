import { ImageResponse } from 'next/og';
import { readPublicVote, readPublicVoteMedia, type PublicVoteReadResult } from '@/lib/server/voteAccess';
import { VoteBudget } from '@/lib/server/voteBackend';
import { pickInviteLocale } from '@/lib/socialInvite';
import { VOTE_COPY } from '@/lib/voteCopy';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const HEADERS={'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
export async function GET(request:Request,{params}:{params:Promise<{token:string}>}) {
 const budget=new VoteBudget(Date.now(),request.signal);
 const {token}=await params,c=VOTE_COPY[pickInviteLocale(request.headers.get('accept-language'))];
 function neutral(result:PublicVoteReadResult){return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',background:'#ECEAE5',color:'#2D3A33',alignItems:'center',justifyContent:'center',fontSize:56}}>Margot · {c.title}</div>,{width:1200,height:630,status:result.status==='unavailable'?404:result.status==='limited'?429:503,headers:{...HEADERS,...(result.status==='limited'?{'Retry-After':String(result.retryAfter)}:{})}});}
 const result=await readPublicVote(token,request,budget);if(result.status!=='ok')return neutral(result);
 try {
  const options=[];
  for(const option of result.snapshot.options){
   const images:string[]=[];
   for(const piece of option.pieces){
    const id=piece.imageUrl.split('/').at(-1) as string;
    // Keep the visitor's request and budget: no self-fetch, arbitrary URL or
    // anonymous server IP taking the place of the visitor's quota context.
    const media=await readPublicVoteMedia(token,id,request,budget);
    if(!media.ok)return neutral(media.status===404?{status:'unavailable'}:media.status===429?{status:'limited',retryAfter:Number(media.headers.get('retry-after'))||60}:{status:'service_unavailable'});
    images.push('data:image/jpeg;base64,'+Buffer.from(await media.arrayBuffer()).toString('base64'));
   }
   options.push({choice:option.choice,images});
  }
  const png=new ImageResponse(<div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%',padding:32,background:'#ECEAE5',color:'#2D3A33'}}>
   <div style={{display:'flex',fontSize:36,marginBottom:20}}>Margot · {result.snapshot.initials} · {result.snapshot.occasion}</div>
   <div style={{display:'flex',flex:1,gap:24}}>{options.map(option=><div key={option.choice} style={{display:'flex',flexDirection:'column',width:556,padding:16,borderRadius:24,background:'#F6F4EF'}}>
    <div style={{display:'flex',fontSize:32,marginBottom:12}}>{option.choice.toUpperCase()}</div>
    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>{option.images.map((src,i)=><img key={i} src={src} alt="" width={option.images.length>4?164:248} height={option.images.length>4?130:190} style={{objectFit:'contain'}}/>)}</div>
   </div>)}</div>
  </div>,{width:1200,height:630,headers:HEADERS});
  if(!png.body)throw Error('empty_image');
  const reader=png.body.getReader(),chunks:Uint8Array[]=[];
  try {
   while(true){const chunk=await budget.run(()=>reader.read());if(chunk.done)break;chunks.push(chunk.value);}
  } catch(error){void reader.cancel().catch(()=>console.warn('[social-vote] image cancellation pending'));throw error;}
  finally{reader.releaseLock();}
  const bytes=Buffer.concat(chunks);
  const current=await readPublicVote(token,request,budget);
  if(current.status!=='ok')return neutral(current);
  // Closing the ballot changes no published image and keeps the lease readable.
  const initialContent={...result.snapshot,closed:current.snapshot.closed};
  if(JSON.stringify(current.snapshot)!==JSON.stringify(initialContent))return neutral({status:'unavailable'});
  return new Response(bytes,{headers:{...HEADERS,'Content-Type':'image/png'}});
 } catch {return neutral({status:'service_unavailable'});}
}
