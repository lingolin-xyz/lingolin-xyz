import { writeCredits } from "@/lib/nillion/utils"

export async function POST(req: Request) {
  const randonWord = Math.random().toString(36).substring(2, 15)

  await writeCredits(randonWord, {
    userid: "123",
    credits: {
      "%share": "100",
    },
  })

  console.log(" 💚  SAVEDDDDDDDD!", randonWord)

  return new Response(JSON.stringify({ finished: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
