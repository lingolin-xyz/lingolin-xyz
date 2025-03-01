// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"

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
  return dataRead && dataRead.length > 0 ? dataRead[0] : null
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
  language,
}: {
  message: string
  language: string
}): Promise<any | null> => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
  )
  await collection.init()
  const filter = { message, language }

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
    const dataWritten = await collection.writeToNodes(web3ExperienceSurveyData)
    console.log("dataWritten", dataWritten)

    // const newIds = [
    //   ...new Set(dataWritten.map((item: any) => item.data.created).flat()),
    // ]

    const dataRead = await collection.readFromNodes({})
    console.log("📚 total records:", dataRead.length)
    console.log(
      "📚 Read new records:",
      dataRead.slice(0, web3ExperienceSurveyData.length)
    )

    return dataRead
  } catch (error) {
    console.error(
      "❌ Failed to use SecretVaultWrapper writeTranslation:",
      error
    )
    return false
  }
}
