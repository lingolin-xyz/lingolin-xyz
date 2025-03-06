import { uploadAnyImageToAWS } from "@/lib/aws"
import { transcribeImage } from "@/lib/gemini-image"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File
    const userId = formData.get("userId") as string

    console.log("userId", userId)
    console.log("imageFile", imageFile)

    // i want to upload the image to aws first
    // then, call transcribeImage

    const uploadedImage = await uploadAnyImageToAWS(imageFile)

    const transcribedImage = await transcribeImage({
      uploadedUrl: uploadedImage,
      userId,
    })

    return NextResponse.json({
      ok: "ok",
      transcribedImage,
    })
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    )
  }
}
