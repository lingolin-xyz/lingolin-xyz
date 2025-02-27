import { getTranslationByWord, readFromNodes } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API started!!")

  // const trans = await readFromNodes()

  const theWordToSearch = "fv4atnehj05"
  const translations = await readFromNodes("manolo")

  console.log("VAMOS VAMOS QUE TENGO...", translations)

  //   const translations = await getTranslationByWord(theWordToSearch)
  //   console.log({ translations })

  return NextResponse.json({ translations })
}
