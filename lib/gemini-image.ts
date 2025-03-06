import { FLASH_LATEST } from "./constants"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GoogleAIFileManager } from "@google/generative-ai/server"
import { extractJSONfromString } from "./strings"
import path from "path"
import fs from "fs/promises"
import { logEvent } from "./postgres"
import { postErrorToDiscord } from "./discord"

const GEMINI_API_KEYS = [
  process.env.GOOGLE_GEMINI_API_KEY_1 || "",
  process.env.GOOGLE_GEMINI_API_KEY_2 || "",
  process.env.GOOGLE_GEMINI_API_KEY_3 || "",
]

export const transcribeImage = async ({
  uploadedUrl,
  userId,
}: {
  uploadedUrl: string
  userId: string
}) => {
  const modelToUseHere = FLASH_LATEST

  const geminiApiKey =
    GEMINI_API_KEYS[Math.floor(Math.random() * GEMINI_API_KEYS.length)]
  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const model = genAI.getGenerativeModel({ model: modelToUseHere })

  const currentYear = new Date().getFullYear()
  const tempFile = `${currentYear}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}.webp`
  // Create temp file path
  const tempPath = path.join(process.cwd(), "temp", tempFile)

  const prompt = `Describe this image in detail. it's an image from an iPhone... probably a screenshot or a photo of something..

  If the image doesn't contain any text, please just return a super simple description of the image in 10 words or less.
  
  
  If the image contains text, I want you to extract, transcribe and organize the text on the image.
  Return it well organized in Markdown format.


  
  <Important>
  Please be very sensitive and ignore everything that can be considered harmful, racist, sexist, etc. I don't want the safety triggers to be triggered. Let's be very careful with that. Thanks!!
  </Important>
  
  <Important>
  Reply only with the transcibed content in Markdown and anything else, thanks.
  </Important>`

  try {
    // Fetch and save image
    const response = await fetch(uploadedUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`)
    }
    const imageBuffer = await response.arrayBuffer()

    console.log(" 💚 💚 💚 💚 💚 💚 💚 💚 Step tracking 01")

    // Ensure temp directory exists
    await fs.mkdir(path.dirname(tempPath), { recursive: true })
    await fs.writeFile(tempPath, Buffer.from(imageBuffer))

    console.log(" 💚 💚 💚 💚 💚 💚 💚 💚 Step tracking 02")
    const fileManager = new GoogleAIFileManager(geminiApiKey)
    const uploadResult = await fileManager.uploadFile(path.resolve(tempPath), {
      mimeType: "image/webp",
      displayName: "Uploaded Image",
    })

    console.log(" 💚 💚 💚 💚 💚 💚 💚 💚 Step tracking 03")

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ])

    console.log(" 💚 💚 💚 💚 💚 💚 💚 💚 Step tracking 04")

    const responseText = result.response.text()

    // const jsonObject = extractJSONfromString(responseText)

    console.log(" 💚 💚 💚 💚 💚 💚 💚 💚 Step tracking 05... skipped")
    // if (!jsonObject) {
    //   console.log(
    //     " 💔 💔 💔 💔 💔 💔 💔 💔 NO JSON OBJECT FOUND IN THE RESPONSE"
    //   )

    //   throw new Error("No JSON object found in the response")
    // }

    console.log(" 💚 💚 💚 💚 💚 💚 💚 💚 Step tracking 06")

    await logEvent({
      event_type: "image_transcribed",
      userId,
      extra: uploadedUrl,
      extra2: modelToUseHere,
      extra3: responseText,
    })

    return responseText
  } catch (error: any) {
    console.error("Error in processImageWithGemini:", error)
    await postErrorToDiscord(
      "Error in processImageWithGemini: " + error.toString().slice(0, 300)
    )
    throw error
  }
}
