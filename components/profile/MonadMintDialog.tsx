"use client"

import { useEffect } from "react"
import { useContractWrite } from "wagmi"
import { useContractRead } from "wagmi"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import MintWithStripe from "../wallet/MintWithStripe"
import { useAccount } from "wagmi"
import {
  NFT_CREDITS_CONTRACT_ADDRESS,
  NFT_CREDITS_CONTRACT_ABI,
  USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { parseUnits } from "viem"
import { useToast } from "@/hooks/use-toast"
import USDC_CONTRACT_ABI from "@/lib/abi/USDCABI.json"
import MintWithERC20 from "../wallet/MintWithERC20"

export default function MonadMintDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="pt-4">
              Mint NFTs with USDC on MONAD to get Lingolin Credits!
            </div>
          </DialogTitle>
        </DialogHeader>
        <MintWithERC20 />
      </DialogContent>
    </Dialog>
  )
}
