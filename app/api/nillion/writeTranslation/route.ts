import { writeTranslation } from "@/lib/nillion/utils"

export async function POST() {
  await writeTranslation({
    fromLanguage: "English",
    toLanguage: "Spanish",
    message: "hello",
    translation: "Hola",
  })

  console.log(" 💚  SAVEDDDDDDDD new translation!")

  return new Response(JSON.stringify({ finished: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
