"use client"

import { motion } from "framer-motion"
import BigTitle from "./BigTitle"
import BlurryEntrance from "./BlurryEntrance"
import Link from "next/link"
import Title from "./Title"
import { useToast } from "@/hooks/use-toast"
import { FaXTwitter } from "react-icons/fa6"
import { Button } from "./ui/button"

const NoExtensionFound = () => {
  const { toast } = useToast()

  return (
    <div className="py-10 max-w-7xl mx-auto w-full h-full px-2 text-center justify-center items-center flex flex-col gap-4">
      <BlurryEntrance delay={0.5}>
        <div className="flex justify-center max-w-2xl items-center border-4 border-black rounded-3xl overflow-hidden">
          <motion.img
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            src="/images/no-extension.png"
            alt="No extension found"
            className="h-96 hidden md:block border-r-4 border-black"
          />

          <div className="px-8 space-y-4 py-6 md:py-4">
            <BlurryEntrance delay={0.7}>
              <Title>
                <div className="text-balance px-4">No extension found :(</div>
              </Title>
            </BlurryEntrance>
            <BlurryEntrance delay={0.9}>
              <div className="text-lg md:text-xl text-balance">
                Please install the Lingolin extension to use the app.
              </div>
              <div className="text-lg md:text-xl text-balance pt-6">
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
      </BlurryEntrance>
      <div>
        <BigTitle>
          <BlurryEntrance delay={0.3}>
            <div className="pt-6">Welcome to Lingolin</div>
          </BlurryEntrance>
        </BigTitle>
        <div className="font-semibold text-xl opacity-70 pb-6">
          A Chrome Extension for the Monad Hackathon
        </div>
        <BlurryEntrance delay={0.5}>
          <div className="w-full flex justify-center items-center border-4 border-black max-w-2xl rounded-xl overflow-hidden">
            <video
              src="/videos/lingolin-demo-1.mp4"
              controls
              className="scale-[101%]"
            />
          </div>
        </BlurryEntrance>
        <BigTitle>
          <BlurryEntrance delay={0.3}>
            <div className="pt-24">Lingolin will be available soon!</div>
          </BlurryEntrance>
        </BigTitle>
        <div className="font-semibold text-2xl opacity-70 py-6">
          Come back for more updates!
        </div>

        <div>
          <Link href="https://twitter.com/hellolingolin" target="_blank">
            <Button variant="outline" className="group">
              <div className="flex items-center gap-2">
                <FaXTwitter className="w-6 h-6 -translate-y-[1.3px] group-hover:rotate-[360deg] transition-all duration-500 group-active:scale-[60%] group-active:rotate-[720deg] group-active:duration-300" />
                <div>Follow us on Twitter</div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NoExtensionFound
