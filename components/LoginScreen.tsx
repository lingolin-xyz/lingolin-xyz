"use client"

import { motion } from "framer-motion"
import BigTitle from "./BigTitle"
import BlurryEntrance from "./BlurryEntrance"
import Link from "next/link"
import Title from "./Title"
import { useToast } from "@/hooks/use-toast"
import LoginButton from "./LoginButton"

const LoginScreen = () => {
  const { toast } = useToast()

  return (
    <div className="py-10 max-w-7xl mx-auto w-full h-full px-2 text-center justify-center items-center flex flex-col gap-4">
      <BigTitle>
        <BlurryEntrance delay={0.3}>
          <div className="py-12">Welcome to Lingolin</div>
        </BlurryEntrance>
      </BigTitle>
      <BlurryEntrance delay={0.5}>
        <div className="flex justify-center max-w-2xl items-center border-4 border-black rounded-3xl overflow-hidden">
          <div className="px-4 space-y-4 py-6 md:py-4">
            <BlurryEntrance delay={0.7}>
              <BigTitle>
                <div className="text-balance px-4">
                  You can&apos;t spell &quot;lingloin&quot; without
                  &quot;login&quot;
                </div>
              </BigTitle>
            </BlurryEntrance>
            <BlurryEntrance delay={0.9}>
              <div className="text-lg md:text-xl text-balance pb-12">
                Please start your session to use the extension!
              </div>
              <LoginButton />
            </BlurryEntrance>
          </div>
          <motion.img
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            src="/images/login2.png"
            alt="No extension found"
            className="h-96 hidden md:block border-l-4 border-black"
          />
        </div>
      </BlurryEntrance>
    </div>
  )
}

export default LoginScreen
