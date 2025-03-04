"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "./ui/button"
import { AiOutlinePoweroff } from "react-icons/ai"
import Link from "next/link"
import { IoDocumentTextOutline } from "react-icons/io5"
import { usePathname } from "next/navigation"

const UserHeaderCorner = () => {
  const { user, logout } = usePrivy()
  const pathname = usePathname()

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      {pathname !== "/notepad" && (
        <Link href="/notepad">
          <Button variant="outline" className="group">
            <div className="text-xs flex items-center gap-2">
              <div className="-translate-y-[1.5px] group-hover:rotate-[360deg] transition-all duration-500 group-active:scale-[60%] group-active:rotate-[720deg] group-active:duration-300">
                <IoDocumentTextOutline />
              </div>
              <div>Notepad</div>
            </div>
          </Button>
        </Link>
      )}
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
