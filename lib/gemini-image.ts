import { FLASH_LATEST } from "./constants"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { postErrorToDiscord } from "./discord"
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

const GEMINI_API_KEYS = [
  process.env.GOOGLE_GEMINI_API_KEY_1 || "",
  process.env.GOOGLE_GEMINI_API_KEY_2 || "",
  process.env.GOOGLE_GEMINI_API_KEY_3 || "",
]

export const transcribeImage = async ({
  imageContent,
}: {
  imageContent: File
}) => {
  try {
    const modelToUseHere = FLASH_LATEST

    const geminiApiKey =
      GEMINI_API_KEYS[Math.floor(Math.random() * GEMINI_API_KEYS.length)]

    const prompt = `Describe this image in detail. it's an image from an iPhone... probably a screenshot or a photo of something..

  If the image doesn't contain any text, please just return a super simple description of the image in 10 words or less.
  
  
  If the image contains text, I want you to extract, transcribe and organize the text on the image.
  Return it well organized in Markdown format.


  
  <Important>
  Please be very sensitive and ignore everything that can be considered harmful, racist, sexist, etc. I don't want the safety triggers to be triggered. Let's be very careful with that. Thanks!!
  </Important>
  
  <Important>
  Reply only with the transcibed content in Markdown and anything else, thanks.

Following this format:

\`\`\`markdown

# Image Transcription

[transcribed text with nice formatting, paragraphs and titles. But try not to do lists please.]

\`\`\`

</Important>`

    const googleFlashExp = createGoogleGenerativeAI({
      apiKey: geminiApiKey,
    })

    const base64Image = await fileToBase64(imageContent)

    const result = await generateText({
      model: googleFlashExp("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image",

              // as base64 please
              image: base64Image,
            },
          ],
        },
      ],
      maxTokens: 4000,
      temperature: 0,
    })

    const theResult = result.text

    return theResult
  } catch (error) {
    await postErrorToDiscord("Error transcribing image!!")
    console.error("Error transcribing image:", error)
    return null
  }
}

const fileToBase64 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer()
  return Buffer.from(buffer).toString("base64")
}
