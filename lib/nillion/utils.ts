// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"

const nillionTranslations = new SecretVaultWrapper(
  orgConfig.nodes,
  orgConfig.orgCredentials,
  process.env.TRANSLATIONS_SECRET_VAULT_SCHEMA_ID!
)

const nillionCredits = new SecretVaultWrapper(
  orgConfig.nodes,
  orgConfig.orgCredentials,
  process.env.CREDITS_SECRET_VAULT_SCHEMA_ID!
)

export async function writeTranslation(
  key: string,
  translation: {
    word: string
    translation: string
  }
) {
  try {
    await nillionTranslations.init()
    const result = await nillionTranslations.writeToNodes([
      {
        key,
        translation: translation.translation,
        word: translation.word,
        _id: crypto.randomUUID(),
      },
    ])
    console.log("✅ Successfully wrote to nodes for translations")
    return result
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", JSON.stringify(error))
    process.exit(1)
  }
}
export async function writeCredits({
  key,
  userid,
  credits,
}: {
  key: string
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
        credits: { "%allot": 12 }, // years_in_web3 will be encrypted to a %share
        userid: "manolo",
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

  //   await nillionCredits.init()
  //   const filter = userIdFilter ? { userid: userIdFilter } : ({} as any)

  //   console.log(
  //     " 💜 [readCredits] the filter i have is..." + JSON.stringify(filter)
  //   )

  //   const data = await nillionCredits.readFromNodes({})

  //   console.log(" 💜  the data i have is...", data)

  return []
  //   const credits = data.map((record: any) => ({
  //     id: record._id,
  //     key: record.key,
  //     userid: record.userid,
  //     credits: record.credits,
  //   }))

  //   console.log(" 💜  the credits i have are...", credits)

  //   return credits
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
