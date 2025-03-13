"use client"

import Link from "next/link"
import MiniTitle from "./MiniTitle"
import SmolTitle from "./SmolTitle"

const ChromeStoreImageLink = () => {
  return (
    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 max-w-sm mx-auto mt-6">
      <SmolTitle>V2 is coming soon!</SmolTitle>
      <div className="text-xs text-balance">
        V2 inculdes audio features, credits, and mini-games!
      </div>
      <div className="text-sm pt-4 text-balance">
        Until then, you can install V1
        <Link
          href="https://chromewebstore.google.com/detail/lingolin/fdpplpaeiddhncnhhkdioplbpiiihpmf"
          className="pl-1.5 text-indigo-600 font-semibold text-sm active:opacity-60 hover:opacity-80 transition-all duration-300"
        >
          from the Official Chrome Web Store
        </Link>
      </div>
      {/* <Link href="https://chromewebstore.google.com/detail/lingolin/fdpplpaeiddhncnhhkdioplbpiiihpmf">
        <div className="w-full my-2 pt-6 flex justify-center">
          <div className="group cursor-pointer active:opacity-60 relative p-1.5 active:scale-[99%] active:duration-100 hover:scale-[101%] rounded-xl bg-transparent hover:bg-orange-100 transition-all duration-300">
            <div className="absolute -top-2 group-hover:-top-5 scale-75 group-hover:scale-100 group-active:-top-2 group-active:scale-75 group-active:opacity-0 w-full h-4  opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center items-start">
              <div className="bg-orange-100 rounded-xl p-2 pb-3 pt-[1px] text-xs h-4 text-black font-semibold">
                The Extension is officially approved by Google!
              </div>
            </div>
            <img
              src="/images/chrome-web-store.png"
              draggable={false}
              alt="Install Lingolin from the Chrome Web Store"
              className="h-16 px-2 border-2 border-black rounded-lg bg-white"
            />
          </div>
        </div>
      </Link> */}
    </div>
  )
}

export default ChromeStoreImageLink
