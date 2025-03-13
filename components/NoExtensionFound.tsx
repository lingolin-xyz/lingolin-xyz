"use client"

import { motion } from "framer-motion"
import BigTitle from "./BigTitle"
import BlurryEntrance from "./BlurryEntrance"
import InfoSection from "./InfoSection"
import Link from "next/link"
import Title from "./Title"
import ChromeStoreImageLink from "./ChromeStoreImageLink"
import { FaXTwitter } from "react-icons/fa6"
import { Button } from "./ui/button"
import MiniTitle from "./MiniTitle"
import { TWITTER_LINK } from "@/lib/constants"

const NoExtensionFound = () => {
  return (
    <div className="pt-16 pb-8 max-w-7xl mx-auto w-full h-full px-2 text-center justify-center items-center flex flex-col gap-4">
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
              <ChromeStoreImageLink />
            </BlurryEntrance>
          </div>
        </div>
      </BlurryEntrance>
      <div>
        <div className="py-20">
          <BigTitle>
            <BlurryEntrance delay={0.3}>
              <div className="pt-6">Welcome to Lingolin</div>
            </BlurryEntrance>
          </BigTitle>
          <div className="font-semibold text-2xl opacity-70 pb-6">
            A Chrome Extension for the Monad Hackathon
          </div>
        </div>

        <InfoSection />

        <MiniTitle>
          <BlurryEntrance delay={0.3}>
            <div className="pt-24">Install the extension to get started!</div>
          </BlurryEntrance>
        </MiniTitle>

        <ChromeStoreImageLink />

        <div className="font-semibold text-2xl opacity-70 py-6 pt-40">
          Follow us for more updates!
        </div>

        <div>
          <Link href={TWITTER_LINK} target="_blank">
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
