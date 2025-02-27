"use client"

import HugeTitle from "@/components/HugeTitle"
import { Button } from "@/components/ui/button"
import axios from "axios"

// import { createSchema } from "@/lib/nillion/createSchema"
// import { readFromNodes, writeToNodes } from "@/lib/nillion/utils"

const NillionPage = () => {
  //   await new Promise((resolve) => setTimeout(resolve, 3000))

  //   await createSchema()

  //   await writeToNodes("hello", { word: "yo", translation: "pepe" })
  //   const translations = await readFromNodes()
  //   console.log({ translations })

  const callToCreateSchema = async () => {
    const res = await axios.post("/api/nillion/createSchema")
    console.log({ res })
  }

  return (
    <div className="hello p-3">
      <HugeTitle>Nillion playground</HugeTitle>
      <div className="flex flex-col gap-3">
        <Button onClick={callToCreateSchema}>Create schema</Button>
      </div>
    </div>
  )
}

export default NillionPage
