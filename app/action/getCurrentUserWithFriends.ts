import getSession from "./getSession"

const getCurrentUserWithFriends = async () => {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await prisma?.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        following: {
          include: {
            follower: true,
            following: true,
          },
        },
      },
    })

    if (!currentUser) {
      return null
    }

    return currentUser
  } catch (error: any) {
    return null
  }
}

export default getCurrentUserWithFriends
