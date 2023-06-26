"use client"

import Avatar from "@/app/components/Avatar"
import Input from "@/app/components/inputs/Input"
import Modal from "@/app/components/Modal"
import {User} from "@prisma/client"
import axios from "axios"
import {useEffect, useState} from "react"
import {FieldValues, useForm} from "react-hook-form"
import toast from "react-hot-toast"

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({isOpen, onClose, users}) => {
  const [showUsers, setShowUsers] = useState<User[]>([])
  const [searchContent, setSearchContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    watch,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      search: "",
    },
  })

  const marchSearchContent = (targetString: string, unMarchColor: number = 700, marchedColor: number = 500) => {
    const index = targetString.indexOf(searchContent)
    if (index === -1) {
      // 如果未找到，返回原字符串
      return <p className={`text-base text-gray-${unMarchColor}`}>{targetString}</p>
    } else {
      // 分割出现和未出现的部分
      const before = targetString.slice(0, index)
      const after = targetString.slice(index + searchContent.length)
      // 将两个部分放入 <p> 标签中
      return (
        <div className="flex">
          <p className={`text-base text-gray-${unMarchColor}`}>{before}</p>
          <p className={`text-base text-sky-${marchedColor}`}>{searchContent}</p>
          <p className={`text-base text-gray-${unMarchColor}`}>{after}</p>
        </div>
      )
    }
  }

  const onFriendRequestSent = (user: User) => {
    setIsLoading(true)
    axios
      .post(`/api/friendRequest/${user.id}`, {})
      .then(() => {
        onClose()
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    const subscription = watch(({search}) => {
      setSearchContent(search)
      if (search.length > 0) {
        setShowUsers(users.filter((user) => user.name?.includes(search) || user.email?.includes(search)))
      } else {
        setShowUsers([])
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if (searchContent.length > 0) {
      setShowUsers(users.filter((user) => user.name?.includes(searchContent) || user.email?.includes(searchContent)))
    } else {
      setShowUsers([])
    }
  }, [users.length])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form>
        <div className="space-y-6">
          <Input
            label="search by username or email"
            id="search"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          {showUsers.map((user) => (
            <div
              key={user.id}
              className="
                w-full
                flex
                items-center
                border-2
              border-neutral-200/60
                py-2
                px-4
                rounded-md
              "
            >
              <Avatar user={user} />
              <div
                className="
                  px-4
                  flex
                  flex-col
                  items-start
                  justify-center
                  flex-1
                "
              >
                {marchSearchContent(user.name ?? "", 700, 500)}
                {marchSearchContent(user.email ?? "", 400, 500)}
              </div>
              <button
                className="
                  p-2
                  bg-neutral-200
                  text-gray-500
                  text-xs
                  rounded-md
                  hover:bg-sky-500
                  hover:text-gray-200
                  cursor-pointer
                "
                onClick={() => onFriendRequestSent(user)}
                disabled={isLoading}
              >
                添加好友
              </button>
            </div>
          ))}
        </div>
      </form>
    </Modal>
  )
}
