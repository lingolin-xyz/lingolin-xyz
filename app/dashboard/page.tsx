"use client"

import HugeTitle from "@/components/HugeTitle"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const DashboardPage = () => {
  return (
    <div className="bg-orange-200 p-12 rounded-3xl mt-12 flex flex-col gap-3 items-center justify-center">
      <HugeTitle>Dashboard</HugeTitle>

      <div className="flex flex-col gap-3 w-60 mx-auto">
        <Link href="dashboard/translations">
          <Button>Translations</Button>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
