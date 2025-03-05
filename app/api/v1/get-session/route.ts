import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord } from "@/lib/discord"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      await postErrorToDiscord("------ no userId wtf!")
      console.log("------ no userId wtf!")

      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const userAndCredits = await getUserAndCredits(userId)
    if (!userAndCredits) {
      await postErrorToDiscord("------ userAndCredits not found!!")
      console.log("------ userAndCredits not found!!")
      return NextResponse.json(
        { error: "userAndCredits not found" },
        { status: 400 }
      )
    }

    const { credits, tier } = userAndCredits

    console.log("------ userId: " + userId)
    console.log("------ credits: " + credits)
    console.log("------ tier: " + tier)

    return NextResponse.json(
      {
        credits,
        tier,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    )
  } catch (error) {
    await postErrorToDiscord("------ error on /api/v1/get-session!!")
    console.log("------ error on /api/v1/get-session: " + error)
    return NextResponse.json({ error: "error" }, { status: 500 })
  }
}
