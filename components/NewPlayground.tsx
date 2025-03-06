"use client"

import { useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"

const NewPlayground = () => {
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
          🗒️ Notepad / Playground
        </div>
        <div className="opacity-80">
          Write or paste anything... then select and translate!
        </div>
      </div>
      <Textarea
        placeholder="Write your note here, select, and translate to any language!"
        value={text}
        rows={4}
        onChange={handleChange}
        className="resize-none !text-3xl !p-5 !font-semibold bg-white !rounded-xl"
      />
      <Button disabled={text.length === 0} onClick={handleTranslate}>
        {text.length === 0 ? "Write Something" : "Translate it!"}
      </Button>
    </div>
  )
}

export default NewPlayground
