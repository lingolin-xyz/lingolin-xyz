import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MarkdownRendererPlain } from "./MarkdownRendererPlain"

const TranscriptionModalDialog = ({
  transcribedText,
  setTranscribedText,
  image,
}: {
  transcribedText: string
  setTranscribedText: (text: string) => void
  image: string | null
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white border border-gray-100 shadow-md max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-800 text-xl">
            Transcription Result
          </AlertDialogTitle>
          {image && (
            <div className="flex justify-center items-center">
              <img src={image} alt="Transcription" className="w-1/2 h-1/2" />
            </div>
          )}
          {/* <AlertDialogDescription className="text-gray-600 max-h-[60vh] overflow-y-auto whitespace-pre-wrap"> */}
          <MarkdownRendererPlain>
            {
              transcribedText.replace("```text", "").replace("```markdown", "")
              //   .replace("```", "")
            }
          </MarkdownRendererPlain>
          {/* </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleClose}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TranscriptionModalDialog
