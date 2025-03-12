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
import SmolTitle from "./SmolTitle"
import MiniTitle from "./MiniTitle"
import MiniAudioPlayer from "./MiniAudioPlayer"

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
  const [pastTTS, setPastTTS] = useState<any[]>([])
  useEffect(() => {
    const fetchPastTranslations = async (userId: string) => {
      const res = await axios.post("/api/v1/get-recent-translations", {
        userId,
      })
      console.table(res.data)
      setPastTranslations(res.data)
      const res2 = await axios.post("/api/v2/get-recent-tts", {
        userId,
      })
      console.log("RES2")
      console.table(res2.data)
      setPastTTS(res2.data)
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
          <div className="flex flex-col gap-6 py-4 mx-auto justify-center items-center w-full">
            <div className="w-full justify-center gap-4 flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-2">
                {pastTTS && pastTTS.length > 0 ? (
                  <div className="w-full max-w-2xl mx-auto bg-zinc-100 rounded-2xl p-6 md:px-8">
                    <MiniTitle>Recent TTS</MiniTitle>
                    <div className="space-y-2 py-2">
                      {pastTTS.map((tts: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg items-center bg-white flex justify-between border-2"
                        >
                          <div className="flex-1">
                            <div>{tts.extra2}</div>
                            <SmolTitle>{tts.extra}</SmolTitle>
                          </div>
                          <div className="">
                            <MiniAudioPlayer src={tts.extra5} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-200 p-8 rounded-2xl text-2xl font-bold pb-7 flex flex-col gap-4 max-w-sm mx-auto w-full">
                    <div className="text-center text-balance">
                      Your text-to-speech history is empty.
                    </div>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Coming soon!",
                        })
                      }}
                    >
                      Watch this tutorial to learn how to use it
                    </Button>
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 p-2">
                {pastTranslations && pastTranslations.length > 0 ? (
                  <div className="w-full max-w-2xl mx-auto bg-zinc-100 rounded-2xl p-6 md:px-8">
                    <MiniTitle>Recent Translations</MiniTitle>
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
                    <Button
                      onClick={() => {
                        toast({
                          title: "Coming soon!",
                        })
                      }}
                    >
                      Watch a Smol Tutorial
                    </Button>
                  </div>
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
