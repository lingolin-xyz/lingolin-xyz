"use client"

import { useAccount, useContractRead } from "wagmi"
import { NFT_CREDITS_CONTRACT_ADDRESS, TESTNET_CHAIN_ID } from "@/lib/constants"
import { useState, useEffect } from "react"
import { NFT_CREDITS_CONTRACT_ABI } from "@/lib/constants"

const UserNFTsClientExplorer = () => {
  const { address, isConnected } = useAccount()
  const [nftCount, setNftCount] = useState<number | null>(null)

  const { data, isError, isLoading } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
  })

  useEffect(() => {
    if (data) {
      setNftCount(Number(data))
    }
  }, [data])

  if (isLoading) return <div>Loading NFT balance...</div>
  if (isError) return <div>Error fetching NFT balance</div>
  if (!isConnected) return <div>Connect your wallet to view NFTs</div>

  return (
    <div>
      <h2>Your NFT Balance</h2>
      <p>You own {nftCount ?? 0} NFTs from this collection</p>
    </div>
  )
}

export default UserNFTsClientExplorer
