import {useSession} from "next-auth/react"
import {useMemo} from "react"
import {User} from "@prisma/client"

import {FullConversationType} from "../types"

const useOtherUsers = (conversation: FullConversationType | {user: User[]}) => {
  const session = useSession()
  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email
    const otherUser = conversation.user.filter((item) => item.email !== currentUserEmail)
    return otherUser[0]
  }, [session.data?.user?.email, conversation.user])

  return otherUser
}

export default useOtherUsers
