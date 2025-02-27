"use client"

import { useEffect } from "react"
import Title from "./Title"
import { Button } from "./ui/button"

const ExtensionInstalledOK = () => {
  const sendMessage = () => {
    window.postMessage(
      { type: "LINGOLIN_MESSAGE", data: "Hello from Next.js!" },
      "*"
    )
  }

  return (
    <div>
      <Title>ExtensionInstalledOK</Title>
      <Button onClick={sendMessage}>Send Message</Button>
    </div>
  )
}

export default ExtensionInstalledOK
