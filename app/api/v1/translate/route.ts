import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import {
  getTranslationByMessageAndLanguage,
  writeTranslation,
} from "@/lib/nillion/utils"
import { logEvent } from "@/lib/postgres"
import { getSentenceLanguage, translateMessage } from "@/lib/prompts"
import { cleanString } from "@/lib/strings"
import { waitUntil } from "@vercel/functions"

export async function POST(req: Request) {
  console.log(" 🐿  Hello from the translation api endpoint!!")

  const body = await req.json()
  const { text, userId, nativeLanguage, targetLanguage } = body

  if (!text || !userId || !nativeLanguage || !targetLanguage) {
    console.log(" 🍎  ERROR: Missing required parameters")
    await postErrorToDiscord(
      "Missing required parameters on /api/v1/translate: " +
        JSON.stringify({ text, userId, nativeLanguage, targetLanguage })
    )

    return new Response(
      JSON.stringify({
        error: "Missing required parameters",
      })
    )
  }

  console.log(" 🥚 TRANSLATE API STARTED!", text, userId)

  try {
    // ! 1: find the sentence's language

    const sentenceLanguage = await getSentenceLanguage(text)

    console.log(" All the params are: ", {
      text,
      userId,
      nativeLanguage,
      targetLanguage,
    })
    console.log(" 🥚🥚🥚🥚🥚🥚 SENTENCE LANGUAGE:", sentenceLanguage)

    let actualTargetLanguage = "English"
    if (
      sentenceLanguage.trim().toLowerCase() ===
      nativeLanguage.trim().toLowerCase()
    ) {
      actualTargetLanguage = targetLanguage
    } else {
      actualTargetLanguage = nativeLanguage
    }

    const cleanText = cleanString(text)

    const savedTranslation = await getTranslationByMessageAndLanguage({
      message: cleanText,
      fromLanguage: sentenceLanguage,
      toLanguage: actualTargetLanguage,
    })

    if (savedTranslation) {
      postToDiscord("Translation found in DB!")
      console.log(" 🍎  Translation found in DB!", savedTranslation)

      waitUntil(
        logEvent({
          event_type: "translation_hit",
          userId,
          extra: savedTranslation.fromLanguage,
          extra2: savedTranslation.toLanguage,
          extra3: savedTranslation.message,
          extra4: savedTranslation.translation,
        })
      )

      return new Response(
        JSON.stringify({
          translatedMessage: savedTranslation.translation,
          targetLanguage: actualTargetLanguage,
        }),
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      )
    }

    const translatedMessage = await translateMessage({
      message: cleanText,
      language: actualTargetLanguage,
    })

    waitUntil(
      afterTasksMissed({
        userId,
        fromLanguage: sentenceLanguage,
        toLanguage: actualTargetLanguage,
        message: cleanText,
        translation: translatedMessage,
      })
    )
    return new Response(
      JSON.stringify({
        translatedMessage,
        targetLanguage: actualTargetLanguage,
      }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    )
  } catch (error) {
    console.error("Translation API Error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to translate message" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    )
  }
}

const afterTasksMissed = async ({
  userId,
  fromLanguage,
  toLanguage,
  message,
  translation,
}: {
  userId: string
  fromLanguage: string
  toLanguage: string
  message: string
  translation: string
}) => {
  await logEvent({
    event_type: "translation_missed",
    userId,
    extra: fromLanguage,
    extra2: toLanguage,
    extra3: message,
    extra4: translation,
  })
  await writeTranslation({
    fromLanguage,
    toLanguage,
    message,
    translation,
  })
}
