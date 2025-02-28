"use client"

import HugeTitle from "@/components/HugeTitle"
import Title from "@/components/Title"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

// import { createSchema } from "@/lib/nillion/createSchema"
// import { readFromNodes, writeTranslation } from "@/lib/nillion/utils"

const NillionPage = () => {
  const { toast } = useToast()

  const callToCreateCreditsSchema = async () => {
    const res = await axios.post("/api/nillion/createCreditsSchema")
    console.log({ res })
  }
  const callToCreateTranslationsSchema = async () => {
    const res = await axios.post("/api/nillion/createTranslationsSchema")
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
    console.table(translations)
    toast({
      title: "Translations read",
      description: "Translations read successfully",
    })
  }

  const callToFlushData = async () => {
    const res = await axios.post("/api/nillion/flush")
    console.log({ res })
  }

  const callToSearchByWord = async () => {
    const res = await axios.post("/api/nillion/searchByWord")
    console.log("searching by word:")
    console.log(res.data.translations)
  }

  const callToWriteCredits = async () => {
    const res = await axios.post("/api/nillion/writeCredits")
    console.log({ res })
  }

  const callToReadCredits = async () => {
    const res = await axios.post("/api/nillion/readCredits")
    console.log({ res })
  }

  const callToSearchByUserId = async () => {
    const res = await axios.post("/api/nillion/searchCreditsByUserId")
    console.log({ res })
  }

  const callToFlushCreditsData = async () => {
    const res = await axios.post("/api/nillion/flushCreditsCollection")
    console.log({ res })
  }

  return (
    <div className="bg-orange-200 p-12 rounded-3xl mt-12 flex flex-col gap-3 items-center justify-center">
      <HugeTitle>Nillion playground</HugeTitle>
      <div className="flex flex-col gap-3 w-60 mx-auto">
        <Title>Translations</Title>
        <Button onClick={callToCreateTranslationsSchema} size="lg">
          Create schema
        </Button>
        <Button onClick={callToWriteTranslation} size="lg">
          Write translation
        </Button>
        <Button onClick={callToReadTranslations} size="lg">
          Read translations
        </Button>
        <Button onClick={callToSearchByWord} size="lg">
          search by word
        </Button>
        <Button onClick={callToFlushData} size="lg">
          Flush data
        </Button>
      </div>
      <div className="flex flex-col gap-3 w-60 mx-auto">
        <Title>Credits</Title>
        <Button onClick={callToCreateCreditsSchema} size="lg">
          Create schema
        </Button>
        <Button onClick={callToWriteCredits} size="lg">
          Write credits
        </Button>
        <Button onClick={callToReadCredits} size="lg">
          Read credits
        </Button>
        <Button onClick={callToSearchByUserId} size="lg">
          search by
        </Button>
        <Button onClick={callToFlushCreditsData} size="lg">
          Flush data
        </Button>
      </div>
    </div>
  )
}

export default NillionPage
