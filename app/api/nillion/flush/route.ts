import { flushData } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API    !!")

  await flushCreditsData()
  await flushTranslationsData()
  return NextResponse.json({ finished: true })
}
