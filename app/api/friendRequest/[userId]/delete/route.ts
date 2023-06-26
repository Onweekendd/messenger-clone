import getCurrentUser from "@/app/action/getCurrentUser"
import prisma from "@/app/libs/prismadb"
import {pusherServer} from "@/app/libs/pusher"
import {RequsetSatue} from "@prisma/client"
import {NextResponse} from "next/server"

interface Iparams {
  userId?: string
}

export async function DELETE(requset: Request, {params}: {params: Iparams}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {status: 401})
    }
    const {userId} = params
    console.log("userId", userId)
    const receiver = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!receiver) {
      return new NextResponse("Unknown User", {status: 400})
    }
    const senderFollow = await prisma.follows.findFirst({
      where: {
        AND: [{followerId: currentUser.id}, {followingId: receiver.id}],
      },
      include: {
        follower: true,
        following: true,
      },
    })
    const receiverFollow = await prisma.follows.findFirst({
      where: {
        AND: [{followerId: receiver.id}, {followingId: currentUser.id}],
      },
      include: {
        follower: true,
        following: true,
      },
    })
    await prisma.$transaction([
      prisma.follows.delete({
        where: {
          id: senderFollow?.id,
        },
      }),
      prisma.follows.delete({
        where: {
          id: receiverFollow?.id,
        },
      }),
    ])

    pusherServer.trigger(senderFollow?.follower.email!, "friendList:delete", senderFollow)
    pusherServer.trigger(receiverFollow?.follower.email!, "friendList:delete", receiverFollow)
    return NextResponse.json({
      senderFollow: senderFollow,
      receiverFollow: receiverFollow,
    })
  } catch (error: any) {
    return new NextResponse("Internal Error", {status: 500})
  }
}
