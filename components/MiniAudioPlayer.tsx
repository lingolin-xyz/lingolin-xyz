"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const MiniAudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <motion.div
      className="flex items-center gap-2 w-fit bg-orange-300/30 rounded-full p-0.5"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 rounded-full"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </Button>

      <audio ref={audioRef} src={src} className="hidden" />
    </motion.div>
  )
}

export default MiniAudioPlayer
