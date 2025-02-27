"use client"

import { useEffect } from "react"
import Title from "./Title"
import { Button } from "./ui/button"

import { usePrivy } from "@privy-io/react-auth"
import LoginButton from "./LoginButton"

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

  const sendMessage = () => {}

  return (
    <div>
      <Title>ExtensionInstalledOK</Title>
      {user ? (
        <div>
          <Button onClick={sendMessage}>Send Message</Button>
          <div>
            <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}

export default ExtensionInstalledOK
