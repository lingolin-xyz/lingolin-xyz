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

const UserNFTsClientExplorer = () => {
  const { address, isConnected } = useAccount()
  const [nftCount, setNftCount] = useState<number | null>(null)
  const [mintAmount, setMintAmount] = useState(1)

  const { data, isError, isLoading } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
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
    const res = await axios.post("/api/server-mint", {
      address,
      amount: mintAmount,
    })

    toast({
      title: "Minting...",
      description: "Minting NFTs...",
    })
  }

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

      <div className="mt-6 space-y-4">
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
      </div>
    </div>
  )
}

export default UserNFTsClientExplorer
