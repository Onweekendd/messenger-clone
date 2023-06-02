"use client"

import useConversation from "@/app/hooks/useConversation"
import {FullMessageType} from "@/app/types"
import axios from "axios"
import {useEffect, useRef, useState} from "react"
import MessageBox from "./MessageBox"

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
