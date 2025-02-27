"use client"

import HugeTitle from "@/components/HugeTitle"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

// import { createSchema } from "@/lib/nillion/createSchema"
// import { readFromNodes, writeToNodes } from "@/lib/nillion/utils"

const NillionPage = () => {
  const { toast } = useToast()
  //   await new Promise((resolve) => setTimeout(resolve, 3000))

  //   await createSchema()

  //   await writeToNodes("hello", { word: "yo", translation: "pepe" })
  //   const translations = await readFromNodes()
  //   console.log({ translations })

  const callToCreateSchema = async () => {
    const res = await axios.post("/api/nillion/createSchema")
    console.log({ res })
  }

  const callToWriteTranslation = async () => {
    const res = await axios.post("/api/nillion/writeTranslation")
    console.log({ res })
    toast({
      title: "Translation written",
      description: "Translation written successfully",
    })
  }

  const callToReadTranslations = async () => {
    const res = await axios.post("/api/nillion/readTranslations")
    const { translations } = res.data
    console.log(translations)
    toast({
      title: "Translations read",
      description: "Translations read successfully",
    })
  }

  return (
    <div className="bg-orange-200 p-12 rounded-3xl mt-12 flex flex-col gap-3 items-center justify-center">
      <HugeTitle>Nillion playground</HugeTitle>
      <div className="flex flex-col gap-3 w-60 mx-auto">
        <Button onClick={callToCreateSchema} size="lg">
          Create schema
        </Button>
        <Button onClick={callToWriteTranslation} size="lg">
          Write translation
        </Button>
        <Button onClick={callToReadTranslations} size="lg">
          Read translations
        </Button>
      </div>
    </div>
  )
}

export default NillionPage
