import { ethers } from "ethers"
import {
  NFT_CREDITS_CONTRACT_ADDRESS,
  NFT_CREDITS_CONTRACT_ABI,
} from "./constants"
import { postToDiscord } from "./discord"

export const mintNftCreditsBatch = async ({
  amount,
  address,
}: {
  amount: number
  address: string
}) => {
  // Crea un provider y un signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
  const deployerWallet = new ethers.Wallet(
    process.env.DEPLOYER_WALLET_PRIVATE_KEY!,
    provider
  )

  // Si en algún momento necesitas el bytecode: const bytecode = artifact.bytecode;

  // Crea la instancia del contrato (conectada al owner, que es el deployer)
  const contract = new ethers.Contract(
    NFT_CREDITS_CONTRACT_ADDRESS,
    NFT_CREDITS_CONTRACT_ABI,
    deployerWallet
  )

  try {
    const tx = await contract.mintBatch(address, amount)

    await postToDiscord(`💸 NFT minteado! Confirmado en el bloque: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(
      "¡Coño, NFT minteado! Confirmado en el bloque:",
      receipt.blockNumber
    )

    return tx.hash
  } catch (error) {
    console.error("Error al mintear el NFT:", error)
    return null
  }
}
