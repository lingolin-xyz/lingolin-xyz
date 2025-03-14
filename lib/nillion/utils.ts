// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"
import { postToDiscord } from "../discord"
import { revalidateTag } from "next/cache"

export async function writeCredits({
  userid,
  credits,
}: {
  userid: string
  credits: number
}) {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      process.env.CREDITS_SECRET_VAULT_SCHEMA_ID!
    )
    await collection.init()

    const web3ExperienceSurveyData = [
      {
        credits: { "%allot": credits }, // credits will be encrypted to a %share
        userid,
      },
    ]
    await collection.writeToNodes(web3ExperienceSurveyData)

    const dataRead = await collection.readFromNodes({})
    console.log("📚 total records:", dataRead.length)

    return dataRead
  } catch (error) {
    console.error(
      "❌ Failed to use SecretVaultWrapper writeCredits:",
      JSON.stringify(error)
    )
    return false
  }
}

export async function readCredits(userIdFilter?: string | null) {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.CREDITS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()
  const filter = userIdFilter ? { userid: userIdFilter } : ({} as any)

  const dataRead = await collection.readFromNodes(filter)

  if (userIdFilter) {
    if (dataRead && dataRead.length > 0) {
      const formatted = dataRead.map((item: any) => ({
        userid: item.userid,
        credits: parseInt(item.credits),
        _id: item._id,
      }))
      return formatted[0]
    } else {
      return null
    }
  } else {
    return dataRead.map((item: any) => ({
      userid: item.userid,
      credits: parseInt(item.credits),
      _id: item._id,
    }))
  }
}

export const updateCreditsValueById = async (
  recordId: string,
  credits: number
) => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.CREDITS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()

  const readDataFiltered = await collection.readFromNodes({ _id: recordId })

  if (readDataFiltered) {
    const recordUpdate = readDataFiltered[0]
    const clearRecord = {
      userid: recordUpdate.userid,
      credits: credits,
    }

    // console.log(
    //   " stepppo 3 📗  FROM",
    //   recordUpdate.credits,
    //   " to be updated to ",
    //   clearRecord.credits
    // )

    await collection.updateDataToNodes(clearRecord, {
      _id: recordId,
    })

    revalidateTag(`user-credits-${clearRecord.userid}`)
    await postToDiscord(
      `New credits for User...: ${clearRecord.userid} ${credits}`
    )
  } else {
    console.error("❌ Failed to use SecretVaultWrapper updateCreditsValueById:")
  }
}

export const flushTranslationsData = async () => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()

  const flushedData = await collection.flushData()
  console.log(flushedData)
}

export const flushCreditsData = async () => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.CREDITS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()

  const flushedData = await collection.flushData()
  console.log(flushedData)
}
export const getTranslationByMessageAndLanguage = async ({
  message,
  fromLanguage,
  toLanguage,
}: {
  message: string
  fromLanguage: string
  toLanguage: string
}): Promise<any | null> => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()
  const filter = { message, fromLanguage, toLanguage }

  const dataRead = await collection.readFromNodes(filter)

  return dataRead && dataRead.length > 0 ? dataRead[0] : null
}

export const getAllTranslationsByLanguage = async (language: string) => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()
  const filter = { language }
  const dataRead = await collection.readFromNodes(filter)
  return dataRead
}

export const getAllTranslations = async () => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()
  const dataRead = await collection.readFromNodes({})
  return dataRead
}

export async function writeTranslation({
  fromLanguage,
  toLanguage,
  message,
  translation,
}: {
  fromLanguage: string
  toLanguage: string
  message: string
  translation: string
}) {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
    )
    await collection.init()

    const web3ExperienceSurveyData = [
      {
        fromLanguage,
        toLanguage,
        message,
        translation,
      },
    ]
    await collection.writeToNodes(web3ExperienceSurveyData)
    // const dataWritten = await collection.writeToNodes(web3ExperienceSurveyData)
    // console.log("dataWritten", dataWritten)

    // const newIds = [
    //   ...new Set(dataWritten.map((item: any) => item.data.created).flat()),
    // ]

    const dataRead = await collection.readFromNodes({})
    console.log("📚 total translations:", dataRead.length)
    // console.log(
    //   "📚 Read new records:",
    //   dataRead.slice(0, web3ExperienceSurveyData.length)
    // )

    return dataRead
  } catch (error) {
    console.error(
      "❌ Failed to use SecretVaultWrapper writeTranslation:",
      error
    )
    return false
  }
}
