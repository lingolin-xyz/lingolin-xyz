import HugeTitle from "@/components/HugeTitle"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { PrivyClient } from "@privy-io/server-auth"

import Link from "next/link"
import { PRIVY_APP_ID } from "@/lib/constants"

const DashboardPage = async () => {
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

  // Usar el método getUser del cliente

  return (
    <div className="bg-orange-200 p-12 rounded-3xl mt-12 flex flex-col gap-3 items-center justify-center">
      <HugeTitle>Dashboard</HugeTitle>

      <div>
        <div>Privy ID Token</div>
        <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
        <div>Privy ID Token</div>
      </div>
      <div className="flex flex-col gap-3 w-60 mx-auto">
        <Link href="dashboard/translations">
          <Button>Translations</Button>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
