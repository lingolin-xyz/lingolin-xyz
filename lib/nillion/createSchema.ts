// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"
import schema from "./schema.json" assert { type: "json" }

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    )
    await org.init()

    // create a new collectionschema
    const newSchema = await org.createSchema(schema, "Lingolin Translations")
    console.log("📚 New Schema:", newSchema)
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", JSON.stringify(error))
    process.exit(1)
  }
}

main()
