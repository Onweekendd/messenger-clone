"use client"

import {RequsetSatue} from "@prisma/client"
import {useSession} from "next-auth/react"
import {FC} from "react"
import {FullFriendRequestType} from "../../types"
import Button from "@/app/components/Button"
import RequsetUserBox from "./RequsetUserBox"
import format from "date-fns/format"
import {HiChevronDoubleDown} from "react-icons/hi2"
interface IFriendRequestBoxProps {
  friendRequset: FullFriendRequestType
  isLoading: boolean
  onFriendRequestHandled: (action: "accept" | "decline", receiverId: string) => void
}

const FriendRequestBox: FC<IFriendRequestBoxProps> = ({friendRequset, isLoading, onFriendRequestHandled}) => {
  const session = useSession()
  const {status, receiver} = friendRequset
  const isReceiver = receiver.email === session.data?.user?.email

  const renderFriendRequestButton = () => {
    if (status === RequsetSatue.PROCESS) {
      return isReceiver ? (
        <div className="flex space-x-2">
          {<Button onClick={() => onFriendRequestHandled("accept", friendRequset.id)}>同意</Button>}
          {
            <Button danger onClick={() => onFriendRequestHandled("decline", friendRequset.id)}>
              拒绝
            </Button>
          }
        </div>
      ) : (
        <Button onClick={() => {}} disabled secondary>
          请求已发送
        </Button>
      )
    }
    if (status === RequsetSatue.ACCEPT) {
      return (
        <Button onClick={() => {}} disabled secondary>
          已同意
        </Button>
      )
    }
    if (status === RequsetSatue.DECLINE) {
      return (
        <Button onClick={() => {}} disabled secondary>
          已拒绝
        </Button>
      )
    }
  }
  return (
    <div
      className="
        flex 
        flex-col 
        space-y-4
        border-2 
      border-neutral-200/60
        rounded-md
        items-center
        py-2
        px-4
      "
    >
      <div
        className="
          w-full
          flex
          items-center
          flex-1
        "
      >
        <div className="flex flex-col items-start justify-center space-y-2 flex-1">
          <RequsetUserBox user={friendRequset.sender} />
          <div className="text-sky-500 ml-3">
            <HiChevronDoubleDown size={20} />
          </div>
          <RequsetUserBox user={friendRequset.receiver} />
        </div>
        {renderFriendRequestButton()}
      </div>
      <div className="text-sm text-gray-400">{format(new Date(friendRequset.createAt), "PPpp")}</div>
    </div>
  )
}

export default FriendRequestBox
