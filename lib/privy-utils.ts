import { PrivyClient } from "@privy-io/server-auth"
import { PRIVY_APP_ID } from "./constants"

const privyClient = new PrivyClient(
  PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET || ""
)

export const getEmailAddressFromUserId = async (userId: string) => {
  const user = await privyClient.getUserById(userId)
  return getEmailAddressFromPrivyUserObject(user)
}

export const getEmailAddressFromPrivyUserObject = (user: any) => {
  let emailFound = null
  user.linkedAccounts.forEach((account: any) => {
    if (account.type === "email") {
      emailFound = account.address
    } else if (account.type === "google_oauth") {
      emailFound = account.email
    }
  })
  return emailFound
}
