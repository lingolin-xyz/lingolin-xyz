import { writeTranslation } from "@/lib/nillion/utils"

export async function POST(req: Request) {
  //   const body = await req.json()
  //   const { text, userId } = body

  //   if (!text || !userId) {
  //     return new Response(
  //       JSON.stringify({
  //         error: "Missing required parameters: text and userId",
  //       })
  //     )
  //   }

  const randonWord = Math.random().toString(36).substring(2, 15)

  await writeTranslation(randonWord, {
    word: "manolo",
    translation: "maola",
  })

  console.log(" 💚  SAVEDDDDDDDD!", randonWord)

  return new Response(JSON.stringify({ finished: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
