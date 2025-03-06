"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "./ui/button"
import Link from "next/link"
import { IoDocumentTextOutline } from "react-icons/io5"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

const UserHeaderCorner = () => {
  const { user, logout } = usePrivy()
  const pathname = usePathname()

  const [isBye, setIsBye] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      {/* {pathname !== "/notepad" && (
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
      )} */}
      <Link
        href="/profile"
        className="group px-2 bg-zinc-100 transition-all duration-500 hover:bg-emerald-700 text-black hover:text-white rounded-lg flex items-center justify-center gap-2"
        onMouseLeave={() => {
          setIsHovered(false)
          setIsBye(!isBye)
        }}
        onMouseEnter={() => setIsHovered(true)}
      >
        <div className="font-bold tracking-tight translate-y-[1px]">
          My Account
        </div>
        <div className="rounded-full border-zinc-700 group-active:opacity-60 group-hover:border-emerald-600 border-2 w-10 h-10 overflow-hidden group-hover:scale-[130%] transition-all duration-500 group-active:scale-[95%] group-active:rotate-[720deg] group-active:duration-300 relative">
          <img
            draggable={false}
            alt="pfp"
            src="/images/pfp.png"
            className="scale-[180%] translate-y-2.5 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ opacity: isBye ? 1 : 0 }}
              transition={{
                duration: 0.1,
              }}
            >
              <img
                draggable={false}
                alt="pfp"
                src="/images/pfpbye.png"
                className="scale-[180%] translate-y-2.5 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500"
              />
            </motion.div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{
                duration: 0.1,
              }}
            >
              <img
                draggable={false}
                alt="pfp"
                src="/images/pfphover.png"
                className="scale-[180%] translate-y-2.5 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500"
              />
            </motion.div>
          </div>
        </div>
      </Link>
      {/* <Button variant="outline" onClick={logout} className="group">
        <div className="text-xs flex items-center gap-2">
          <div className="-translate-y-[1.5px] group-hover:rotate-[360deg] transition-all duration-500 group-active:scale-[60%] group-active:rotate-[720deg] group-active:duration-300">
            <AiOutlinePoweroff />
          </div>
          <div>Log Out</div>
        </div>
      </Button> */}
    </div>
  )
}

export default UserHeaderCorner
