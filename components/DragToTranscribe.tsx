"use client"

import { useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { User } from "@privy-io/react-auth"

const DragToTranscribe = ({ user }: { user: User }) => {
  const [text, setText] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [image, setImage] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)

      const formData = new FormData()
      formData.append("image", file)
      formData.append("userId", user.id)

      try {
        const response = await fetch("/api/v2/transcribe-image", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) throw new Error("Upload failed")

        toast({
          title: "Upload successful",
          description: "Image uploaded successfully",
        })
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image",
          variant: "destructive",
        })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    localStorage.setItem("notepad-text", newText)
  }
  const { toast } = useToast()
  const handleTranslate = () => {
    // Select all text in textarea
    const textarea = document.querySelector("textarea")
    textarea?.select()

    // Simulate 'T' key press
    const keyEvent = new KeyboardEvent("keydown", {
      key: "T",
      code: "KeyT",
      bubbles: true,
    })
    document.dispatchEvent(keyEvent)

    toast({
      title: "Translating...",
      description: "Please wait while we translate your text...",
    })
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
          <div className="text-sm">Image ready: {image.name}</div>
        ) : (
          <div className="text-sm text-gray-500">
            Drag and drop your image here
          </div>
        )}
      </div>

      <Button disabled={text.length === 0} onClick={handleTranslate}>
        {text.length === 0 ? "🔼 Drag an image file first" : "Translate it!"}
      </Button>
    </div>
  )
}

export default DragToTranscribe
