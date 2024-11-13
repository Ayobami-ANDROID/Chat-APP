import { usePathname, useRouter } from 'next/navigation'
import { FC,useState,useEffect } from 'react'

interface SideBarChatListProps {
  friends:User[]
}

const SideBarChatList: FC<SideBarChatListProps> = ({friends}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages,setUnseenMessages] = useState<Message[]>([])

    useEffect(() => {
        if(pathname?.includes('chat')){
            setUnseenMessages((prev) =>{
                return prev.filter((msg) => !pathname.includes(msg.senderId))
            })
        }
    },[pathname])
  return <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
     {friends.sort().map((friend) =>{
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
            return unseenMsg.senderId === friend.id
        }).length
         return <li key={friend.id}></li>
     })}
  </ul>
}

export default SideBarChatList