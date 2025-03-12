"use client"

import NumberFlow from "@number-flow/react"
import { Button } from "./ui/button"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

const UserInDashboardMainList = ({ user }: { user: any }) => {
  const [credits, setCredits] = useState(user.credits)

  const handleMinus = async () => {
    const newCreditsValue = credits - 1
    setCredits(newCreditsValue)

    await fetch("/api/dashboard/users/update-credits", {
      method: "POST",
      body: JSON.stringify({ recordId: user._id, credits: newCreditsValue }),
    })
  }

  const handlePlus = async () => {
    setCredits(credits + 1)
    await fetch("/api/dashboard/users/update-credits", {
      method: "POST",
      body: JSON.stringify({ recordId: user._id, credits: credits + 1 }),
    })
  }

  return (
    <div className="flex items-center justify-between bg-zinc-100 p-3 px-6 rounded-lg">
      <div>
        <div>{user.email}</div>
        <div className="text-sm text-zinc-500">{user.userid}</div>
      </div>
      <div className="flex items-center gap-0">
        <Button variant="outline" size="icon" onClick={handleMinus}>
          <Minus size={12} />
        </Button>
        <div className="text-2xl tabular-nums font-bold tracking-tighter text-center w-16 translate-y-0.5">
          <NumberFlow value={credits} />
        </div>
        <Button variant="outline" size="icon" onClick={handlePlus}>
          <Plus size={18} />
        </Button>
      </div>
    </div>
  )
}

export default UserInDashboardMainList
