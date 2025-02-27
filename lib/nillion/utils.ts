// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"

const nillion = new SecretVaultWrapper(
  orgConfig.nodes,
  orgConfig.orgCredentials,
  process.env.SECRET_VAULT_SCHEMA_ID!
)

export async function writeToNodes(
  key: string,
  translation: {
    word: string
    translation: string
  }
) {
  try {
    await nillion.init()
    const result = await nillion.writeToNodes([
      {
        key,
        translation: translation.translation,
        word: { "%share": translation.word },
        _id: crypto.randomUUID(),
      },
    ])
    console.log("✅ Successfully wrote to nodes:", result)
    return result
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", JSON.stringify(error))
    process.exit(1)
  }
}

export async function readFromNodes() {
  await nillion.init()
  const data = await nillion.readFromNodes({})
  const translations = data.map((record: any) => ({
    id: record._id,
    key: record.key,
    translation: record.translation,
  }))
  return translations
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

export async function getTranslationByWord(word: string) {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      process.env.SECRET_VAULT_SCHEMA_ID!
    )
    await collection.init()

    // Create a query to find translations by word
    const query = {
      id: "findTranslationByWord",
      variables: {
        word: word,
      },
    }

    // Execute the query against each node
    const results = await Promise.all(
      orgConfig.nodes.map(async (node) => {
        try {
          const response = await fetch(`${node.url}/queries/execute`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NILLION_BEARER_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(query),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()
          return result.data || []
        } catch (error) {
          console.error(`Error querying node ${node.url}:`, error)
          return []
        }
      })
    )

    // Combine and deduplicate results from all nodes
    const allTranslations = results.flat()

    // Remove duplicates based on id
    const uniqueTranslations = Array.from(
      new Map(allTranslations.map((item) => [item._id, item])).values()
    )

    return uniqueTranslations.map((record: any) => ({
      id: record._id,
      key: record.key,
      translation: record.translation,
      word: record.word,
    }))
  } catch (error) {
    console.error("❌ Failed to query translations:", error)
    return []
  }
}
