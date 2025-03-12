import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MarkdownRendererPlain } from "./MarkdownRendererPlain"
import { Button } from "./ui/button"

const TranscriptionModalDialog = ({
  transcribedText,
  setTranscribedText,
  image,
  setImage,
  setImagePreview,
}: {
  transcribedText: string
  setTranscribedText: (text: string) => void
  image: string | null
  setImage: (image: File | null) => void
  setImagePreview: (imagePreview: string | null) => void
}) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (transcribedText) {
      setOpen(true)
    }
  }, [transcribedText])

  const handleClose = () => {
    setOpen(false)
    setTranscribedText("")
  }

  const onClose = () => {
    setOpen(false)
    setTranscribedText("")
    setImage(null)
    setImagePreview(null)
  }

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
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white border border-gray-100 shadow-md max-w-5xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-800 text-xl">
            {/* Transcription Result */}
          </AlertDialogTitle>
          <div className="flex flex-col md:flex-row gap-6">
            {image && (
              <div className="flex justify-center items-center pb-6 w-80">
                <img
                  src={image}
                  alt="Transcription"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <div className="max-h-[440px] flex-1 bg-zinc-100 rounded-xl p-5 overflow-y-auto whitespace-pre-wrap">
              {/* <AlertDialogDescription className="text-gray-600 max-h-[60vh] overflow-y-auto whitespace-pre-wrap"> */}
              <MarkdownRendererPlain>
                {
                  transcribedText
                    .replace("```text", "")
                    .replace("```markdown", "")
                  //   .replace("```", "")
                }
              </MarkdownRendererPlain>
            </div>
          </div>

          {/* </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="w-full max-w-md mx-auto flex justify-center gap-4">
            <div className="flex flex-col w-full">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
            <div className="flex flex-col w-full">
              <Button onClick={handleTranslate}>Translate it!</Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TranscriptionModalDialog
