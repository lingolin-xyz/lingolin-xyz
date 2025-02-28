import { readFromNodes } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API started!!")

  // const trans = await readFromNodes()

  const userId = "fv4atnehj05"
  const translations = await readFromNodes(userId)

  console.log("VAMOS VAMOS QUE TENGO...", translations)

  //   const translations = await getTranslationByWord(theWordToSearch)
  //   console.log({ translations })

  return NextResponse.json({ translations })
}
