"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "./ui/button"
import { AiOutlinePoweroff } from "react-icons/ai"

const UserHeaderCorner = () => {
  const { user, logout } = usePrivy()

  if (!user) return null

  return (
    <div>
      <Button variant="outline" onClick={logout} className="group">
        <div className="text-xs flex items-center gap-2">
          <div className="-translate-y-[1.5px] group-hover:rotate-[360deg] transition-all duration-500 group-active:scale-[60%] group-active:rotate-[720deg] group-active:duration-300">
            <AiOutlinePoweroff />
          </div>
          <div>Log Out</div>
        </div>
      </Button>
    </div>
  )
}

export default UserHeaderCorner
