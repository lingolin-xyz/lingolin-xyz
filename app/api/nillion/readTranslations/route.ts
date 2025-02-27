import { readFromNodes } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  //   const body = await req.json()
  //   const { text, userId } = body

  console.log(" 🥚 Read translations API started!!")

  const translations = await readFromNodes()
  console.log({ translations })

  return NextResponse.json({ translations })
}
