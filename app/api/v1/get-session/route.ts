import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord } from "@/lib/discord"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    await postErrorToDiscord("------ no userId wtf!")
    console.log("------ no userId wtf!")

    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const { credits, tier } = await getUserAndCredits(userId)

  return NextResponse.json({
    credits,
    tier,
  })
}
