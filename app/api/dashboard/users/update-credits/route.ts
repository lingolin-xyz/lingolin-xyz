import { updateCreditsValueById } from "@/lib/nillion/utils"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log(" 🥚 Editing credits from the dashboard!!")

  const { recordId, credits } = await req.json()

  await updateCreditsValueById(recordId, credits)

  return NextResponse.json({ finished: true })
}
