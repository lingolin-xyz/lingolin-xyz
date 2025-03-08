import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { uploadMP3AudioFileToAWSS3 } from "./aws"

const mapOfVoices = {
  0: { voice_id: "zcAOhNBS3c14rBihAFp1" }, // ! NEW: Giovanni
  1: { voice_id: "5JmJrnmUZgGedCzY1Dby" }, // ! NEW: Hones Trailer Guy
  2: { voice_id: "AZnzlk1XvdvUeBnXmlld" }, // Bella!
  3: { voice_id: "AZnzlk1XvdvUeBnXmlld" }, // custom woman!
} as any

export const elevenTTS = async (text: string) => {
  const voice_id = "zcAOhNBS3c14rBihAFp1" // ! Giovanni
  //   const voice_id = "dFZGb4IByo3u4CFVCNBv" // ! indian guy
  console.log("voice_id  🎤 🎤 🎤", voice_id)

  try {
    const xiTextToSpeechUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`
    const response = await axios({
      method: "POST",
      url: xiTextToSpeechUrl,
      data: {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.3,
        },
      },
      headers: {
        Accept: "audio/mpeg",
        "xi-api-key": process.env.ELEVEN_LABS_API,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    })
    const audioBuffer = Buffer.from(response.data)

    const uploadedMp3URL = await uploadMP3AudioFileToAWSS3(audioBuffer)

    return uploadedMp3URL
  } catch (error) {
    console.error(error)
    return false
    // console.log(" 🟥", error?.response?.data);
  }
}
