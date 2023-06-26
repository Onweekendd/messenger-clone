import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"

const getFriendRequsets = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser?.id) {
    return []
  }
  try {
    const friendRequests = await prisma?.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: currentUser.id,
          },
          {
            receiverId: currentUser.id,
          },
        ],
      },
      orderBy: {
        createAt: "desc",
      },
      include: {
        sender: true,
        receiver: true,
      },
    })
    console.log("friendRequests", friendRequests)
    return friendRequests
  } catch (error: any) {
    return []
  }
}

export default getFriendRequsets
