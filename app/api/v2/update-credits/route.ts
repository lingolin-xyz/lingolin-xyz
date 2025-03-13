import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord } from "@/lib/discord"
import { updateCreditsValueById } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { address, amount, txHash, units, userId } = body

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
}
