import { Plus } from "lucide-react"
import { Minus } from "lucide-react"
import { Button } from "../ui/button"
import NumberFlow from "@number-flow/react"
import { useState } from "react"

import { useAccount } from "wagmi"
import Title from "../Title"
import { useToast } from "@/hooks/use-toast"

import USDC_CONTRACT_ABI from "@/lib/abi/USDCABI.json"
import { usePrivy } from "@privy-io/react-auth"
import { getEmailAddressFromPrivyUserObject } from "@/lib/privy-utils-client"

const MintWithStripe = () => {
  const { address } = useAccount()
  const [mintAmount, setMintAmount] = useState(1)
  const [isPending, setIsPending] = useState(false)

  const handleDecrement = () => {
    setMintAmount(mintAmount - 1)
  }

  const handleIncrement = () => {
    setMintAmount(mintAmount + 1)
  }

  const { toast } = useToast()
  const { user } = usePrivy()
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to continue",
      })
      return
    }
    toast({
      title: "Processing...",
      description: "Processing your payment..." + address,
    })
    try {
      setIsPending(true)
      const userEmail = getEmailAddressFromPrivyUserObject(user)

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: mintAmount, email: userEmail }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Checkout failed:", err)
    } finally {
      setIsPending(false)
    }
  }

  const PRICE_PER_MINT = 0.0002
  const totalPrice = Number(PRICE_PER_MINT * mintAmount).toFixed(5)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Buy Credits with your Credit Card</h3>

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

      <Button onClick={handleCheckout} className="w-full" disabled={isPending}>
        {isPending ? (
          "Processing..."
        ) : (
          <div className="flex items-center space-x-0">
            <span>Pay with Stripe (</span>
            <span className="tabular-nums font-bold tracking-tighter">
              $<NumberFlow value={mintAmount * 1} /> USD
              {/* ${mintAmount * 1} USD */}
            </span>
            <span>)</span>
          </div>
        )}
      </Button>
    </div>
  )
}

export default MintWithStripe
