"use client"

import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const Notepad = () => {
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

  return (
    <div className="flex flex-col gap-4 py-12 max-w-2xl mx-auto">
      <Textarea
        placeholder="Write your note here..."
        value={text}
        onChange={handleChange}
        className="resize-none !text-2xl"
      />
    </div>
  )
}

export default Notepad
