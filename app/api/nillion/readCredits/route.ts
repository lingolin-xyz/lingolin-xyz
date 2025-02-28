import { readCredits } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read credits API started!!")

  const credits = await readCredits()
  console.log({ credits })

  return NextResponse.json({ credits })
}
