import NFT_CREDITS_CONTRACT_ABI from "./abi/CreditNFTsABI.json"
import USDC_TOKEN_CONTRACT_ABI from "./abi/USDCTokenABI.json"
export const IS_LOCALHOST = process.env.NODE_ENV === "development"

export const PRIVY_APP_ID = "cm7kput8203rjqfjfh7qhsnj6"
export const ADMIN_EMAILS = ["hellolingolin@gmail.com", "han.test@fbrns.co"]

export const NFT_CREDITS_CONTRACT_ADDRESS =
  "0x063dDbf3E7370813165Ac800c21cae82904c321F"

export { NFT_CREDITS_CONTRACT_ABI }
export const USDC_MONAD_TESTNET_CONTRACT_ADDRESS =
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"

export { USDC_TOKEN_CONTRACT_ABI }

export const TESTNET_CHAIN_ID = 10143

export const FLASH_LATEST = "gemini-2.0-flash-exp"
