"use client"

import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"

import LoginScreen from "./LoginScreen"

const ExtensionInstalledOK = () => {
  const { user } = usePrivy()

  useEffect(() => {
    if (user)
      window.postMessage(
        {
          type: "LINGOLIN_USER_ID",
          data: { id: user.id, email: user.email?.address },
        },
        "*"
      )
    else {
      window.postMessage({ type: "LINGOLIN_USER_ID", data: "-" }, "*")
    }
  }, [user])

  return (
    <div className="py-4">
      {user ? (
        <div>
          <div className="flex flex-col gap-2">
            <div>
              <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      ) : (
        <LoginScreen />
      )}
    </div>
  )
}

export default ExtensionInstalledOK
