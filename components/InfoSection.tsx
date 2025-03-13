"use client"

import Link from "next/link"
import BlurryEntrance from "./BlurryEntrance"
import MiniTitle from "./MiniTitle"
import { FaRegFilePdf } from "react-icons/fa"

const InfoSection = () => {
  return (
    <>
      <div className="flex flex-col gap-4 bg-gradient-to-br from-indigo-50 to-indigo-200 p-4 rounded-xl">
        <MiniTitle>Final Submission Video</MiniTitle>
        <BlurryEntrance delay={0.5}>
          <div className="flex justify-center items-center">
            <div className="w-full flex justify-center items-center border-4 border-black max-w-2xl rounded-xl overflow-hidden">
              <video
                src="/videos/final-demo.mp4"
                controls
                className="scale-[101%]"
              />
            </div>
          </div>
        </BlurryEntrance>
      </div>
      <div className="flex flex-col gap-4 mt-12 bg-gradient-to-br from-emerald-50 to-emerald-200 p-4 rounded-xl">
        <MiniTitle>See our pitch deck</MiniTitle>
        <Link
          href="/lingolin-deck.pdf"
          target="_blank"
          className="hover:opacity-60 active:opacity-40"
        >
          <BlurryEntrance delay={0.5}>
            <div className="flex justify-center items-center">
              <div className="w-full flex justify-center items-center border-4 border-black max-w-2xl rounded-xl overflow-hidden py-3">
                <div className="text-2xl pr-4 translate-y-[-2px]">
                  <FaRegFilePdf />
                </div>
                <MiniTitle>PDF LINK HERE</MiniTitle>
              </div>
            </div>
          </BlurryEntrance>
        </Link>
      </div>

      <div className="py-12">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-yellow-50 to-yellow-200 p-4 rounded-xl">
          <MiniTitle>Previous Demo Video</MiniTitle>

          <BlurryEntrance delay={0.5}>
            <div className="flex justify-center items-center">
              <div className="w-full flex justify-center items-center border-4 border-black max-w-2xl rounded-xl overflow-hidden">
                <video
                  src="/videos/lingolin-demo-1.mp4"
                  controls
                  className="scale-[101%]"
                />
              </div>
            </div>
          </BlurryEntrance>
        </div>
      </div>

      <div className="py-12">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-purple-50 to-purple-200 p-4 rounded-xl">
          <MiniTitle>Our Hatckathon Sountrack</MiniTitle>

          <iframe
            src={`https://open.spotify.com/embed/album/1cED2PbzswE1h5TBilRcN7`}
            allow="encrypted-media"
            className="w-full h-[640px]"
          ></iframe>
        </div>
      </div>
    </>
  )
}

export default InfoSection
