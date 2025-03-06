import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MarkdownRendererPlain } from "./MarkdownRendererPlain"

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
  setImage: (image: string | null) => void
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
