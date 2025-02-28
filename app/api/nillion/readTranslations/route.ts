import { getAllTranslations } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API started!!")

  const savedTranslations = await getAllTranslations()
  console.log({ savedTranslations })

  return NextResponse.json({ translations: savedTranslations })
}
