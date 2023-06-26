"use client"

import Avatar from "@/app/components/Avatar"
import {User} from "@prisma/client"
import {FC} from "react"
interface IRequsetUserBoxProps {
  user: User
}

const RequsetUserBox: FC<IRequsetUserBoxProps> = ({user}) => {
  return (
    <div className="flex">
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
        <p className="text-base text-gray-700">{user.name}</p>
        <p className="text-base text-gray-400">{user.email}</p>
      </div>
    </div>
  )
}

export default RequsetUserBox
