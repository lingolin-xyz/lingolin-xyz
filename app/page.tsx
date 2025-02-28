"use client"

import LoginButton from "@/components/LoginButton"
import { usePrivy } from "@privy-io/react-auth"
import LoggedInHome from "@/components/LoggedInHome"
import ExtensionInstalledOK from "@/components/ExtensionInstalledOK"
import NeedToInstallExtension from "@/components/NeedToInstallExtension"
import NoExtensionFound from "@/components/NoExtensionFound"
import LandingWhileLoading from "@/components/LandingWhileLoading"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {
  const { user } = usePrivy()
  const [hasTheExtension, setHasTheExtension] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      let hasLingolin = (window as unknown as { hasLingolin?: boolean })
        .hasLingolin

      if (!hasLingolin) {
        hasLingolin = document.getElementById("lingolin-marker") !== null
      }
      setHasTheExtension(hasLingolin)
      setIsLoading(false)
    }, 200)
  }, [])

  return (
    <div>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // transition={{ duration: 0.5 }}
          >
            <LandingWhileLoading />
          </motion.div>
        )}
      </AnimatePresence>
      {hasTheExtension && <ExtensionInstalledOK />}
      {!hasTheExtension && <NoExtensionFound />}
    </div>
  )
  if (isLoading) {
    return <LandingWhileLoading />
  }

  if (!hasTheExtension) {
    return <NoExtensionFound />
  } else {
    return (
      <div className="py-6 max-w-7xl mx-auto w-full">
        <p>Lingolin extension found!</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="py-6 max-w-7xl mx-auto w-full">
        <LoginButton />
      </div>
    )
  }
  return (
    <div className="py-6 max-w-7xl mx-auto w-full">
      <LoggedInHome />
    </div>
  )
}
