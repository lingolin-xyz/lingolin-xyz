import { writeCredits } from "@/lib/nillion/utils"

export async function POST(req: Request) {
  await writeCredits({
    userid: "test123",
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
