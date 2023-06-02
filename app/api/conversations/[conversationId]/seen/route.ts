import getCurrentUser from "@/app/action/getCurrentUser"
import {NextResponse} from "next/server"
import prisma from "@/app/libs/prismadb"

interface IParams {
  conversationId?: string
}
//params放置在第二个参数
export async function POST(request: Request, {params}: {params: IParams}) {
  try {
    const currentUser = await getCurrentUser()
    const {conversationId} = params
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    })

    if (!conversation) {
      return new NextResponse("Invaldd ID", {status: 400})
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1]

    if (!lastMessage) {
      return NextResponse.json(conversation)
    }

    const updateMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    return NextResponse.json(updateMessage)
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES_SEEN")
    return new NextResponse("Internal Error", {status: 500})
  }
}
