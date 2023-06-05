"use client"

import useConversation from "@/app/hooks/useConversation"
import {FullMessageType} from "@/app/types"
import axios from "axios"
import {useEffect, useRef, useState} from "react"
import MessageBox from "./MessageBox"
import {pusherClient} from "@/app/libs/pusher"
import {find} from "lodash"

interface BodyProps {
  initialMessages: FullMessageType[] | null
}

const Body: React.FC<BodyProps> = ({initialMessages}) => {
  const [messages, setMessages] = useState(initialMessages)
  const buttomRef = useRef<HTMLDivElement>(null)

  const {conversationId} = useConversation()

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    buttomRef.current?.scrollIntoView()

    //新增信息
    const messageHandle = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)
      setMessages((current) => {
        if (find(current, {id: message.id})) {
          return current
        }

        return [...current!, message]
      })

      buttomRef.current?.scrollIntoView()
    }

    const updateMessageHandle = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current!.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage
          }

          return currentMessage
        })
      )
    }

    pusherClient.bind("messages:new", messageHandle)
    pusherClient.bind("messages:update", updateMessageHandle)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind("messages:new", messageHandle)
      pusherClient.unbind("messages:update", updateMessageHandle)
    }
  }, [conversationId])
  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />
      ))}
      <div ref={buttomRef} className="pt-24" />
    </div>
  )
}

export default Body
