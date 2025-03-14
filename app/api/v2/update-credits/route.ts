import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { updateCreditsValueById } from "@/lib/nillion/utils"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { units, userId } = body

  const userWithCredits = await getUserAndCredits(userId)
  if (!userWithCredits) {
    await postErrorToDiscord("User not found!!")
    return NextResponse.json({
      finished: false,
      error: "User not found",
    })
  }

  // update credits
  await updateCreditsValueById(
    userWithCredits._id,
    userWithCredits.credits + 50 * units
  )

  await postToDiscord(
    `Added ${50 * units} credits to user ${userId}. New total: ${
      userWithCredits.credits + 50 * units
    }`
  )

  revalidateTag(`user-credits-${userId}`)

  return NextResponse.json({
    finished: true,
    message: "Credits updated successfully",
  })
}
