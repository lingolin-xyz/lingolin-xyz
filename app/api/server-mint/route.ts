import { mintNftCreditsBatch } from "@/lib/web3functions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 SERVER MINT!!!!!")

  const { address, amount } = await req.json()

  console.log(" 🍎  address: ", address)
  console.log(" 🍎  amount: ", amount)

  await mintNftCreditsBatch({ address, amount })

  // increase credits

  // mint the NFTs as a batch, LFG!

  return NextResponse.json({ finished: true })
}
