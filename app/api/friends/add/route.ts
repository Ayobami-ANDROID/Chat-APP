import { fetchRedis } from "@/app/helpers/redis"
import { authOptions } from "@/app/lib/auth"
import { addFriendValidator } from "@/app/lib/valiations/add-friend"
import { getServerSession } from "next-auth"

export async function Post(req:Request){
    try {
        const body = await req.json()

        const {email:emailToAdd} = addFriendValidator.parse(body.email)

        const RestResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
            {
                headers:{
                    Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
                },
                cache:'no-store'
            }
        )
 
        const data = await RestResponse.json() as {result:string | null}
        
        const session = await getServerSession(authOptions)

        const idToAdd = data.result

        if(!session){
            return new Response ('Unathorizes',{status:401})
        }

        if(!idToAdd){
            return new Response('This person does not exist.',{status:400})
        }

        if(idToAdd === session.user.id){
            return new Response('YOu cannot add yourself as a friend')
        }


        const isAlreadyAdded = fetchRedis('sismember',`user:${idToAdd}:incoming_friend_requests`,session.user.id)


       
    } catch (error) {
        
    }
}