// import {
//   getTranslationByMessageAndLanguage,
//   saveTextTranslation,
// } from "@/lib/posgres"
// import { translateMessage } from "@/lib/prompts"
import { waitUntil } from "@vercel/functions"

export async function POST(req: Request) {
  const body = await req.json()
  const { text, userId } = body

  if (!text || !userId) {
    return new Response(
      JSON.stringify({
        error: "Missing required parameters: text and userId",
      })
    )
  }

  console.log(" 🥚 TRANSLATE API STARTED!", text, userId)

  return new Response(JSON.stringify({ finished: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
  //   try {
  //     const savedTranslation = await getTranslationByMessageAndLanguage({
  //       message,
  //       language,
  //     })

  //     if (savedTranslation) {
  //       return new Response(
  //         JSON.stringify({
  //           translatedMessage: savedTranslation.translated_message,
  //         }),
  //         {
  //           status: 200,
  //           headers: {
  //             "Access-Control-Allow-Origin": "*",
  //             "Access-Control-Allow-Methods": "POST, OPTIONS",
  //             "Access-Control-Allow-Headers": "Content-Type",
  //           },
  //         }
  //       )
  //     }

  //     const translatedMessage = await translateMessage({ message, language })

  //     waitUntil(
  //       saveTranslatedMessageToDB({ message, language, translatedMessage })
  //     )

  //     return new Response(JSON.stringify({ translatedMessage }), {
  //       status: 200,
  //       headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Methods": "POST, OPTIONS",
  //         "Access-Control-Allow-Headers": "Content-Type",
  //       },
  //     })
  //   } catch (error) {
  //     console.error("Translation API Error:", error)
  //     return new Response(
  //       JSON.stringify({ error: "Failed to translate message" }),
  //       {
  //         status: 500,
  //         headers: {
  //           "Access-Control-Allow-Origin": "*",
  //           "Access-Control-Allow-Methods": "POST, OPTIONS",
  //           "Access-Control-Allow-Headers": "Content-Type",
  //         },
  //       }
  //     )
  //   }
}

// const saveTranslatedMessageToDB = async ({
//   message,
//   language,
//   translatedMessage,
// }: {
//   message: string
//   language: string
//   translatedMessage: string
// }) => {
//   await saveTextTranslation({
//     message,
//     language,
//     translatedMessage,
//   })
// }
