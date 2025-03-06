import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { CoreMessage, generateText } from "ai"
import { postErrorToDiscord } from "./discord"
import { createGroq } from "@ai-sdk/groq"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { createAnthropic } from "@ai-sdk/anthropic"

export type LLMModel =
  | "gemini-2.0-flash-exp"
  | "gemini-2.0-flash-thinking-exp"
  | "gpt-4o-mini"
  | "llama-3.3-70b-versatile"
  | "deepseek-chat"
  | "claude-3-5-sonnet-20241022"

export const MODELS_TO_USE: LLMModel[] = [
  "gemini-2.0-flash-exp",
  // "gemini-2.0-flash-thinking-exp",
  // "gpt-4o-mini",
  // "llama-3.3-70b-versatile",
  "deepseek-chat",
  "claude-3-5-sonnet-20241022",
]

export const askAnyLLM = async ({
  messages,
  temperature = 0.8,
  model,
  useCase = "default",
}: {
  messages: CoreMessage[]
  model: LLMModel
  temperature?: number
  useCase?: string
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
    case "gemini-2.0-flash-thinking-exp":
      const apiKey2 = getRandomGeminiAPIKey()
      const googleFlashThinkingExp = createGoogleGenerativeAI({
        apiKey: apiKey2,
      })
      return googleFlashThinkingExp(model, {})

    case "gpt-4o-mini":
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
        compatibility: "strict",
      })
      return openai(model)

    case "llama-3.3-70b-versatile":
      const groqKey = getRandomGroqAPIKey()
      const groq = createGroq({
        apiKey: groqKey,
      })
      return groq(model)

    case "deepseek-chat":
      const deepseek = createDeepSeek({
        apiKey: process.env.DEEPSEEK_API_KEY ?? "",
      })
      return deepseek(model)

    case "claude-3-5-sonnet-20241022":
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY ?? "",
      })
      return anthropic(model)

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

const getRandomGroqAPIKey = () => {
  const keys = [
    process.env.GROQ_API_KEY_1!,
    process.env.GROQ_API_KEY_2!,
    process.env.GROQ_API_KEY_3!,
  ]
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return randomKey
}
