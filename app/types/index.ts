import {Conversation, Follows, FriendRequest, Message, User} from "@prisma/client"
import {type} from "os"

export type FullMessageType = Message & {
  sender: User
  seen: User[]
}

export type FullConversationType = Conversation & {
  users: User[]
  messages: FullMessageType[]
}

export type FullFriendRequestType = FriendRequest & {
  sender: User
  receiver: User
}

export type FullUserType = User & {
  followedBy: Follows[]
  following: Follows[]
}

export type FullFollowType = Follows & {
  follower: User
  following: User
}
