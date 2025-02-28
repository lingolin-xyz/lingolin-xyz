// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"

const nillionTranslations = new SecretVaultWrapper(
  orgConfig.nodes,
  orgConfig.orgCredentials,
  process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
)

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
        credits: { "%allot": credits }, // years_in_web3 will be encrypted to a %share
        userid,
      },
    ]
    const dataWritten = await collection.writeToNodes(web3ExperienceSurveyData)
    console.log("dataWritten", dataWritten)

    const newIds = [
      ...new Set(dataWritten.map((item: any) => item.data.created).flat()),
    ]
    console.log("created ids:", newIds)

    const dataRead = await collection.readFromNodes({})
    console.log("📚 total records:", dataRead.length)
    console.log(
      "📚 Read new records:",
      dataRead.slice(0, web3ExperienceSurveyData.length)
    )

    return newIds

    // console.log(" ABOUT TO SAVE:", {
    //   key,
    //   userid,
    //   credits,
    // })

    // const result = await nillionCredits.writeToNodes([
    //   {
    //     key,
    //     userid: userid,
    //     credits: { "%share": credits },
    //     // credits: credits,
    //     _id: crypto.randomUUID(),
    //   },
    // ])
    // console.log("✅ Successfully wrote to nodes for credits")
    // return result
  } catch (error) {
    console.error(
      "❌ Failed to use SecretVaultWrapper writeCredits:",
      JSON.stringify(error)
    )
    process.exit(1)
  }
}

export async function readFromNodes(
  wordFilter?: string | null,
  translationFilter?: string | null
) {
  await nillionTranslations.init()
  const filter = wordFilter ? { word: wordFilter } : ({} as any)
  if (translationFilter) {
    filter.translation = translationFilter
  }

  console.log(" 💜  the filter i have is..." + JSON.stringify(filter))

  const data = await nillionTranslations.readFromNodes(filter)

  console.log(" 💜  the data i have is...", data)

  const translations = data.map((record: any) => ({
    id: record._id,
    key: record.key,
    translation: record.translation,
    word: record.word,
  }))

  console.log(" 💜  the translations i have are...", translations)

  return translations
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
  console.log("📚 READ OK!!!!!!! total records:", dataRead.length)
  console.log("📚 READ OK!!!!!!! dataRead:", dataRead)

  return dataRead
}

export const flushData = async () => {
  const collection = new SecretVaultWrapper(
    orgConfig.nodes,
    orgConfig.orgCredentials,
    process.env.SECRET_VAULT_SCHEMA_ID!
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

// export async function getTranslationByWord(word: string) {
//   try {
//     const collection = new SecretVaultWrapper(
//       orgConfig.nodes,
//       orgConfig.orgCredentials,
//       process.env.SECRET_VAULT_SCHEMA_ID!
//     )
//     await collection.init()

//     // Create a query to find translations by word
//     const query = {
//       id: "findTranslationByWord",
//       variables: {
//         word: word,
//       },
//     }

//     // Execute the query against each node
//     const results = await Promise.all(
//       orgConfig.nodes.map(async (node) => {
//         try {
//           const response = await fetch(`${node.url}/queries/execute`, {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${process.env.NILLION_BEARER_TOKEN}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(query),
//           })

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`)
//           }

//           const result = await response.json()
//           return result.data || []
//         } catch (error) {
//           console.error(`Error querying node ${node.url}:`, error)
//           return []
//         }
//       })
//     )

//     // Combine and deduplicate results from all nodes
//     const allTranslations = results.flat()

//     // Remove duplicates based on id
//     const uniqueTranslations = Array.from(
//       new Map(allTranslations.map((item) => [item._id, item])).values()
//     )

//     return uniqueTranslations.map((record: any) => ({
//       id: record._id,
//       key: record.key,
//       translation: record.translation,
//       word: record.word,
//     }))
//   } catch (error) {
//     console.error("❌ Failed to query translations:", error)
//     return []
//   }
// }

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
      process.env.CREDITS_SECRET_VAULT_SCHEMA_ID!
    )
    await collection.init()

    const web3ExperienceSurveyData = [
      {
        credits: { "%allot": credits }, // years_in_web3 will be encrypted to a %share
        userid,
      },
    ]
    const dataWritten = await collection.writeToNodes(web3ExperienceSurveyData)
    console.log("dataWritten", dataWritten)

    const newIds = [
      ...new Set(dataWritten.map((item: any) => item.data.created).flat()),
    ]
    console.log("created ids:", newIds)

    const dataRead = await collection.readFromNodes({})
    console.log("📚 total records:", dataRead.length)
    console.log(
      "📚 Read new records:",
      dataRead.slice(0, web3ExperienceSurveyData.length)
    )

    return newIds

    // console.log(" ABOUT TO SAVE:", {
    //   key,
    //   userid,
    //   credits,
    // })

    // const result = await nillionCredits.writeToNodes([
    //   {
    //     key,
    //     userid: userid,
    //     credits: { "%share": credits },
    //     // credits: credits,
    //     _id: crypto.randomUUID(),
    //   },
    // ])
    // console.log("✅ Successfully wrote to nodes for credits")
    // return result
  } catch (error) {
    console.error(
      "❌ Failed to use SecretVaultWrapper writeCredits:",
      JSON.stringify(error)
    )
    process.exit(1)
  }
}
