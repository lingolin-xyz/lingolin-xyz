import { IS_LOCALHOST } from "./constants"

import axios from "axios"

const DISCORD_WEBHOOK_ERRORS_URL = process.env.DISCORD_WEBHOOK_ERRORS_URL
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

export const postErrorToDiscord = async (message: string) => {
  if (
    !DISCORD_WEBHOOK_ERRORS_URL ||
    !DISCORD_WEBHOOK_ERRORS_URL.trim().length
  ) {
    console.log("🛑 No Discord webhook URL found. The message is: ", message)
    return
  }

  const params = {
    username: "lin-error",
    content: message,
  }

  try {
    await axios.post(DISCORD_WEBHOOK_ERRORS_URL, params)
  } catch (error) {
    console.log("🛑 Error posting to Discord (1)", error)
  }
}

export const postToDiscord = async (message: string) => {
  if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.trim().length) {
    console.log("🛑 No Discord webhook URL found. The message is: ", message)
    return
  }

  const params = {
    username: "lin-logger",
    content: message,
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, params)
  } catch (error) {
    console.log("🛑 Error posting to Discord (2)", error)
  }
}

export const postWebVisitToDiscord = async (message: string) => {
  const theURL = process.env.DISCORD_WEBHOOK_SITE_VISITS_URL

  if (!theURL || !theURL.trim().length) {
    console.log("🛑 No Discord webhook URL found. The message is: ", message)
    return
  }

  if (IS_LOCALHOST) {
    console.log(
      "🟪 Discord message (not posted because it's localhost):\n",
      message
    )
    return
  }

  const params = {
    username: "lin-visits",
    content: message,
  }

  try {
    await axios.post(theURL, params)
  } catch (error) {
    console.log("🛑 Error posting to Discord (3)", error)
  }
}
