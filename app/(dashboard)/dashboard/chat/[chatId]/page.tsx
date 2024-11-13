import { fetchRedis } from '@/app/helpers/redis'
import { authOptions } from '@/app/lib/auth'
import { db } from '@/app/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params:{
     chatId:string
  }
}

async function getChatMessages(chatId:string){
    try {
        const result: string[] = await fetchRedis('zrange')
    } catch (error) {
        notFound()
    }
}

const page: FC<pageProps> = async({params}: pageProps) => {
    const {chatId} = params
    const session = await getServerSession(authOptions)

    if(!session) notFound()

    const {user} = session

    const[userId1,userId2]=chatId.split('--')

    if(user.id !== userId1 && user.id !== userId2){
        notFound()
    }


    const chatPatnerId = user.id === userId1 ? userId2 : userId1
    const chatPartner = (await db.get(`user:${chatPatnerId}`)) as User
    const initialMessages = await getChatMessages(chatId)


  return <div>{params.chatId}</div>
}

export default page