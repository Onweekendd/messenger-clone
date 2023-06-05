import getConversations from "../action/getConversations"
import getUsers from "../action/getUsers"
import Sidebar from "../components/sidebar/Sidebar"

import ConversationList from "./components/ConversationList"

export default async function ConversationLayout({children}: {children: React.ReactNode}) {
  //获取对话信息
  const conversations = await getConversations()
  const users = await getUsers()
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList initialiItems={conversations} users={users} />
        {children}
      </div>
    </Sidebar>
  )
}
