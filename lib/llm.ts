import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { CoreMessage, generateText } from "ai"
import { postErrorToDiscord } from "./discord"

export type LLMModel = "gemini-2.0-flash-exp"

export const MODELS_TO_USE: LLMModel[] = ["gemini-2.0-flash-exp"]

export const askAnyLLM = async ({
  messages,
  temperature = 0.8,
  model,
}: {
  messages: CoreMessage[]
  model: LLMModel
  temperature?: number
}) => {
  const modelToUse = await getAIModel(model)

  if (!modelToUse) return null

  console.log(" 🧠 " + model + " called... t:" + temperature)

  const { text } = await generateText({
    temperature,
    model: modelToUse,
    messages,
  })

  console.log(" 🧠 🐣 → [" + model + "] t:" + temperature)
  console.log(text.substring(0, 100))

  return text
}

export const getAIModel = async (model: LLMModel) => {
  switch (model) {
    case "gemini-2.0-flash-exp":
      const apiKey = getRandomGeminiAPIKey()
      const googleFlashExp = createGoogleGenerativeAI({
        apiKey: apiKey,
      })
      return googleFlashExp(model, {})

    default:
      await postErrorToDiscord(" model not available " + model)
  }
}

export const getRandomGeminiAPIKey = () => {
  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY_1!,
    process.env.GOOGLE_GEMINI_API_KEY_2!,
    process.env.GOOGLE_GEMINI_API_KEY_3!,
  ]
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return randomKey
}
