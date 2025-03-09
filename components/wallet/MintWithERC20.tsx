import { Plus } from "lucide-react"

import { Minus } from "lucide-react"
import { Button } from "../ui/button"
import NumberFlow from "@number-flow/react"
import { useEffect, useState } from "react"

import {
  NFT_CREDITS_CONTRACT_ADDRESS,
  NFT_CREDITS_CONTRACT_ABI,
  USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { useContractWrite, useContractRead, useAccount } from "wagmi"
import Title from "../Title"
import { parseUnits } from "viem"
import { useToast } from "@/hooks/use-toast"

import USDC_CONTRACT_ABI from "@/lib/abi/USDCABI.json"

const MintWithERC20 = () => {
  const { address } = useAccount()
  const [mintAmount, setMintAmount] = useState(1)
  const [isPending, setIsPending] = useState(false)

  const {
    writeContract,
    isPending: isLoading,
    isError,
    error,
  } = useContractWrite()

  const { data: usdcBalance } = useContractRead({
    address: USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}` | undefined],
  })

  const { data: allowance } = useContractRead({
    address: USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
    abi: USDC_CONTRACT_ABI,
    functionName: "allowance",
    args: [address as `0x${string}` | undefined, NFT_CREDITS_CONTRACT_ADDRESS],
  })

  const { writeContract: approveUsdc, isPending: isApproving } =
    useContractWrite()

  const handleDecrement = () => {
    setMintAmount(mintAmount - 1)
  }

  const handleIncrement = () => {
    setMintAmount(mintAmount + 1)
  }

  const { toast } = useToast()
  const handleMint = async () => {
    toast({
      title: "Minting...",
      description: "Minting your NFTs..." + address,
    })
    try {
      setIsPending(true)

      const requiredAmount = parseUnits(
        (PRICE_PER_MINT * mintAmount).toString(),
        6
      )

      if (
        !allowance ||
        (allowance && BigInt(allowance.toString()) < requiredAmount)
      ) {
        await approveUsdc({
          address: USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
          abi: USDC_CONTRACT_ABI,
          functionName: "approve",
          args: [NFT_CREDITS_CONTRACT_ADDRESS, requiredAmount],
        })
      }

      await writeContract({
        address: NFT_CREDITS_CONTRACT_ADDRESS,
        abi: NFT_CREDITS_CONTRACT_ABI,
        functionName: "mintNFTWithToken",
        args: [mintAmount],
      })
    } catch (err) {
      console.error("Minting failed:", err)
    } finally {
      setIsPending(false)
    }
  }

  const PRICE_PER_MINT = 0.0002
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setTotalPrice(Number(Number(PRICE_PER_MINT * mintAmount).toFixed(5)))
  }, [mintAmount])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Buy Credits as NFTs</h3>
      {isError && (
        <div className="text-red-500 text-sm">
          Error: {error?.message || "Failed to mint"}
        </div>
      )}
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
          <div className="min-w-16 text-center translate-y-1">
            <NumberFlow value={mintAmount} />
          </div>
        </Title>

        <Button variant="outline" size="icon" onClick={handleIncrement}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        onClick={handleMint}
        className="w-full"
        disabled={
          Boolean(isLoading) ||
          Boolean(isPending) ||
          Boolean(isApproving) ||
          Boolean(
            usdcBalance &&
              BigInt(usdcBalance.toString()) <
                parseUnits((PRICE_PER_MINT * mintAmount).toString(), 6)
          )
        }
      >
        {isLoading || isPending || isApproving ? (
          isApproving ? (
            "APPROVING USDC..."
          ) : (
            "MINTING..."
          )
        ) : (
          <div className="flex items-center space-x-0 min-w-52 justify-center">
            <span>MINT NOW! (</span>
            <span className="tabular-nums font-bold tracking-tighter">
              {/* <NumberFlow value={Number(totalPrice)} /> USDC */}$
              {totalPrice} USDC
            </span>
            <span>)</span>
          </div>
        )}
      </Button>
    </div>
  )
}

export default MintWithERC20
