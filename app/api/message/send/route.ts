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

         
    } catch (error) {
        
    }
 }