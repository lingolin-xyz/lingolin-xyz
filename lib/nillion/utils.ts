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
