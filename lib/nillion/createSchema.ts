// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { orgConfig } from "./orgConfig"
import creditsSchema from "./credits-schema.json" assert { type: "json" }
import translationsSchema from "./translations-schema.json" assert { type: "json" }

export const createSchema = async (type: "credits" | "translations") => {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    )
    await org.init()

    // create a new collectionschema
    const newSchema = await org.createSchema(
      type === "credits" ? creditsSchema : translationsSchema,
      type === "credits" ? "Lingolin Credits" : "Lingolin Translations"
    )
    console.log("📚 New Schema:", newSchema)
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", JSON.stringify(error))
    process.exit(1)
  }
}
