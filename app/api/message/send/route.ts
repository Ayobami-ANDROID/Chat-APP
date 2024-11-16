import { fetchRedis } from "@/app/helpers/redis"
import { authOptions } from "@/app/lib/auth"
import { getServerSession } from "next-auth"

 export async function POST(req:Request){
    try {
        const{text,chatId}= await req.json()
        const session = await getServerSession(authOptions)

        if(!session) return new Response('UNATHORIZED',{status:401})
        
        const[userId1,userId2] = chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !==userId2){
            return new Response('Unauthorized',{status:401})
        } 

        const friendId = session.user.id === userId1 ? userId2 : userId1

        const friendList = (await fetchRedis('smembers',`user:${session.user.id}:friends`))as string[]
        const isFriend = friendList.includes(friendId)

        if(!isFriend){
            return new Response('Unathorized',{status:401})
        }

        const sender = await fetchRedis('get',`user:${session.user.id}`) as User
        console.log("sender",sender)

         
    } catch (error) {
        
    }
 }