import getConversationById from "@/app/action/getConversationById"
import getMessages from "@/app/action/getMessage"
import EmptyState from "@/app/components/EmptyState"
import Body from "./components/Body"
import Form from "./components/Form"
import Header from "./components/Header"
import getCurrentUserWithFriends from "@/app/action/getCurrentUserWithFriends"
import getCurrentUser from "@/app/action/getCurrentUser"

interface IParams {
  conversationId: string
}

const ConversationId = async ({params}: {params: IParams}) => {
  const currentUser = await getCurrentUser()
  const conversation = await getConversationById(params.conversationId)
  const messages = await getMessages(params.conversationId)
  const friends = ((await getCurrentUserWithFriends())?.following ?? []).map((friend) => friend.following)
  const checkIsFriend = () => {
    if (conversation?.isGroup) return true
    const conversationOtherUser = conversation?.users.filter((user) => user.id != currentUser?.id)[0]
    return friends.findIndex((friend) => friend.id === conversationOtherUser?.id) === -1 ? (
      <div className="flex flex-col items-center border-t-neutral-200 border border-solid p-2 text-sm text-neutral-400">
        当前用户已不是好友
      </div>
    ) : (
      <Form />
    )
  }
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        {checkIsFriend()}
      </div>
    </div>
  )
}

export default ConversationId
