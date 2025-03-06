"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"

import LoginScreen from "./LoginScreen"
import BigTitle from "./BigTitle"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Title from "./Title"
import TranslationInRecentList from "./TranslationInRecentList"
import PlaygroundAndDragImage from "./PlaygroundAndDragImage"
import { getEmailAddressFromPrivyUserObject } from "@/lib/privy-utils-client"

const ExtensionInstalledOK = () => {
  const { user } = usePrivy()

  const { toast } = useToast()

  useEffect(() => {
    if (user)
      window.postMessage(
        {
          type: "LINGOLIN_USER_ID",
          data: {
            id: user.id,
            email: getEmailAddressFromPrivyUserObject(user),
          },
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
      // console.log("RECENT TRANSLATIONS")
      console.table(res.data)
      setPastTranslations(res.data)
    }
    if (user) if (user.id) fetchPastTranslations(user.id)
  }, [user])

  const callDeleteTranslation = async (translation: any) => {
    setPastTranslations(pastTranslations.filter((t) => t.id !== translation.id))

    const res = await axios.post("/api/v1/delete-translation", {
      translationId: translation.id,
    })
    console.log("DELETE TRANSLATION")
    console.table(res.data)
  }

  return (
    <div className="py-8">
      {user ? (
        <div className="w-full max-w-5xl mx-auto">
          <PlaygroundAndDragImage user={user} />
          <div className="flex flex-col gap-6 py-12 max-w-2xl mx-auto justify-center items-center w-full">
            {/* <BigTitle>Welcome to Lingolin!</BigTitle>
            <Button
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "We're working on it!",
                })
              }}
            >
              Watch Tutorial Video
            </Button> */}

            {pastTranslations && pastTranslations.length > 0 ? (
              <div className="w-full max-w-2xl mx-auto bg-zinc-100 rounded-2xl p-6 md:px-8">
                <Title>Recent Translations</Title>
                <div className="flex flex-col gap-3 w-full mx-auto pt-2">
                  {pastTranslations.map(
                    (
                      translation: {
                        id: string
                        event_type: string
                        extra: string
                        extra2: string
                        extra3: string
                        extra4: string
                      },
                      index
                    ) => (
                      <TranslationInRecentList
                        key={translation.id}
                        translation={translation}
                        onDelete={callDeleteTranslation}
                      />
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-200 p-8 rounded-2xl text-2xl font-bold pb-7 flex flex-col gap-4 max-w-sm mx-auto w-full">
                <div className="text-center text-balance">
                  Use the extension to start translating!
                </div>
                <Button>Watch Mini Tutorial</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <LoginScreen />
      )}
    </div>
  )
}

export default ExtensionInstalledOK
