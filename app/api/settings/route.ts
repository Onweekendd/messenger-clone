import getCurrentUser from "@/app/action/getCurrentUser"
import {NextResponse} from "next/server"

export async function POST(requset: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await requset.json()
    const {name, image} = body
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const updateUser = await prisma?.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: name,
        image: image,
      },
    })

    return NextResponse.json(updateUser)
  } catch (error: any) {
    console.log(error, "ERROR_SETTINGS")
    return new NextResponse("Internal Error", {status: 500})
  }
}
