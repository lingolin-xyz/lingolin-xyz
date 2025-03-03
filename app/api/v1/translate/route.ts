import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import {
  getTranslationByMessageAndLanguage,
  writeTranslation,
} from "@/lib/nillion/utils"
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
      waitUntil(postToDiscord("Translation found in DB!"))
      console.log(" 🍎  Translation found in DB!", savedTranslation)

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
    // ! TODO: add log event to supabase too... maybe discord too, etc...
    waitUntil(
      writeTranslation({
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
