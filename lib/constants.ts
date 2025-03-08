import NFT_CREDITS_CONTRACT_ABI from "./abi/CreditNFTsABI.json"
export const IS_LOCALHOST = process.env.NODE_ENV === "development"

export const PRIVY_APP_ID = "cm7kput8203rjqfjfh7qhsnj6"
export const ADMIN_EMAILS = ["hellolingolin@gmail.com", "han.test@fbrns.co"]

export const NFT_CREDITS_CONTRACT_ADDRESS =
  "0x2f761EDEb20CC12EDF3f734A5480e5947B8Fdd14"

export { NFT_CREDITS_CONTRACT_ABI }
export const USDC_MONAD_TESTNET_CONTRACT_ADDRESS =
  "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"

export const TESTNET_CHAIN_ID = 10143

export const FLASH_LATEST = "gemini-2.0-flash-exp"

export const TWITTER_LINK = "https://x.com/hellolingolin"

// ! 0x stuff
export const AFFILIATE_FEE = 100 // 1% affiliate fee. Denoted in Bps.
export const FEE_RECIPIENT = "0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917" // The ETH address that should receive affiliate fees
