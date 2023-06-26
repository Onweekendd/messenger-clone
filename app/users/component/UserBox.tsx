"use client"
import {User} from "@prisma/client"
import axios from "axios"
import {useRouter} from "next/navigation"
import React, {SyntheticEvent, useCallback, useState} from "react"
import {HiBars3} from "react-icons/hi2"
import Avatar from "@/app/components/Avatar"
import LoadingModal from "@/app/components/LoadingModal"
import FriendModal from "./FriendModal"

interface UserBoxProps {
  data: User
}

const UserBox: React.FC<UserBoxProps> = ({data}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const handleClick = useCallback(() => {
    setIsLoading(true)

    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`)
      })
      .finally(() => setIsLoading(false))
  }, [data, router])
  return (
    <>
      {isLoading && <LoadingModal />}
      <FriendModal isOpen={open} onClose={() => setOpen(false)} friend={data} />
      <div
        onClick={handleClick}
        className="
              w-full
              relative
              flex
              items-center
              space-x-3
              bg-white
              p-3
              hover:bg-neutral-100
              rounded-lg
              transition
              cursor-pointer
            "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div
              className="
                flex
                justify-between
                items-center
                mb-1
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                {data.name}
              </p>
            </div>
          </div>
        </div>
        <button
          className="
            p-2
            rounded-md
            hover:bg-neutral-300
            cursor-pointer
          "
          disabled={isLoading}
          onClick={(event: SyntheticEvent) => {
            setOpen(true)
            event.stopPropagation()
          }}
        >
          <HiBars3 size={20} />
        </button>
      </div>
    </>
  )
}

export default UserBox
