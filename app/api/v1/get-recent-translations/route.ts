import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord } from "@/lib/discord"
import { getRecentTranslationsByUserId } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      await postErrorToDiscord("------ no userId wtf!")
      console.log("------ no userId wtf!")

      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const translations = await getRecentTranslationsByUserId(userId)

    return NextResponse.json(translations, { status: 200 })
  } catch (error) {
    await postErrorToDiscord("------ error on /api/v1/get-session!!")
    console.log("------ error on /api/v1/get-session: " + error)
    return NextResponse.json({ error: "error" }, { status: 500 })
  }
}
