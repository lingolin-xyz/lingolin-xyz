import { mintNftCreditsBatch } from "@/lib/web3functions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 SERVER MINT!!!!!")

  const { address, amount } = await req.json()

  console.log(" 🍎  address: ", address)
  console.log(" 🍎  amount: ", amount)

  const txHash = await mintNftCreditsBatch({ address, amount })

  if (!txHash) {
    return NextResponse.json({ error: "Error minting NFTs" }, { status: 500 })
  }

  console.log(" 🍎  txHash: ", txHash)

  // increase credits

  // mint the NFTs as a batch, LFG!

  return NextResponse.json({ finished: true })
}
