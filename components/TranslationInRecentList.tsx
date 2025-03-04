"use client"

import { useToast } from "@/hooks/use-toast"

const TranslationInRecentList = ({
  translation,
}: {
  translation: {
    event_type: string
    extra: string
    extra2: string
    extra3: string
    extra4: string
  }
}) => {
  const { toast } = useToast()
  return (
    <div className="p-2 rounded-lg bg-white">
      <div className="space-y-2">
        <div
          onClick={() => {
            navigator.clipboard.writeText(translation.extra3)
            toast({
              title: "Copied to clipboard!",
            })
          }}
          className="relative text-base md:text-lg font-semibold opacity-70 tracking-tighter pt-4 bg-transparent hover:bg-yellow-100 rounded-xl px-2 cursor-pointer hover:opacity-90 active:opacity-40 group transition-all duration-300"
        >
          <div className="absolute text-indigo-600 top-0 left-0 font-normal text-sm rotate-0 group-hover:-rotate-6 transition-all duration-100 group-hover:scale-125">
            from {translation.extra}
          </div>
          {translation.extra3}
        </div>
        <div
          onClick={() => {
            navigator.clipboard.writeText(translation.extra4)
            toast({
              title: "Copied to clipboard!",
              description: "Translation copied to clipboard",
            })
          }}
          className="relative text-xl md:text-2xl font-bold tracking-tight pt-5 bg-transparent group hover:bg-emerald-200 rounded-xl px-2 cursor-pointer hover:opacity-90 active:opacity-40 transition-all duration-300"
        >
          <div className="absolute top-0 left-0 font-normal text-sm rotate-0 group-hover:-rotate-6 transition-all duration-100 group-hover:scale-125">
            to {translation.extra2}
          </div>

          {translation.extra4}
        </div>
      </div>
    </div>
  )
}

export default TranslationInRecentList
