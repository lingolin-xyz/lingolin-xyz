"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import MintWithStripe from "../wallet/MintWithStripe"

export default function StripeDialog({
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
          <DialogTitle>Buy credits using Your Credit Card</DialogTitle>
        </DialogHeader>
        <MintWithStripe />
      </DialogContent>
    </Dialog>
  )
}
