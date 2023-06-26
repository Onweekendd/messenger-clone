"use client"

import {FullFollowType, FullFriendRequestType} from "@/app/types"
import {Follows, FriendRequest, RequsetSatue, User} from "@prisma/client"
import {useSession} from "next-auth/react"
import React, {useState, useEffect, useMemo} from "react"
import {MdPersonSearch} from "react-icons/md"
import {VscBell} from "react-icons/vsc"
import UserAcceptedModal from "./UserAcceptedModal"

import UserBox from "./UserBox"
import {UserSearchModal} from "./UserSearchModal"
import {pusherClient} from "@/app/libs/pusher"
import {find} from "lodash"

interface UserListProps {
  otherUsers: User[]
  friendRequsets: FullFriendRequestType[]
  friends: User[]
}

const UserList: React.FC<UserListProps> = ({otherUsers, friendRequsets, friends}) => {
  const session = useSession()
  const [userSearchModalOpen, setUserSearchModalOpen] = useState(false)
  const [userAcceptedModalOpen, setUserAcceptedModalOpen] = useState(false)
  const [friendRequsetList, setFriendRequsetList] = useState<FullFriendRequestType[]>(friendRequsets)
  const [friendList, setFriendList] = useState<User[]>(friends)
  const [searchUserList, setSearchUserList] = useState<User[]>(
    otherUsers.filter((user) => friends.findIndex((z) => z.id === user.id) === -1)
  )
  const unHandleRequestNumber = friendRequsetList.filter(
    (friendRequset) =>
      friendRequset.status === RequsetSatue.PROCESS && friendRequset.sender.email !== session.data?.user?.email
  ).length

  console.log("searchUserList", searchUserList)

  const pusherKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])
  useEffect(() => {
    if (!pusherKey) {
      return
    }

    pusherClient.subscribe(pusherKey)

    const newRequsetHandler = (friendRequset: FullFriendRequestType) => {
      setFriendRequsetList((current) => {
        if (find(current, {id: friendRequset.id})) {
          return current
        }

        return [friendRequset, ...current]
      })
    }

    const updateRequsetHandler = (friendRequset: FullFriendRequestType) => {
      setFriendRequsetList((current) =>
        current.map((item) => {
          if (item.id === friendRequset.id) {
            return {
              ...friendRequset,
            }
          } else {
            return item
          }
        })
      )
    }

    const newFriendHandler = (friend: User) => {
      setFriendList((current) => {
        if (find(current, {id: friend.id})) {
          return current
        }
        return [friend, ...current]
      })
      setSearchUserList((current) => current.filter((user) => user.id !== friend.id))
    }

    const deleteFriendHandle = (follow: FullFollowType) => {
      setFriendList((current) => current.filter((user) => user.id !== follow.following.id))
      setSearchUserList((current) => {
        if (find(current, {id: follow.following.id})) {
          return current
        }
        return [follow.following, ...current]
      })
    }
    pusherClient.bind("friendRequset:new", newRequsetHandler)
    pusherClient.bind("friendRequset:update", updateRequsetHandler)
    pusherClient.bind("firendList:new", newFriendHandler)
    pusherClient.bind("friendList:delete", deleteFriendHandle)

    return () => {
      pusherClient.unsubscribe(pusherKey)
      pusherClient.unbind("friendRequset:new", newRequsetHandler)
      pusherClient.unbind("friendRequset:update", updateRequsetHandler)
      pusherClient.unbind("firendList:new", newFriendHandler)
      pusherClient.unbind("friendList:delete", deleteFriendHandle)
    }
  }, [pusherKey])
  return (
    <>
      <UserSearchModal
        users={searchUserList}
        onClose={() => setUserSearchModalOpen(false)}
        isOpen={userSearchModalOpen}
      />
      <UserAcceptedModal
        friendRequsets={friendRequsetList ?? []}
        onClose={() => setUserAcceptedModalOpen(false)}
        isOpen={userAcceptedModalOpen}
      />

      <aside
        className="
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-hidden
          border-r
          border-gray-200
          block
          w-full
          left-0
        "
      >
        <div className="px-5">
          <div className="flex-col">
            <div className="flex mb-4 pt-4 space-x-2">
              <div
                className="
                  text-2xl
                  font-bold
                  text-neutral-800
                  flex-1
                "
              >
                People
              </div>
              <div
                onClick={() => setUserSearchModalOpen(true)}
                className="
                  rounded-full
                  p-2
                  bg-gray-100
                  text-gray-600
                  cursor-pointer
                  hover:opacity-75
                  transition
                "
              >
                <MdPersonSearch size={20} />
              </div>
              <div
                onClick={() => setUserAcceptedModalOpen(true)}
                className="
                  rounded-full
                  p-2
                  bg-gray-100
                  text-gray-600
                  cursor-pointer
                  hover:opacity-75
                  relative
                  transition
                "
              >
                {unHandleRequestNumber > 0 && (
                  <div className="flex items-center justify-center text-sm w-4 h-4 absolute  top-[-4px] right-[-4px] rounded-full z-20 bg-red-500 ring-2 ring-white text-white">
                    {unHandleRequestNumber}
                  </div>
                )}
                <VscBell size={20} />
              </div>
            </div>
            {friendList.map((item) => (
              <UserBox key={item.id} data={item} />
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

export default UserList
