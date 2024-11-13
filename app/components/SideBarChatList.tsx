import { FC } from 'react'

interface SideBarChatListProps {
  friends:User[]
}

const SideBarChatList: FC<SideBarChatListProps> = ({friends}) => {
  return <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
     {friends.sort().map((friend) =>{
         return <div></div>
     })}
  </ul>
}

export default SideBarChatList