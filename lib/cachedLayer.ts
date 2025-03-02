import { PrivyClient } from "@privy-io/server-auth"
import { writeCredits } from "./nillion/utils"
import { PRIVY_APP_ID } from "./constants"
import { readCredits } from "./nillion/utils"
import { logEvent } from "./postgres"
import { postToDiscord } from "./discord"

export const getUserAndCredits = async (userId: string) => {
  // Crear una instancia del cliente Privy
  const privyClient = new PrivyClient(
    PRIVY_APP_ID,
    process.env.PRIVY_APP_SECRET || ""
  )

  const user = await privyClient.getUserById(userId)

  const email = user.email?.address

  const creditsForUser = await readCredits(userId)
  if (!creditsForUser) {
    // we add the initial credits for the first time and post that on discord to celebrate LFG!!
    await writeCredits({
      userid: userId,
      credits: 10,
    })

    await logEvent({
      event_type: "user_created",
      userId,
      extra: email,
    })

    await postToDiscord("🐣 adding 10 initial credits for " + email)
    return {
      credits: 10,
      tier: 1,
    }
  }

  const credits = parseInt(creditsForUser.credits)

  return {
    credits,
    tier: 1,
  }
}
