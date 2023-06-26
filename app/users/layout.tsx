import getCurrentUser from "../action/getCurrentUser"
import getCurrentUserWithFriends from "../action/getCurrentUserWithFriends"
import getFriendRequests from "../action/getFriendRequests"
import getUsers from "../action/getUsers"
import Sidebar from "../components/sidebar/Sidebar"

import UserList from "./component/UserList"

export default async function UserLayout({children}: {children: React.ReactNode}) {
  const users = await getUsers()
  const friends = ((await getCurrentUserWithFriends())?.following ?? []).map((friend) => friend.following)
  const friendRequsets = await getFriendRequests()
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <UserList otherUsers={users} friends={friends} friendRequsets={friendRequsets} />
        {children}
      </div>
    </Sidebar>
  )
}
