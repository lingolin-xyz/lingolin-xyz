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
import NFTInProfilePage from "./NFTInProfilePage"
import { usePrivy } from "@privy-io/react-auth"
import MintWithERC20 from "./MintWithERC20"
import MintWithStripe from "./MintWithStripe"

const UserNFTsClientExplorer = () => {
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
  if (isLoading) return <div>Loading NFT balance...</div>
  if (isError) return <div>Error fetching NFT balance</div>
  if (!isConnected) return <div>Connect your wallet to view NFTs</div>

  return (
    <div className="flex flex-col gap-4 flex-1 p-4">
      {/* <h2>Your NFT Balance</h2> */}
      {/* <p>You own {nftCount ?? 0} NFTs from this collection</p> */}

      <div className="w-full flex justify-center gap-4">
        <div className="bg-zinc-100 p-4 lg:p-9 rounded-2xl max-w-sm flex justify-center">
          <MintWithStripe />
        </div>
        <div className="bg-zinc-100 p-4 lg:p-9 rounded-2xl max-w-sm flex justify-center">
          <MintWithERC20 />
        </div>
      </div>
      {tokenIds.length > 0 && (
        <div className="mt-4">
          <SmolTitle>Your NFTs:</SmolTitle>
          <div className="mt-2 flex flex-wrap gap-4">
            {tokenIds.map((id) => (
              <NFTInProfilePage key={id} tokenId={id} />
            ))}
          </div>
        </div>
      )}

      {/* <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Mint New NFTs</h3>
          <div className="flex items-center space-x-2 justify-center select-none">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={mintAmount <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Title>
              <div className="min-w-16 text-center">
                <NumberFlow value={mintAmount} />
              </div>
            </Title>

            <Button variant="outline" size="icon" onClick={handleIncrement}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleMint} className="w-full">
            MINT NOW!
          </Button>
        </div> */}
    </div>
  )
}

export default UserNFTsClientExplorer
