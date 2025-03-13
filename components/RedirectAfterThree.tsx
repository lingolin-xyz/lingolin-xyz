"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const RedirectAfterThree = () => {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push("/profile")
    }, 1400)
  }, [router])

  return null
}

export default RedirectAfterThree
