import { Button } from "@/components/ui/button"

import Link from "next/link"
import Title from "@/components/Title"

const DashboardPage = async () => {
  // Usar el método getUser del cliente

  return (
    <div className="bg-orange-100 p-12 rounded-xl mt-12 flex flex-col gap-3 items-center justify-center">
      <Title>Dashboard</Title>

      <div>Dashboard home is coming soon</div>
    </div>
  )
}

export default DashboardPage
