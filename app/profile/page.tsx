import Title from "@/components/Title"
import { PRIVY_APP_ID } from "@/lib/constants"
import { PrivyClient } from "@privy-io/server-auth"
import { cookies } from "next/headers"
import PrivyLogoutButtonWrapper from "@/components/auth/PrivyLogoutButtonWrapper"
import { redirect } from "next/navigation"

const ProfilePage = async () => {
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
    redirect("/")
    // return <div>No user found :( </div>
  }

  return (
    <div>
      <Title>ProfilePage</Title>
      <PrivyLogoutButtonWrapper />
      <div>
        <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  )
}

export default ProfilePage
