import { PrivyClient } from "@privy-io/server-auth"
import { PRIVY_APP_ID } from "./constants"
import { getEmailAddressFromPrivyUserObject } from "./privy-utils-client"

const privyClient = new PrivyClient(
  PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET || ""
)

export const getEmailAddressFromUserId = async (userId: string) => {
  try {
    const user = await privyClient.getUserById(userId)
    if (!user) {
      return null
    }
    return getEmailAddressFromPrivyUserObject(user)
  } catch (error) {
    console.log("Error getting email address from user ID:", error)
    return null
  }
}
