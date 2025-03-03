"use client"

import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"

import LoginScreen from "./LoginScreen"
import BigTitle from "./BigTitle"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"

const ExtensionInstalledOK = () => {
  const { user } = usePrivy()

  const { toast } = useToast()

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
          <div className="flex flex-col gap-6 py-12 max-w-2xl mx-auto justify-center items-center">
            <BigTitle>Welcome to Lingolin!</BigTitle>
            <Button
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "We're working on it!",
                })
              }}
            >
              Watch Tutorial Video
            </Button>
            {/* <div>
              <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
            </div> */}
          </div>
        </div>
      ) : (
        <LoginScreen />
      )}
    </div>
  )
}

export default ExtensionInstalledOK
