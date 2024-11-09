import { fetchRedis } from '@/app/helpers/redis'
import { authOptions } from '@/app/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'



const page: FC = async ({}) => {
    const session = await getServerSession(authOptions)

    if(!session) notFound()
    const IncomingSenderIds = (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as String[]).length

    // const incomingFriendRequests =await Promise.all()

  return <div>page</div>
}

export default page