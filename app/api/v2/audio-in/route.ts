import { NextResponse } from "next/server"
import { uploadOGGAudioFileToAWSS3 } from "@/lib/aws"
import { processAudioFile } from "@/lib/audio-upload"
import { getSentenceLanguage, translateMessage } from "@/lib/prompts"
import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { waitUntil } from "@vercel/functions"
import {
  getTranslationByMessageAndLanguage,
  writeTranslation,
} from "@/lib/nillion/utils"
import { cleanString } from "@/lib/strings"

export async function POST(req: Request) {
  try {
    const startTime = Date.now()
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File
    const nativeLanguage = formData.get("nativeLanguage") as string
    const targetLanguage = formData.get("targetLanguage") as string
    const userId = formData.get("userId") as string

    const buffer = Buffer.from(await audioFile.arrayBuffer())

    console.log(`🏁Buffer preparation took: ${Date.now() - startTime}ms`)
    const uploadStartTime = Date.now()

    const transcription = await processAudioFile(buffer)

    console.log(
      `Upload and transcription took: ${Date.now() - uploadStartTime}ms`
    )

    if (!transcription) {
      await postErrorToDiscord("No transcription found from audio url!!")
      return NextResponse.json({
        finished: false,
        error: "No transcription found",
      })
    }

    console.log("transcription", transcription)

    const translationStartTime = Date.now()

    // const savedTranslation = await getTranslationByMessageAndLanguage({
    //   message: transcription,
    //   language: languageTo,
    // })

    const cleanText = cleanString(transcription)
    const sentenceLanguage = await getSentenceLanguage(cleanText)
    let actualTargetLanguage = "English"
    if (
      sentenceLanguage.trim().toLowerCase() ===
      nativeLanguage.trim().toLowerCase()
    ) {
      actualTargetLanguage = targetLanguage
    } else {
      actualTargetLanguage = nativeLanguage
    }
    const savedTranslation = await getTranslationByMessageAndLanguage({
      message: cleanText,
      fromLanguage: sentenceLanguage,
      toLanguage: actualTargetLanguage,
    })

    if (savedTranslation) {
      return NextResponse.json({
        transcription,
        translatedMessage: savedTranslation.translated_message,
      })
    }

    const translatedMessage = await translateMessage({
      message: transcription,
      language: actualTargetLanguage,
    })

    console.log(`🏁Translation took: ${Date.now() - translationStartTime}ms`)

    if (!translatedMessage) {
      await postErrorToDiscord(
        "No translated message found from transcription: " + transcription
      )
      return NextResponse.json({
        finished: false,
        error: "No translated message found",
      })
    }

    console.log("translatedMessage", translatedMessage)

    waitUntil(
      callToSaveVoiceNote({
        transcription,
        translatedMessage,
        userId: userId,
        buffer,
        languageFrom: sentenceLanguage,
        languageTo: actualTargetLanguage,
      })
    )

    console.log(`🏁Total process took: ${Date.now() - startTime}ms`)

    return NextResponse.json({
      transcription,
      translatedMessage,
    })
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    )
  }
}

const callToSaveVoiceNote = async ({
  transcription,
  translatedMessage,
  userId,
  buffer,
  languageFrom,
  languageTo,
}: {
  transcription: string
  translatedMessage: string
  userId: string
  buffer: Buffer
  languageFrom: string
  languageTo: string
}) => {
  try {
    const audioUrl = await uploadOGGAudioFileToAWSS3(buffer)

    await writeTranslation({
      fromLanguage: languageFrom,
      toLanguage: languageTo,
      message: transcription,
      translation: translatedMessage,
    })

    await postToDiscord(
      " 🍎  GOTTA SAVE THE VOICE NOTE.." + audioUrl + " " + userId
    )
    console.log(" 🍎  GOTTA SAVE THE VOICE NOTE.." + audioUrl + " " + userId)

    // await saveVoiceNote({
    //   original_message: transcription,
    //   translated_message: translatedMessage,
    //   user_id: userId,
    //   audio_url: audioUrl,
    //   language_from: languageFrom,
    //   language_to: languageTo,
    // })
  } catch (error) {
    await postErrorToDiscord(
      "Error saving voice note! (post-response catch!!!)"
    )
    console.error("Error saving voice note:", error)
  }
}
