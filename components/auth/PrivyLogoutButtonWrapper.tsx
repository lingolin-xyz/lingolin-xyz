"use client"

import { usePrivy, useUser } from "@privy-io/react-auth"
import { Button } from "../ui/button"
import { AiOutlinePoweroff } from "react-icons/ai"
import { useEffect } from "react"
import { redirect } from "next/navigation"

const PrivyLogoutButtonWrapper = () => {
  const { logout } = usePrivy()

  const { ready } = usePrivy()
  const { user } = useUser()
  useEffect(() => {
    if (!ready) return
    if (!user) {
      redirect("/")
    }
  }, [user, ready])
  return (
    <Button onClick={logout} className="group">
      <div className="text-xs flex items-center gap-2">
        <div className="-translate-y-[1.5px] group-hover:rotate-[360deg] transition-all duration-500 group-active:scale-[60%] group-active:rotate-[720deg] group-active:duration-300">
          <AiOutlinePoweroff />
        </div>
        <div>Log Out</div>
      </div>
    </Button>
  )
}

export default PrivyLogoutButtonWrapper
