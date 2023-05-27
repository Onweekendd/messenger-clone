import {useMemo} from "react"
import {usePathname} from "next/navigation"
import {HiChat} from "react-icons/hi"
import {HiArrowLeftOnRectangle, HiUser} from "react-icons/hi2"
import {signOut} from "next-auth/react"

import useConversation from "./useConversation"

const useRoutes = () => {
  const pathname = usePathname()
  const {conversationId} = useConversation()

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        herf: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        herf: "/users",
        icon: HiUser,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        herf: "/",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  )

  return routes
}

export default useRoutes
