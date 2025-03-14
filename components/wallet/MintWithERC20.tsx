import { Loader2, Plus } from "lucide-react"

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
import BlurryEntranceFaster from "../BlurryEntranceFaster"
import axios from "axios"
import { useUser } from "@privy-io/react-auth"
import Link from "next/link"
import SmolTitle from "../SmolTitle"

const MintWithERC20 = () => {
  const { address } = useAccount()
  const [mintAmount, setMintAmount] = useState(1)
  const [isPending, setIsPending] = useState(false)

  const {
    writeContract,
    isPending: isLoading,
    isError,
    error,
    data: mintResult,
  } = useContractWrite()

  const { data: usdcBalance, isLoading: isLoadingBalance } = useContractRead({
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

  const {
    writeContract: approveUsdc,
    isPending: isApproving,
    data: approveResult,
  } = useContractWrite()

  const handleDecrement = () => {
    setMintAmount(mintAmount - 1)
  }

  const handleIncrement = () => {
    setMintAmount(mintAmount + 1)
  }

  const { toast } = useToast()

  const { user } = useUser()

  const [showMintingSuccess, setShowMintingSuccess] = useState<string | null>(
    null
  )

  useEffect(() => {
    const callToMint = async () => {
      if (!user) return
      setShowMintingSuccess(mintResult ? mintResult : null)
      await axios.post("/api/v2/update-credits", {
        address: address,
        amount: mintAmount,
        txHash: mintResult,
        units: mintAmount,
        userId: user.id,
      })
    }

    if (mintResult) {
      callToMint()
    }
  }, [mintResult, toast, user, address, mintAmount])

  useEffect(() => {
    const callToMint = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await writeContract({
        address: NFT_CREDITS_CONTRACT_ADDRESS,
        abi: NFT_CREDITS_CONTRACT_ABI,
        functionName: "mintNFTWithToken",
        args: [mintAmount],
      })
    }

    if (approveResult) {
      console.log("approveResult", approveResult)
      callToMint()
    }
  }, [approveResult, writeContract, mintAmount])

  const handleMint = async () => {
    // toast({
    //   title: "Minting...",
    //   description: "Minting your NFTs..." + address,
    // })
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
    } catch (err) {
      console.error("Minting failed:", err)
      toast({
        title: "Error",
        description: "Failed to mint NFTs",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  const PRICE_PER_MINT = 0.0002
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setTotalPrice(Number(Number(PRICE_PER_MINT * mintAmount).toFixed(5)))
  }, [mintAmount])

  let canMint = false

  if (usdcBalance) {
    if (Number(usdcBalance?.toString()) > Number(PRICE_PER_MINT * mintAmount)) {
      canMint = true
    }
  }

  if (isLoadingBalance)
    return (
      <div className="flex items-center space-x-2 justify-center select-none py-12">
        <div>Reading your balance...</div>
        <div>
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </div>
    )

  if (!canMint) {
    return (
      <div>
        <div className="text-red-500 text-xl">
          You don&apos;t have enough USDC to mint
        </div>
        <Link href="/swap">
          <Button>Swap using 0x</Button>
        </Link>
      </div>
    )
  }

  return (
    <BlurryEntranceFaster>
      {showMintingSuccess && (
        <div className="p-4 bg-emerald-100 flex flex-col items-center justify-center gap-2">
          <SmolTitle>Minting successful!</SmolTitle>
          <div className="flex items-center gap-2 flex-col justify-center">
            <Link
              href={`https://testnet.monadexplorer.com/tx/${showMintingSuccess}`}
              target="_blank"
              className="flex items-center gap-2 flex-col justify-center"
            >
              <div>see the transaction:</div>
              <Button variant="ghost">
                <div>
                  <img src="/explorer.svg" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className="space-y-4">
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
          size="lg"
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
              <span className="pr-1.5">
                MINT NOW! → Get <NumberFlow value={mintAmount * 50} /> Credits
                for
              </span>
              <span className="font-bold tracking-tighter text-purple-200">
                {totalPrice} $USDC
              </span>
            </div>
          )}
        </Button>
      </div>
    </BlurryEntranceFaster>
  )
}

export default MintWithERC20
