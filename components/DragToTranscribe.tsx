"use client"

import { useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"

const DragToTranscribe = () => {
  const [text, setText] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("notepad-text") || ""
    }
    return ""
  })

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

      <Button disabled={text.length === 0} onClick={handleTranslate}>
        {text.length === 0 ? "Write Something" : "Translate it!"}
      </Button>
    </div>
  )
}

export default DragToTranscribe
