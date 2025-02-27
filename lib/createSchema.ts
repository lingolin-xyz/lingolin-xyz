// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./nillion"
import schema from "./schema.json" assert { type: "json" }

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    )
    await org.init()

    // create a new collectionschema
    const newSchema = await org.createSchema(schema, "Web3 Experience Survey")
    console.log("📚 New Schema:", newSchema)
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", JSON.stringify(error))
    process.exit(1)
  }
}

main()
