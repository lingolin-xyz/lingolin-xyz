// @ts-expect-error - secretvaults is not typed
import { SecretVaultWrapper } from "secretvaults"
import { v4 as uuidv4 } from "uuid"
import { orgConfig } from "./orgConfig"

const SCHEMA_ID = "YOUR_SCHEMA_ID"

const web3ExperienceSurveyData = [
  {
    years_in_web3: { "%allot": 8 }, // years_in_web3 will be encrypted to a %share
    responses: [
      { rating: 5, question_number: 1 },
      { rating: 3, question_number: 2 },
    ], // responses will be stored in plaintext
  },
]
async function main() {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    )
    await collection.init()

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
  } catch (error) {
    console.error("❌ Failed to use SecretVaultWrapper:", error.message)
    process.exit(1)
  }
}

main()
