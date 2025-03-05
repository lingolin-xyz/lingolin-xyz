import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord } from "@/lib/discord"
import { updateCreditsValueById } from "@/lib/nillion/utils"
import { mintNftCreditsBatch } from "@/lib/web3functions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 SERVER MINT!!!!!")

  const { address, amount, userId } = await req.json()

  console.log(" 🍎  address: ", address)
  console.log(" 🍎  amount: ", amount)

  const txHash = await mintNftCreditsBatch({ address, amount })

  if (!txHash) {
    return NextResponse.json({ error: "Error minting NFTs" }, { status: 500 })
  }

  // increase in 50 the number of credits!

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
    userWithCredits.credits + 50 * amount
  )

  console.log(" 🍎  txHash: ", txHash)

  // increase credits

  // mint the NFTs as a batch, LFG!

  return NextResponse.json({ finished: true })
}
