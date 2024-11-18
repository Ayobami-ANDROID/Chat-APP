import { fetchRedis } from "@/app/helpers/redis"
import { authOptions } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import { timeStamp } from "console"
import { getServerSession } from "next-auth"
import { nanoid } from 'nanoid'
import { Message, messageValidator } from "@/app/lib/valiations/message"


 export async function POST(req:Request){
    try {
        const{text,chatId}= await req.json()
        const session = await getServerSession(authOptions)

        if(!session) return new Response('UNATHORIZED',{status:401})
        
        const[userId1,userId2] = chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !==userId2){
            return new Response('Unauthorized high cheif',{status:401})
        } 

        const friendId = session.user.id === userId1 ? userId2 : userId1

        const friendList = (await fetchRedis('smembers',`user:${session.user.id}:friends`))as string[]
        const isFriend = friendList.includes(friendId)

        if(!isFriend){
            return new Response('Unathorized',{status:401})
        }

        const rawSender = await fetchRedis('get',`user:${session.user.id}`) as string
        const sender = JSON.parse(rawSender) as User

        //all valid, send the message

        const timeStamp = Date.now()

        const messageData:Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timeStamp, 
        }


        const message = messageValidator.parse(messageData)

        await db.zadd(`chat:${chatId}:messages`, {
            score: timeStamp,
            member: JSON.stringify(message),
          })


          return new Response('OK')
        // console.log("sender",sender)

         
    } catch (error) {
        if(error instanceof Error){
            return new Response(error.message,{status:500})
        }

        return new Response('Ínternal Server Error',{status:500})
    }
 }