import getCurrentUser from "@/app/action/getCurrentUser"
import prisma from "@/app/libs/prismadb"
import {pusherServer} from "@/app/libs/pusher"
import {RequsetSatue} from "@prisma/client"
import {NextResponse} from "next/server"

interface Iparams {
  userId?: string
}

export async function POST(requset: Request, {params}: {params: Iparams}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {status: 401})
    }
    const {userId} = params
    const receiver = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!receiver || !receiver.id || !receiver.email) {
      return new NextResponse("No Known User", {status: 404})
    }

    //检查是否存在好友请求
    const checkFriendRequset = await prisma.friendRequest.findFirst({
      where: {
        AND: [{senderId: currentUser.id}, {receiverId: userId}],
      },
    })
    if (!checkFriendRequset || checkFriendRequset.status !== RequsetSatue.PROCESS) {
      //创建一个好友请求
      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderId: currentUser.id,
          receiverId: receiver.id,
          status: RequsetSatue.PROCESS,
        },
        include: {
          receiver: true,
          sender: true,
        },
      })

      pusherServer.trigger(friendRequest.sender.email!, "friendRequset:new", friendRequest)
      pusherServer.trigger(friendRequest.receiver.email!, "friendRequset:new", friendRequest)

      return NextResponse.json(friendRequest)
    }

    return NextResponse.json("请求已发送")
  } catch (error: any) {
    return new NextResponse("Internal Error", {status: 500})
  }
}
