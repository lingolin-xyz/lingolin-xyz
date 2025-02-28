"use client"

import { motion } from "framer-motion"
import BigTitle from "./BigTitle"
import BlurryEntrance from "./BlurryEntrance"
import Link from "next/link"
import Title from "./Title"
import { useToast } from "@/hooks/use-toast"

const NoExtensionFound = () => {
  const { toast } = useToast()

  return (
    <div className="py-6 max-w-7xl mx-auto w-full h-full px-2 text-center justify-center items-center flex flex-col gap-4">
      <BigTitle>
        <BlurryEntrance delay={0.3}>
          <div className="py-12">Welcome to Lingolin</div>
        </BlurryEntrance>
      </BigTitle>
      <div className="flex justify-center max-w-2xl items-center border-4 border-black rounded-3xl overflow-hidden">
        <motion.img
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          src="/images/no-extension.png"
          alt="No extension found"
          className="h-96"
        />

        <div className="px-4 space-y-4">
          <BlurryEntrance delay={0.7}>
            <Title>
              <div className="text-balance px-4">No extension found :(</div>
            </Title>
          </BlurryEntrance>
          <BlurryEntrance delay={0.9}>
            <div className="text-xl text-balance">
              Please install the Lingolin extension to use the app.
            </div>
            <div className="text-xl text-balance pt-6">
              You can download it from the Chrome Web Store.
            </div>
            <div className="w-full my-2 pt-6 flex justify-center">
              <div
                className="cursor-pointer active:opacity-60"
                onClick={() => {
                  toast({
                    title: "Coming soon",
                    description: "We are working on it",
                  })
                }}
              >
                <img
                  src="/images/chrome-web-store.png"
                  className="h-12 px-2 border border-black/30 rounded-lg"
                />
              </div>
            </div>
          </BlurryEntrance>
        </div>
      </div>
    </div>
  )
}

export default NoExtensionFound
