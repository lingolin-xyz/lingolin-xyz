import { NextResponse } from "next/server"
import { uploadOGGAudioFileToAWSS3 } from "@/lib/aws"
import { processAudioFile } from "@/lib/audio-upload"
import { getSentenceLanguage, translateMessage } from "@/lib/prompts"
import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { waitUntil } from "@vercel/functions"
import {
  getTranslationByMessageAndLanguage,
  updateCreditsValueById,
  writeTranslation,
} from "@/lib/nillion/utils"
import { cleanString } from "@/lib/strings"
import { logEvent } from "@/lib/postgres"
import { getUserAndCredits } from "@/lib/cachedLayer"
import { revalidateTag } from "next/cache"

export async function POST(req: Request) {
  try {
    const startTime = Date.now()
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File
    const nativeLanguage = formData.get("nativeLanguage") as string
    const targetLanguage = formData.get("targetLanguage") as string
    const userId = formData.get("userId") as string

    const userWithCredits = await getUserAndCredits(userId)
    if (!userWithCredits) {
      await postErrorToDiscord("User not found!!")
      return NextResponse.json({
        finished: false,
        error: "User not found",
      })
    }
    if (userWithCredits.credits <= 0) {
      await postErrorToDiscord("User has no credits!! " + userId)
      return NextResponse.json({
        finished: false,
        error: "User has no credits",
      })
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer())

    console.log(`🏁Buffer preparation took: ${Date.now() - startTime}ms`)
    const uploadStartTime = Date.now()

    const transcription = await processAudioFile(buffer)

    console.log(
      `Upload and transcription took: ${Date.now() - uploadStartTime}ms`
    )

    if (!transcription || transcription.trim().length === 0) {
      await postErrorToDiscord("No transcription found from audio url!!")
      return NextResponse.json({
        finished: false,
        error: "No transcription found",
      })
    }

    // update credits
    await updateCreditsValueById(
      userWithCredits._id,
      userWithCredits.credits - 1
    )

    revalidateTag(`user-credits-${userId}`)

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
        translatedMessage: savedTranslation.translation,
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
    // await callToSaveVoiceNote({
    //   transcription,
    //   translatedMessage,
    //   userId: userId,
    //   buffer,
    //   languageFrom: sentenceLanguage,
    //   languageTo: actualTargetLanguage,
    // })

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

    await logEvent({
      event_type: "save_voice_note",
      userId: userId,
      extra: languageFrom,
      extra2: languageTo,
      extra3: transcription,
      extra4: translatedMessage,
      extra5: audioUrl,
    })

    // const userWithCreditsAgain = await getUserAndCredits(userId)
    // if (!userWithCreditsAgain) {
    //   await postErrorToDiscord("User not found!!")
    //   return NextResponse.json({
    //     finished: false,
    //     error: "User not found",
    //   })
    // }

    // // update credits
    // await updateCreditsValueById(
    //   userWithCreditsAgain._id,
    //   userWithCreditsAgain.credits - 1
    // )

    // revalidateTag(`user-credits-${userId}`)

    await postToDiscord(
      " 🍎  GOTTA SAVE THE VOICE NOTE.." + audioUrl + " " + userId
    )
  } catch (error) {
    await postErrorToDiscord(
      "Error saving voice note! (post-response catch!!!)"
    )
    console.error("Error saving voice note:", error)
  }
}
