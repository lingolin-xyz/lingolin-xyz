import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 temporarily disabled!")
  return NextResponse.json({ translations: [] })
}
