"use client"

import LoginButton from "@/components/LoginButton"
import { usePrivy } from "@privy-io/react-auth"
import LoggedInHome from "@/components/LoggedInHome"
import NoExtensionFound from "@/components/NoExtensionFound"
import { useEffect, useState } from "react"

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
  if (isLoading) {
    return (
      <div className="py-6 max-w-7xl mx-auto w-full">
        <p>Loading...</p>
      </div>
    )
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
