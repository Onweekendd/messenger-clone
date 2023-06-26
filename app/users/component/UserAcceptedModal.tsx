"use client"
import Avatar from "@/app/components/Avatar"
import Modal from "@/app/components/Modal"
import {FullFriendRequestType} from "@/app/types"
import {FriendRequest, User} from "@prisma/client"
import axios from "axios"
import {useState} from "react"
import toast from "react-hot-toast"
import FriendRequestBox from "./FriendRequsetBox"

interface IUserAcceptedModalProps {
  friendRequsets: FullFriendRequestType[]
  isOpen: boolean
  onClose: () => void
}

const UserAcceptedModal: React.FC<IUserAcceptedModalProps> = ({friendRequsets, isOpen, onClose}) => {
  const [isLoading, setIsLoading] = useState(false)
  const onFriendRequestHandled = (action: "accept" | "decline", friendRequestId: string) => {
    setIsLoading(true)
    axios
      .post(`/api/friendRequest/handle/${friendRequestId}`, {
        action: action,
      })
      .then(() => {
        onClose()
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false))
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      好友请求
      <div className="mt-8 space-y-2">
        {friendRequsets.map((friendRequset) => (
          <FriendRequestBox
            key={friendRequset.id}
            friendRequset={friendRequset}
            isLoading={isLoading}
            onFriendRequestHandled={onFriendRequestHandled}
          />
        ))}
      </div>
    </Modal>
  )
}

export default UserAcceptedModal
