import { cookies } from "next/headers"
import { PrivyClient } from "@privy-io/server-auth"
import { ADMIN_EMAILS, PRIVY_APP_ID } from "@/lib/constants"
import { postToDiscord } from "@/lib/discord"
import DashboardHeaderBar from "@/components/DashboardHeaderBar"
import { getEmailAddressFromPrivyUserObject } from "@/lib/privy-utils-client"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies()
  // Get a specific cookie by name
  const myCookie = cookieStore.get("privy-id-token")

  // Crear una instancia del cliente Privy
  const privyClient = new PrivyClient(
    PRIVY_APP_ID,
    process.env.PRIVY_APP_SECRET || ""
  )

  let user = null
  if (myCookie) {
    user = await privyClient.getUser({ idToken: myCookie.value })
  }

  if (!user) {
    return <div>No user found :( </div>
  }

  if (!user.email) {
    return <div>No email found</div>
  }

  const email = getEmailAddressFromPrivyUserObject(user)
  if (!email) {
    return <div>No email found (v2)</div>
  }

  if (!ADMIN_EMAILS.includes(email)) {
    return <div>You are not authorized to access this page</div>
  }

  return (
    <div>
      <DashboardHeaderBar />
      {children}
    </div>
  )
}

export default DashboardLayout
