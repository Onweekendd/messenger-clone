import prisma from "@/app/libs/prismadb"

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      //使用 asc 的原因 ： 最新的消息在底部
      orderBy: {
        createAt: "asc",
      },
    })

    return messages
  } catch (error: any) {
    return null
  }
}

export default getMessages
