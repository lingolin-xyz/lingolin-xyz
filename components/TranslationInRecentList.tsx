"use client"

import { useToast } from "@/hooks/use-toast"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { FiTrash2 } from "react-icons/fi"
import { useState } from "react"

const TranslationInRecentList = ({
  translation,
  onDelete,
}: {
  translation: {
    id: string
    event_type: string
    extra: string
    extra2: string
    extra3: string
    extra4: string
  }
  onDelete: (translation: any) => void
}) => {
  const { toast } = useToast()
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-200, 0],
    ["rgba(239, 68, 68, 0.7)", "rgba(255, 255, 255, 0)"]
  )
  const deleteOpacity = useTransform(x, [-200, -100, -20], [1, 0.5, 0])
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", bounce: 0.2 }}
    >
      <motion.div
        style={{ x, background }}
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(event, info) => {
          if (info.offset.x < -160) {
            onDelete(translation)
            toast({
              title: "Translation deleted",
              duration: 1200,
            })
          } else {
            x.set(0)
          }
          setTimeout(() => setIsDragging(false), 100)
        }}
        className="relative rounded-lg bg-white p-4 border-2 cursor-grab active:cursor-grabbing"
      >
        <motion.div
          className="absolute top-0 right-2 text-white pointer-events-none h-full flex items-center"
          style={{ opacity: deleteOpacity }}
        >
          <div className="p-2 text-red-300 bg-black/50 rounded-xl z-50 flex items-center justify-center gap-3 px-5">
            <ArrowLeft size={20} />
            <div className="translate-y-0.5 font-bold">Delete...</div>
            <FiTrash2 size={20} />
          </div>
        </motion.div>

        <div className="space-y-2">
          <div
            onClick={() => {
              if (!isDragging) {
                navigator.clipboard.writeText(translation.extra3)
                toast({
                  title: "Copied to clipboard!",
                })
              }
            }}
            className="relative text-base md:text-lg font-semibold opacity-70 tracking-tighter pt-4 bg-transparent hover:bg-yellow-100 rounded-xl px-2 cursor-pointer hover:opacity-90 active:opacity-30 active:scale-[100%] active:translate-y-0.5 active:duration-100 group transition-all duration-300"
          >
            <div className="absolute text-indigo-600 top-0 left-0 font-normal text-sm rotate-0 group-hover:-rotate-6 transition-all duration-100 group-hover:scale-125 group-active:scale-75">
              from {translation.extra}
            </div>
            {translation.extra3}
          </div>
          <div
            onClick={() => {
              if (!isDragging) {
                navigator.clipboard.writeText(translation.extra4)
                toast({
                  title: "Copied to clipboard!",
                  description: "Translation copied to clipboard",
                })
              }
            }}
            className="relative text-xl md:text-2xl font-bold tracking-tight pt-5 bg-transparent group hover:bg-emerald-200 rounded-xl px-2 cursor-pointer hover:opacity-90 active:opacity-30 active:scale-[100%] active:translate-y-0.5 active:duration-100 group transition-all duration-300"
          >
            <div className="absolute top-0 left-0 font-normal text-sm rotate-0 group-hover:-rotate-6 transition-all duration-100 group-hover:scale-125 group-active:scale-75">
              to {translation.extra2}
            </div>

            {translation.extra4}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TranslationInRecentList
