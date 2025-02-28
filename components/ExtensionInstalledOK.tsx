"use client"

import { useEffect } from "react"
import Title from "./Title"
import { Button } from "./ui/button"

import { usePrivy } from "@privy-io/react-auth"
import LoginButton from "./LoginButton"

const ExtensionInstalledOK = () => {
  const { user, logout } = usePrivy()

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
      <Title>User has extension!!</Title>
      {user ? (
        <div>
          <div className="flex flex-col gap-2">
            <div>
              <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}

export default ExtensionInstalledOK
