import OpenAI from "openai"
import { uploadMP3AudioFileToAWSS3 } from "./aws"
import { postErrorToDiscord } from "./discord"

export const generateAudioFromText = async ({ text }: { text: string }) => {
  try {
    const openai = new OpenAI()

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    const url = await uploadMP3AudioFileToAWSS3(buffer)

    return url
  } catch (error) {
    await postErrorToDiscord("Error generating audio from text: " + text)
    console.error("Error generating audio from text:", error)
    throw error
  }
}
