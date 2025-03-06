"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { User } from "@privy-io/react-auth"
import { MarkdownRendererPlain } from "./MarkdownRendererPlain"
import BlurryEntrance from "./BlurryEntrance"
import BlurryEntranceFaster from "./BlurryEntranceFaster"
import TranscriptionModalDialog from "./TranscriptionModalDialog"

const DragToTranscribe = ({ user }: { user: User }) => {
  const [dragActive, setDragActive] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [transcribedText, setTranscribedText] = useState<string | null>(
    null
    // "```text Native language: Spanish Target language: English ```"
    // "```text\n5. Rf1 6. Rf6 7. Rxg6\n\n5. Rf1 X\n\nSubmit\n```"
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

  const handleTranslate = () => {
    // Select all text in the div with id = "transcription"
    const transcriptionDiv = document.getElementById("transcription")
    if (transcriptionDiv) {
      const selection = window.getSelection()
      if (selection) {
        selection.selectAllChildren(transcriptionDiv)
      }
    }

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

    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-zinc-100 rounded-xl">
      <div>
        <div className="text-2xl font-bold tracking-tight">
          🏎️ Drag To Transcribe
        </div>
        <div className="opacity-80">
          Drop an image and then easily translate it!!
        </div>
      </div>

      <TranscriptionModalDialog
        transcribedText={transcribedText || ""}
        setTranscribedText={setTranscribedText}
        image={imagePreview || ""}
        setImage={setImage}
        setImagePreview={setImagePreview}
      />

      {transcribedText ? (
        <div className="flex flex-col gap-2">
          <div className="h-[184px] overflow-y-auto">
            <div className="bg-white p-5 rounded-lg" id="transcription">
              <MarkdownRendererPlain>
                {transcribedText
                  .replace("```text", "")
                  .replace("```markdown", "")
                  .replace("```", "")}
              </MarkdownRendererPlain>
            </div>
          </div>
          <div className="flex justify-center gap-2 w-full">
            <div className="flex flex-col w-full">
              <Button disabled={!transcribedText} onClick={handleTranslate}>
                Translate it!
              </Button>
            </div>
            <div className="flex flex-col w-full">
              <Button
                variant="outline"
                disabled={!transcribedText}
                onClick={() => {
                  setTranscribedText(null)
                  setImage(null)
                  setImagePreview(null)
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
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
                  <BlurryEntranceFaster>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-[140px] max-w-full mb-2 rotate-3 rounded"
                    />
                  </BlurryEntranceFaster>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Drag and drop your image here
              </div>
            )}
          </div>

          <div className="flex w-full justify-between gap-4">
            {imagePreview && (
              <div className="flex flex-col w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTranscribedText(null)
                    setImage(null)
                    setImagePreview(null)
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
            <div className="w-full flex flex-col">
              <Button
                disabled={!image || isLoading}
                onClick={submitToTranscribe}
              >
                <BlurryEntranceFaster>
                  <div className="w-full flex justify-center gap-4">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Transcribing...
                      </div>
                    ) : !image ? (
                      "🔼 Drag an image file first"
                    ) : (
                      "Transcribe it!"
                    )}
                  </div>
                </BlurryEntranceFaster>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DragToTranscribe
