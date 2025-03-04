import { Button } from "@/components/ui/button"

import Link from "next/link"
import Title from "@/components/Title"

const DashboardPage = async () => {
  // Usar el método getUser del cliente

  return (
    <div className="bg-orange-200 p-12 rounded-3xl mt-12 flex flex-col gap-3 items-center justify-center">
      <Title>Dashboard</Title>

      <div className="flex flex-col gap-3 w-60 mx-auto">
        <Link href="dashboard/translations">
          <Button>Translations</Button>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
