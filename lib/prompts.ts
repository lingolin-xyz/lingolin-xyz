import { CoreMessage } from "ai"
import { askAnyLLM } from "./llm"
import { postErrorToDiscord } from "./discord"
import { askNillionSecretLLM } from "./nillion/secretLLM"

export const translateMessage = async ({
  message,
  language,
}: {
  message: string
  language: string
}) => {
  const messages = [
    {
      role: "user",
      content: `Translate this message to the language "${language}": 

<TheMessageToTranslate>
${message}
</TheMessageToTranslate>
      
      
<Important>Reply in plain text, just with the translated message.</Important>`,
    },
  ] as CoreMessage[]

  const resFromLLM = await askAnyLLM({
    messages,
    model: "gemini-2.0-flash-exp",
    temperature: 0,
  })

  if (!resFromLLM) {
    await postErrorToDiscord("no res from llm!")
    return "❌"
  }

  return resFromLLM.trim()
}

export const getSentenceLanguage = async (sentence: string) => {
  const messages = [
    {
      role: "user",
      content: `Identify the language of the following sentence:

<TheSentenceToIdentifyLanguage>
${sentence}
</TheSentenceToIdentifyLanguage>

<Important>Reply in plain text, just with the language name, naming it like "English", "Spanish", "French", etc.</Important>

<Important>If it's unclear the language, like the word "WiFi" that is used in English but other languages too, default to the more mainstream language (probably English)</Important>`,
    },
  ] as CoreMessage[]

  const resFromLLM = await askNillionSecretLLM({
    messages,
    temperature: 0,
  })

  if (!resFromLLM) {
    await postErrorToDiscord("no res from llm!")
    return "❌"
  }

  return resFromLLM.trim()
}
