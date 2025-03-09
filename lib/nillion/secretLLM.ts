import { CoreMessage } from "ai"
import { postToDiscord } from "../discord"

export const askNillionSecretLLM = async ({
  messages,
  temperature,
}: {
  messages: CoreMessage[]
  temperature: number
}) => {
  try {
    const response = await fetch(
      `${process.env.NILAI_API_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NILAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages,
          temperature,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const theResponse = data.choices[0].message.content
    await postToDiscord(" CAME BACK FROM NIL AI: " + theResponse)
    return theResponse
  } catch (error) {
    console.error("Error in askNillionSecretLLM:", error)
    throw error
  }
}
