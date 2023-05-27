import React, {useCallback, useMemo} from "react"
import {useRouter} from "next/navigation"
import {Conversation, Message, User} from "@prisma/client"
import {format} from "date-fns"
import {useSession} from "next-auth/react"
import clsx from "clsx"

import {FullConversationType} from "@/app/types"
import useOtherUsers from "@/app/hooks/useOtherUser"
import Avatar from "@/app/components/Avatar"

interface ConversationBoxProps {
  data: FullConversationType
  selected: boolean
}
const ConversationBox: React.FC<ConversationBoxProps> = ({data, selected}) => {
  const otherUser = useOtherUsers(data)
  const session = useSession()
  const router = useRouter()

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data.id, router])

  const lastMessage = useMemo(() => {
    const message = data.Message || []
    return message[message.length - 1]
  }, [data.Message])

  const userEmail = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false
    }

    //seenArray 这条消息被哪些用户看到
    const seenArray = lastMessage.seen || []

    if (!userEmail) {
      return false
    }
    //判断已读用户中是否有当前用户
    return seenArray.filter((user) => user.email === userEmail).length !== 0
  }, [userEmail, lastMessage])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image"
    }

    if (lastMessage?.body) {
      return lastMessage.body
    }

    //没有消息的新对话
    return "Started a conversation"
  }, [lastMessage])
  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        space-x-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        p-3`,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
              flex
              justify-between
              items-center
              mb-1"
          >
            <p
              className="
                text-md
                font-medium
            text-gray-900"
            >
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createAt && (
              <p
                className="
                  text-xs
                 text-gray-400
                  font-light"
              >
                {format(new Date(lastMessage.createAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm`,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox
