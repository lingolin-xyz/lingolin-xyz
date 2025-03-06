import { postErrorToDiscord } from "@/lib/discord"
import { getRecentTTsByUserId } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      await postErrorToDiscord("------ no userId wtf!")
      console.log("------ no userId wtf!")

      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const tts = await getRecentTTsByUserId(userId)

    return NextResponse.json(tts, { status: 200 })
  } catch (error) {
    await postErrorToDiscord("------ error on /api/v2/get-recent-tts!!")
    console.log("------ error on /api/v2/get-recent-tts: " + error)
    return NextResponse.json({ error: "error" }, { status: 500 })
  }
}
