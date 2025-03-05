import { PrivyClient } from "@privy-io/server-auth"
import { PRIVY_APP_ID } from "./constants"
import { getEmailAddressFromPrivyUserObject } from "./privy-utils-client"

const privyClient = new PrivyClient(
  PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET || ""
)

export const getEmailAddressFromUserId = async (userId: string) => {
  const user = await privyClient.getUserById(userId)
  return getEmailAddressFromPrivyUserObject(user)
}
