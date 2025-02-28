import { flushCreditsData } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Read translations API    !!")

  await flushCreditsData()
  return NextResponse.json({ finished: true })
}
