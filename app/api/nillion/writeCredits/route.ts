import { writeCredits } from "@/lib/nillion/utils"

export async function POST(req: Request) {
  const randomWord = Math.random().toString(36).substring(2, 15)

  await writeCredits({
    key: randomWord,
    userid: "123",
    credits: 5000,
  })

  console.log(" 💚 New Credits Record Saved! LFG")

  return new Response(JSON.stringify({ finished: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
