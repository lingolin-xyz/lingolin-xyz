import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { monadTestnet } from "viem/chains"
import { getUserAndCredits } from "@/lib/cachedLayer"
import { postErrorToDiscord } from "@/lib/discord"
import { updateCreditsValueById } from "@/lib/nillion/utils"
import {
  NFT_CREDITS_CONTRACT_ADDRESS,
} from "@/lib/constants"

export async function POST(req: Request) {
  try {
    const { amount, userId, txHash } = await req.json()

    // Create a public client for reading blockchain data
    const client = createPublicClient({
      chain: monadTestnet,
      transport: http(process.env.MONAD_RPC_URL),
    })

    // Get transaction receipt
    const receipt = await client.getTransactionReceipt({ hash: txHash })

    // Verify the transaction was successful and it was to our NFT contract
    if (receipt.status !== 'success' || receipt.to !== NFT_CREDITS_CONTRACT_ADDRESS) {
      return NextResponse.json(
        { error: "Invalid or failed transaction" },
        { status: 400 }
      )
    }

    // Get user and update credits
    const userWithCredits = await getUserAndCredits(userId)
    if (!userWithCredits) {
      await postErrorToDiscord("User not found!!")
      return NextResponse.json({
        success: false,
        error: "User not found",
      })
    }

    // Update credits (50 credits per NFT)
    const newCredits = userWithCredits.credits + 50 * amount
    await updateCreditsValueById(userWithCredits._id, newCredits)

    return NextResponse.json({
      success: true,
      txHash,
      creditsAdded: 50 * amount,
      newTotalCredits: newCredits
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify transaction" },
      { status: 500 }
    )
  }
} 