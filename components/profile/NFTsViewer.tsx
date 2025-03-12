"use client"
import { useAccount, useContractRead } from "wagmi"
import { NFT_CREDITS_CONTRACT_ADDRESS, TESTNET_CHAIN_ID } from "@/lib/constants"
import { useState, useEffect } from "react"
import { NFT_CREDITS_CONTRACT_ABI } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import NumberFlow from "@number-flow/react"
import SmolTitle from "../SmolTitle"
import Title from "../Title"
import axios from "axios"
import Image from "next/image"
import BlurryEntrance from "../BlurryEntrance"
import { usePrivy } from "@privy-io/react-auth"
import MintWithERC20 from "../wallet/MintWithERC20"
import MintWithStripe from "../wallet/MintWithStripe"

import NFTInProfilePage from "../wallet/NFTInProfilePage"
import BigTitle from "../BigTitle"

export default function NFTsViewer() {
  const { user } = usePrivy()
  const { address, isConnected } = useAccount()
  const [nftCount, setNftCount] = useState<number | null>(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [tokenIds, setTokenIds] = useState<number[]>([])
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: number]: any }>({})
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)
  const [currentTokenId, setCurrentTokenId] = useState<number | null>(null)

  const { data, isError, isLoading } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
  })

  const { data: tokenOfOwnerByIndexData } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "tokensOfOwner",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
    // enabled: !!address && nftCount !== null && nftCount > 0,
  })

  const { data: tokenURI } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "tokenURI",
    args: [currentTokenId],
    chainId: TESTNET_CHAIN_ID,
    // enabled: currentTokenId !== null,
  })

  const handleIncrement = () => {
    setMintAmount((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (mintAmount > 1) {
      setMintAmount((prev) => prev - 1)
    }
  }
  const { toast } = useToast()

  const handleMint = async () => {
    if (!user) return false
    toast({
      title: "Minting...",
      description: "Minting NFTs...",
    })

    const res = await axios.post("/api/server-mint", {
      address,
      amount: mintAmount,
      userId: user.id,
    })

    if (res.status === 200) {
      toast({
        title: "Minting successful",
        description: "NFTs minted successfully",
      })
    } else {
      toast({
        title: "Minting failed",
        description: "NFTs minting failed",
      })
    }
  }

  useEffect(() => {
    if (data) {
      setNftCount(Number(data))
    }
  }, [data])

  useEffect(() => {
    if (tokenOfOwnerByIndexData) {
      const ids = Array.isArray(tokenOfOwnerByIndexData)
        ? tokenOfOwnerByIndexData.map((id) => Number(id))
        : []
      setTokenIds(ids)
    }
  }, [tokenOfOwnerByIndexData])
  if (isLoading) return <div></div>
  if (isError) return <div></div>
  if (!isConnected) return <div></div>

  // if (tokenIds.length > 0 && (
  //     <div className="mt-4">
  //       <SmolTitle>Your NFTs:</SmolTitle>
  //       <div className="mt-2 flex flex-wrap gap-4">
  //         {tokenIds.map((id) => (
  //           <NFTInProfilePage key={id} tokenId={id} />
  //       ))}
  //     </div>
  //   </div>
  // )

  return (
    <div className="py-12 text-center flex flex-col items-center justify-center">
      <BigTitle>Your NFTs:</BigTitle>
      <div className="mt-2 flex flex-wrap gap-4 items-center justify-center">
        {tokenIds.map((id) => (
          <NFTInProfilePage key={id} tokenId={id} />
        ))}
      </div>
    </div>
  )
}
