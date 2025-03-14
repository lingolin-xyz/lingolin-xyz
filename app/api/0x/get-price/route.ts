import { TESTNET_CHAIN_ID } from "@/lib/constants"
import { postToDiscord } from "@/lib/discord"
import { updateCreditsValueById } from "@/lib/nillion/utils"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { sellToken, buyToken, sellAmount, taker } = await req.json()

  console.log("RECEIVED!!")
  console.log(sellToken)
  console.log(buyToken)
  console.log(sellAmount)
  console.log(taker)

  console.log(" CALLING!!!!")

  // 1. fetch price
  const priceParams = new URLSearchParams({
    chainId: TESTNET_CHAIN_ID.toString(),
    sellToken,
    buyToken,
    sellAmount,
    taker,
  })

  const headers = new Headers({
    "Content-Type": "application/json",
    "0x-api-key": process.env.NEXT_PUBLIC_ZEROEX_API_KEY as string,
    "0x-version": "v2",
  })

  try {
    const priceResponse = await fetch(
      "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
      { headers }
    )

    const quote = await priceResponse.json()

    console.log("quote")
    console.log(quote)

    await postToDiscord("0x Price called!")

    return NextResponse.json({ buyAmount: quote.buyAmount, quote })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: "Error fetching price" }, { status: 500 })
  }
}
