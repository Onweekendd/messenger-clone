import getCurrentUser from "@/app/action/getCurrentUser"
import {NextResponse} from "next/server"
import prisma from "@/app/libs/prismadb"
import {pusherServer} from "@/app/libs/pusher"

interface Iparams {
  conversationId?: string
}

export async function DELETE(request: Request, {params}: {params: Iparams}) {
  try {
    const {conversationId} = params
    const currentUser = await getCurrentUser()
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    })

    if (!existingConversation) {
      return new NextResponse("Invalid Id", {status: 400})
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        //只有这个对话中的用户才有资格删除
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    })

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:remove", existingConversation)
      }
    })
    return NextResponse.json(deletedConversation)
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE")
    return new NextResponse("Internal Error", {status: 500})
  }
}
