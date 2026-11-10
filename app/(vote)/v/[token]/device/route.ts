import { initializePublicVoteDevice } from '@/lib/server/voteAccess';
import { VoteBudget } from '@/lib/server/voteBackend';
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export async function POST(request:Request,context:{params:Promise<{token:string}>}):Promise<Response> {
 const budget=new VoteBudget(Date.now(),request.signal);
 const {token}=await context.params;
 return initializePublicVoteDevice(token,request,budget);
}
