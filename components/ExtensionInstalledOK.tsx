"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"

import LoginScreen from "./LoginScreen"
import BigTitle from "./BigTitle"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Title from "./Title"

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

  const [pastTranslations, setPastTranslations] = useState<any[]>([])

  useEffect(() => {
    const fetchPastTranslations = async (userId: string) => {
      const res = await axios.post("/api/v1/get-recent-translations", {
        userId,
      })
      console.log("RECENT TRANSLATIONS")
      console.table(res.data)
      setPastTranslations(res.data)
    }
    if (user) if (user.id) fetchPastTranslations(user.id)
  }, [user])

  return (
    <div className="py-4">
      {user ? (
        <div className="w-full">
          <div className="flex flex-col gap-6 py-12 max-w-2xl mx-auto justify-center items-center hello w-full">
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

            <div>
              <Title>Past Translations</Title>
              <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
                {pastTranslations.map(
                  (
                    translation: {
                      event_type: string
                      extra: string
                      extra2: string
                      extra3: string
                      extra4: string
                    },
                    index
                  ) => (
                    <div key={index} className="hello p-2 rounded-lg">
                      <div>
                        <div>{translation.extra}</div>
                        <div>{translation.extra3}</div>
                        <div>{translation.extra2}</div>
                        <div>{translation.extra4}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
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
