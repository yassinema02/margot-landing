import { readPublicVoteMedia } from '@/lib/server/voteAccess';
import { VoteBudget } from '@/lib/server/voteBackend';
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export async function GET(request:Request,context:{params:Promise<{token:string;mediaId:string}>}):Promise<Response> {
 const budget=new VoteBudget(Date.now(),request.signal);
 const {token,mediaId}=await context.params;
 return readPublicVoteMedia(token,mediaId,request,budget);
}
