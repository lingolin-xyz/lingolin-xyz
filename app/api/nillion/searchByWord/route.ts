import { getTranslationByWord, readFromNodes } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API started!!")

  // const trans = await readFromNodes()

  const theWordToSearch = "yt3950nidb"
  const translations = await getTranslationByWord(theWordToSearch)
  console.log({ translations })

  return NextResponse.json({ results: translations })
}
