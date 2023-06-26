import getCurrentUser from "@/app/action/getCurrentUser"
import prisma from "@/app/libs/prismadb"
import {pusherServer} from "@/app/libs/pusher"
import {RequsetSatue} from "@prisma/client"
import {NextResponse} from "next/server"

interface Iparams {
  friendRequestId?: string
}

export async function POST(requset: Request, {params}: {params: Iparams}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {status: 401})
    }
    const {friendRequestId} = params
    const {action} = await requset.json()
    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId,
      },
    })
    if (!friendRequest) {
      return new NextResponse("FrientRequset Do Not Exist", {status: 400})
    }
    if (action === "accept") {
      const updateFriendRequest = await prisma.friendRequest.update({
        where: {
          id: friendRequest?.id,
        },
        data: {
          status: RequsetSatue.ACCEPT,
        },
        include: {
          sender: true,
          receiver: true,
        },
      })

      const [senderFollows, receiverFollows] = await prisma.$transaction([
        //添加方
        prisma.follows.create({
          data: {
            followerId: friendRequest.senderId,
            followingId: friendRequest.receiverId,
          },
        }),
        //被添加方
        prisma.follows.create({
          data: {
            followerId: friendRequest.receiverId,
            followingId: friendRequest.senderId,
          },
        }),
      ])
      if (!senderFollows || !receiverFollows) {
        return new NextResponse("好友添加失败", {status: 400})
      }
      pusherServer.trigger(updateFriendRequest.sender.email!, "friendRequset:update", updateFriendRequest)
      pusherServer.trigger(updateFriendRequest.receiver.email!, "friendRequset:update", updateFriendRequest)
      pusherServer.trigger(updateFriendRequest.sender.email!, "firendList:new", updateFriendRequest.receiver)
      pusherServer.trigger(updateFriendRequest.receiver.email!, "firendList:new", updateFriendRequest.sender)
      //检查是否有双向请求 双方都有请求 一方同意 等于双方同意
      const doubleFriendRequest = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            {senderId: updateFriendRequest.receiverId},
            {receiverId: updateFriendRequest.senderId},
            {status: RequsetSatue.PROCESS},
          ],
        },
      })
      if (doubleFriendRequest) {
        const updateDoubleFriendRequest = await prisma.friendRequest.update({
          where: {
            id: doubleFriendRequest?.id,
          },
          data: {
            status: RequsetSatue.ACCEPT,
          },
          include: {
            sender: true,
            receiver: true,
          },
        })
        pusherServer.trigger(updateDoubleFriendRequest.sender.email!, "friendRequset:update", updateDoubleFriendRequest)
        pusherServer.trigger(
          updateDoubleFriendRequest.receiver.email!,
          "friendRequset:update",
          updateDoubleFriendRequest
        )
        pusherServer.trigger(
          updateDoubleFriendRequest.sender.email!,
          "firendList:new",
          updateDoubleFriendRequest.receiver
        )
        pusherServer.trigger(
          updateDoubleFriendRequest.receiver.email!,
          "firendList:new",
          updateDoubleFriendRequest.sender
        )
      }
      return NextResponse.json(updateFriendRequest)
    }
    if (action === "decline") {
      const updateFriendRequest = await prisma.friendRequest.update({
        where: {
          id: friendRequest?.id,
        },
        data: {
          status: RequsetSatue.DECLINE,
        },
        include: {
          sender: true,
          receiver: true,
        },
      })
      pusherServer.trigger(updateFriendRequest.sender.email!, "friendRequset:update", updateFriendRequest)
      pusherServer.trigger(updateFriendRequest.receiver.email!, "friendRequset:update", updateFriendRequest)
      return NextResponse.json(updateFriendRequest)
    }

    return new NextResponse("UnKnown Action", {status: 400})
  } catch (error: any) {
    return new NextResponse("Internal Error", {status: 500})
  }
}
