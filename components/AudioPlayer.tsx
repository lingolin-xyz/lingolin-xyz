"use client"

import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"
import NumberFlow from "@number-flow/react"
import BlurryEntranceFaster from "./BlurryEntranceFaster"

const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [error, setError] = useState<string | null>(null)
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleDurationChange = () => setDuration(audio.duration)
    const handleError = (e: ErrorEvent) =>
      setError(`Failed to load audio: ${e.message}`)

    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("error", handleError)

    // Set initial duration if already loaded
    if (audio.duration) setDuration(audio.duration)

    return () => {
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("error", handleError)
    }
  }, [])

  const handleTimeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0]
      setVolume(value[0])
    }
  }

  return (
    <div
      className={`w-full max-w-md transition-all duration-100 border-2 ${
        isPlaying
          ? "border-emerald-500 from-emerald-100 to-emerald-300"
          : "border-indigo-500 from-indigo-100 to-indigo-300"
      }  p-2 rounded-lg bg-gradient-to-br  shadow-lg`}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />

      <div className="space-y-0">
        <div className="flex items-center justify-between flex-row">
          <div className="flex items-center justify-center gap-4">
            <Button size="icon" onClick={togglePlay} className="rounded-full">
              {isPlaying ? (
                <Pause className="h-8 w-8 text-orange-200 animate-pulse" />
              ) : (
                <BlurryEntranceFaster>
                  <Play className="h-8 w-8 text-green-200" />
                </BlurryEntranceFaster>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2
              className={`h-6 transition-all duration-1000 w-6 ${
                isPlaying ? "text-emerald-600" : "text-indigo-400"
              }`}
              onClick={() => {
                setVolume(volume === 0 ? 1 : 0)
                if (audioRef.current) {
                  audioRef.current.volume = volume === 0 ? 1 : 0
                }
              }}
            />
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          {/* <div>
            yo! {currentTime} of {duration}
          </div> */}
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleTimeChange}
            className="flex-1"
          />
          <span className="text-sm text-indigo-600 tabular-nums tracking-tighter font-semibold">
            <NumberFlow value={Math.floor(currentTime / 60)} />:
            {/* put a zero if currentTime % 60 is less than 10 */}
            {currentTime % 60 < 10 ? "0" : ""}
            <NumberFlow
              value={parseInt(
                Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, "0")
              )}
            />{" "}
            / {Math.floor(duration / 60)}:
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
