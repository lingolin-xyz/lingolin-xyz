import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File
    const userId = formData.get("userId") as string

    console.log("userId", userId)
    console.log("imageFile", imageFile)

    return NextResponse.json({
      ok: "ok",
    })
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    )
  }
}
