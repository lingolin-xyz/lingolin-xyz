import { cookies } from "next/headers"
import { PrivyClient } from "@privy-io/server-auth"
import { ADMIN_EMAILS, PRIVY_APP_ID } from "@/lib/constants"
import DashboardHeaderBar from "@/components/DashboardHeaderBar"
import { getEmailAddressFromPrivyUserObject } from "@/lib/privy-utils-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

  const email = getEmailAddressFromPrivyUserObject(user)
  if (!email) {
    return <div>No email found</div>
  }
  if (!email) {
    return <div>No email found (v2)</div>
  }

  if (!ADMIN_EMAILS.includes(email)) {
    return (
      <div className="p-4 w-full flex items-center justify-center flex-col gap-4">
        <div>You are not authorized to access this page</div>
        <Link href="/">
          <Button variant="outline">Go back to home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <DashboardHeaderBar />
      {children}
    </div>
  )
}

export default DashboardLayout
