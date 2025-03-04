import { deleteTranslationFromLogsById } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { translationId } = body

  try {
    console.log("🍎  🍎  🍎  🍎  🍎  🍎  🍎 something something", translationId)

    await deleteTranslationFromLogsById(translationId)
    return new NextResponse(JSON.stringify({ success: true }))
  } catch (error) {
    console.error("Translation API Error:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete translation" }),
      {
        status: 500,
      }
    )
  }
}
