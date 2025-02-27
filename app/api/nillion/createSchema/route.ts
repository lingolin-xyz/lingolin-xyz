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
}
