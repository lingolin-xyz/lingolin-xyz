import { postToDiscord } from "@/lib/discord"
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

  await postToDiscord("0x Quote called!")

  console.log("data", data)

  return Response.json(data)
}
