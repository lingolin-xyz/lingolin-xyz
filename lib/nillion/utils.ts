// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"

const nillion = new SecretVaultWrapper(
  orgConfig.nodes,
  orgConfig.orgCredentials,
  process.env.SECRET_VAULT_SCHEMA_ID!
)

export async function writeToNodes(key: string, translation: string) {
  await nillion.init()
  const result = await nillion.writeToNodes([
    {
      key,
      translation: { "%allot": translation },
    },
  ])
  return result
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
