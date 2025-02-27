import { readFromNodes } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API started!!")

  const trans = await readFromNodes()
  console.log({ trans })

  return NextResponse.json({ translations: trans })
}
