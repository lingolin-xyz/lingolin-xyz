"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { User } from "@privy-io/react-auth"

const DragToTranscribe = ({ user }: { user: User }) => {
  const [dragActive, setDragActive] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [transcribedText, setTranscribedText] = useState<string | null>(
    null
    // "```text Native language: Spanish Target language: English ```"
  )
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const { toast } = useToast()

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
    }
  }

  const submitToTranscribe = async () => {
    if (!image) return

    try {
      const formData = new FormData()
      formData.append("image", image)
      formData.append("userId", user.id)

      const response = await fetch("/api/v2/transcribe-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to transcribe image")
      }

      const data = await response.json()
      console.log("CAME BACK FROM TRANSCRIPTION!!!")
      console.log(data)
      setTranscribedText(data.transcribedImage)

      toast({
        title: "Transcription complete",
        description: "Your image has been transcribed successfully",
      })
    } catch (error) {
      console.error("Error transcribing image:", error)
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your image",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-zinc-100 rounded-3xl">
      <div>
        <div className="text-2xl font-bold tracking-tight">
          🏎️ Drag To Transcribe
        </div>
        <div className="opacity-80">
          Drop an image and then easily translate it!!
        </div>
      </div>

      {transcribedText ? (
        <div className="text-sm text-gray-500">{transcribedText}</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`min-h-[186px] border-2 border-dashed rounded-lg p-4 flex items-center justify-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            {image ? (
              <div className="flex flex-col items-center justify-center">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[140px] max-w-full mb-2 rotate-3 rounded"
                  />
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Drag and drop your image here
              </div>
            )}
          </div>
          <Button disabled={!image} onClick={submitToTranscribe}>
            {!image ? "🔼 Drag an image file first" : "Translate it!"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default DragToTranscribe
