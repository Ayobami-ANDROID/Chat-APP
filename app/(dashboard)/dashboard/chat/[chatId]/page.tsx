import { fetchRedis } from '@/app/helpers/redis'
import { authOptions } from '@/app/lib/auth'
import { db } from '@/app/lib/db'
import { messageArrayValidator } from '@/app/lib/valiations/message'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import Messages from '@/app/components/Messages'

interface pageProps {
  params:{
     chatId:string
  }
}

async function getChatMessages(chatId:string){
    try {
        const results: string[] = await fetchRedis('zrange',`chat:${chatId}:messages`,
            0,
            -1
        )

        const dmessages = results.map((message) => JSON.parse(message) as Message)

        const reversedDbMessages = dmessages.reverse()

        const messages = messageArrayValidator.parse(reversedDbMessages)
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


  return <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
    <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
            <div className='relative'>
                <div className='relative w-8 sm:w-12 h-8 sm:h-12 '>
                    <Image
                    fill
                    referrerPolicy='no-referrer'
                    src={chatPartner.image}
                    alt={`${chatPartner.name} profile picture`}
                    className='rounded-full'
                    />
                </div>
            </div>
            <div className='flex flex-col leading-tight'>
                <div className='text-xl flex items-center'>
                    <span  className='text-gray-700 mr-3 font-semibold'>{chatPartner.name}</span>
                </div>
                <span className='text-sm text-gray-600'>{chatPartner.email}</span>
            </div>
        </div>
    </div>
    <Messages/>
  </div>
}

export default page