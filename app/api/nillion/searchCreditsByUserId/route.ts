import { readCredits } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API started!!")
  const translations = await readCredits("test123")
  return NextResponse.json({ translations })
}
