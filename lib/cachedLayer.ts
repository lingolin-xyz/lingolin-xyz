import { PrivyClient } from "@privy-io/server-auth"
import { writeCredits } from "./nillion/utils"
import { PRIVY_APP_ID } from "./constants"
import { readCredits } from "./nillion/utils"
import { logEvent } from "./postgres"
import { postErrorToDiscord, postToDiscord } from "./discord"
import { unstable_cache } from "next/cache"
import { getEmailAddressFromPrivyUserObject } from "./privy-utils-client"

export const getUserAndCredits = async (userId: string) => {
  return unstable_cache(
    async () => {
      const privyClient = new PrivyClient(
        PRIVY_APP_ID,
        process.env.PRIVY_APP_SECRET || ""
      )

      try {
        const user = await privyClient.getUserById(userId)

        if (!user) {
          console.log(" 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 ")

          return false
        }

        const email = getEmailAddressFromPrivyUserObject(user)

        const creditsForUser = await readCredits(userId)

        // console.log("Debug of readCredits..", creditsForUser)

        if (!creditsForUser) {
          // we add the initial credits for the first time and post that on discord to celebrate LFG!!
          await writeCredits({
            userid: userId,
            credits: 10,
          })

          await logEvent({
            event_type: "user_created",
            userId,
            extra: email || "",
          })

          await postToDiscord("🐣 adding 10 initial credits for " + email)

          const newCreditsForUser = await readCredits(userId)

          console.log(" FIREEEEEEEEE newCreditsForUser", newCreditsForUser)
          return {
            credits: 10,
            tier: 1,
            _id: newCreditsForUser._id,
          }
        }

        const credits = parseInt(creditsForUser.credits)

        return {
          credits,
          tier: 1,
          _id: creditsForUser._id,
        }
      } catch (error) {
        await postErrorToDiscord(
          "❌ Failed to use SecretVaultWrapper getUserAndCredits:"
        )
        console.error(
          "❌ Failed to use SecretVaultWrapper getUserAndCredits:",
          error
        )
        return false
      }
    },
    [`user-credits-${userId}`],
    {
      // revalidate: 2, // * (for quick testing)
      revalidate: 60 * 60 * 24 * 7, // Revalidar el caché cada 7 días
      tags: [`user-credits-${userId}`], // Tag para invalidar manualmente si es necesario
    }
  )()
}
