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
          <div className="flex flex-col gap-6 py-12 max-w-2xl mx-auto justify-center items-center w-full">
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

            <div className="w-full max-w-2xl mx-auto bg-zinc-100 rounded-2xl p-6 md:px-8">
              <Title>Recent Translations</Title>
              <div className="flex flex-col gap-3 w-full mx-auto pt-2">
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
                    <div key={index} className="p-2 rounded-lg bg-white">
                      <div className="space-y-2">
                        <div className="relative text-base md:text-lg font-semibold opacity-70 tracking-tighter pt-4 bg-transparent hover:bg-yellow-100 rounded-xl px-2 cursor-pointer hover:opacity-90 active:opacity-40 group transition-all duration-300">
                          <div className="absolute text-indigo-600 top-0 left-0 font-normal text-sm rotate-0 group-hover:-rotate-6 transition-all duration-100 group-hover:scale-125">
                            from {translation.extra}
                          </div>
                          {translation.extra3}
                        </div>
                        <div className="relative text-xl md:text-2xl font-bold tracking-tight pt-5 bg-transparent group hover:bg-emerald-200 rounded-xl px-2 cursor-pointer hover:opacity-90 active:opacity-40 transition-all duration-300">
                          <div className="absolute top-0 left-0 font-normal text-sm rotate-0 group-hover:-rotate-6 transition-all duration-100 group-hover:scale-125">
                            to {translation.extra2}
                          </div>

                          {translation.extra4}
                        </div>
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
