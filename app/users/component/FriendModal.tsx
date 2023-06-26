"use client"
import Avatar from "@/app/components/Avatar"
import Button from "@/app/components/Button"
import Modal from "@/app/components/Modal"
import {User} from "@prisma/client"
import axios from "axios"
import {useState} from "react"
import toast from "react-hot-toast"

interface IFriendModalProps {
  friend: User
  isOpen: boolean
  onClose: () => void
}

const FriendModal: React.FC<IFriendModalProps> = ({friend, isOpen, onClose}) => {
  const [isLoading, setIsLoading] = useState(false)
  const onDeleteUser = () => {
    setIsLoading(true)
    axios.delete(`/api/friendRequest/${friend.id}/delete`).finally(() => {
      setIsLoading(false)
      onClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center space-y-4">
        <Avatar user={friend} />
        <div className="text-neutral-600">{friend.name}</div>
        <div className="text-neutral-500">{friend.email}</div>
        <Button fullWidth disabled={isLoading} danger onClick={() => onDeleteUser()}>
          删除
        </Button>
      </div>
    </Modal>
  )
}

export default FriendModal
