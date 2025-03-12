import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const res = await fetch(
    `https://api.0x.org/swap/permit2/quote?${searchParams}`,
    {
      headers: {
        "0x-api-key": process.env.NEXT_PUBLIC_ZEROEX_API_KEY as string,
        "0x-version": "v2",
      },
    }
  )
  const data = await res.json()

  // console.log(
  //   "quote api",
  //   `https://api.0x.org/swap/permit2/quote?${searchParams}`
  // )

  console.log("data", data)

  return Response.json(data)
}

// import { TESTNET_CHAIN_ID } from "@/lib/constants"
// import { updateCreditsValueById } from "@/lib/nillion/utils"
// import { headers } from "next/headers"
// import { NextResponse } from "next/server"

// export async function POST(req: Request) {
//   const { sellToken, buyToken, sellAmount, taker } = await req.json()

//   console.log("RECEIVED!!")
//   console.log(sellToken)
//   console.log(buyToken)
//   console.log(sellAmount)
//   console.log(taker)

//   console.log(" CALLING!!!!")

//   // 1. fetch price
//   const priceParams = new URLSearchParams({
//     chainId: TESTNET_CHAIN_ID.toString(),
//     sellToken,
//     buyToken,
//     sellAmount,
//     taker,
//   })

//   const headers = new Headers({
//     "Content-Type": "application/json",
//     "0x-api-key": "a5716be5-c0af-4027-a3aa-8767111dc74e", // Reemplaza con tu API key
//     "0x-version": "v2",
//   })

//   const priceResponse = await fetch(
//     "https://api.0x.org/swap/permit2/price?" + priceParams.toString(),
//     { headers }
//   )

//   const quote = await priceResponse.json()

//   console.log("quote")
//   console.log(quote)

//   return NextResponse.json({ buyAmount: quote.buyAmount, quote })
// }
