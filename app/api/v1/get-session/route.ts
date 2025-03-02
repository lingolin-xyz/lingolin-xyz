import { getUserAndCredits } from "@/lib/cachedLayer"
import { PRIVY_APP_ID } from "@/lib/constants"
import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { readCredits, writeCredits } from "@/lib/nillion/utils"
import { logEvent } from "@/lib/postgres"
import { PrivyClient } from "@privy-io/server-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    await postErrorToDiscord("------ no userId wtf!")
    console.log("------ no userId wtf!")

    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const { credits, tier } = await getUserAndCredits(userId)

  return NextResponse.json({
    credits,
    tier,
  })

  // // Crear una instancia del cliente Privy
  // const privyClient = new PrivyClient(
  //   PRIVY_APP_ID,
  //   process.env.PRIVY_APP_SECRET || ""
  // )

  // const user = await privyClient.getUserById(userId)

  // const email = user.email?.address

  // const creditsForUser = await readCredits(userId)
  // if (!creditsForUser) {
  //   // we add the initial credits for the first time and post that on discord to celebrate LFG!!
  //   await writeCredits({
  //     userid: userId,
  //     credits: 10,
  //   })

  //   await logEvent({
  //     event_type: "user_created",
  //     userId,
  //     extra: email,
  //   })

  //   await postToDiscord("🐣 adding 10 initial credits for " + email)
  //   return NextResponse.json({
  //     credits: 10,
  //     tier: 1,
  //   })
  // }

  // const credits = parseInt(creditsForUser.credits)

  // return NextResponse.json({
  //   credits,
  //   tier: 1,
  // })
}
