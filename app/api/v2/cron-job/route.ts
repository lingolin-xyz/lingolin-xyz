import { readCredits, updateCreditsValueById } from "@/lib/nillion/utils"
import { postToDiscord } from "@/lib/discord"
import { NextResponse } from "next/server"

// Load environment variables
const SECRET_TOKEN = process.env.CRON_JOB_SECRET_TOKEN

export async function GET(request: Request) {
  // Get the token from query parameters
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  // Check if token matches
  if (token !== SECRET_TOKEN) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    )
  }

  try {
    const users = await readCredits()

    for (const user of users) {
      await updateCreditsValueById(user._id, user.credits + 20)
      await postToDiscord(
        `Added 20 credits to user ${user.userid}. New total: ${
          user.credits + 20
        }`
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
