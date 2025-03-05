import { GoogleGenerativeAI } from "@google/generative-ai"
import { getRandomGeminiAPIKey } from "./llm"

export const processAudioFile = async (audioBuffer: Buffer) => {
  const randomApiKey = getRandomGeminiAPIKey()

  // Initialize the Gemini AI client
  const genAI = new GoogleGenerativeAI(randomApiKey)

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

  try {
    const audioBase64 = audioBuffer.toString("base64")

    // Prepare the prompt with the audio file and a text instruction
    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "audio/ogg", // MIME type for .ogg files
                data: audioBase64, // Base64-encoded audio data
              },
            },
            {
              text: "Please transcribe the audio in clear Spanish.",
            },
          ],
        },
      ],
    }

    // Send the request to Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // console.log("Response from Gemini:");
    // console.log(text);
    return text
  } catch (error) {
    console.error("Error processing audio file:", error)
  }
}
