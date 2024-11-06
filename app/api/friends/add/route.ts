import { addFriendValidator } from "@/app/lib/valiations/add-friend"

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
 
        const data = await RestResponse.json()
    } catch (error) {
        
    }
}