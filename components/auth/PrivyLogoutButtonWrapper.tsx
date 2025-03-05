"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "../ui/button"

const PrivyLogoutButtonWrapper = () => {
  const { logout } = usePrivy()
  return <Button onClick={logout}>Logout</Button>
}

export default PrivyLogoutButtonWrapper
