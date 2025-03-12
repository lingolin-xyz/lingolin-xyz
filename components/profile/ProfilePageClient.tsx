"use client"

import { useAccount } from "wagmi"
import Title from "../Title"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import StripeDialog from "./StripeDialog"
import { usePrivy } from "@privy-io/react-auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import MonadMintDialog from "./MonadMintDialog"
import PrettyWallet from "./PrettyWallet"
import NFTsViewer from "./NFTsViewer"

type DialogType = "stripe" | "monad" | "linking" | "monadModal" | null

const ProfilePageClient = ({
  user,
  userObject,
}: {
  user: any
  userObject: any
}) => {
  const { address, isConnected, isConnecting } = useAccount()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)

  const { linkWallet } = usePrivy()

  const { toast } = useToast()
  useEffect(() => {
    if (activeDialog === "monad") {
      if (!isConnected) {
        setActiveDialog("linking")
        linkWallet()
      } else {
        setActiveDialog("monadModal")
      }
    }
  }, [activeDialog, isConnected, linkWallet])

  if (isConnecting) {
    return <div>Connecting...</div>
  }

  //   if (!isConnected) {
  //     return <div>Not connected</div>
  //   }

  return (
    <div className="py-6 flex flex-col gap-4 justify-center items-center">
      <StripeDialog
        open={activeDialog === "stripe"}
        onClose={() => setActiveDialog(null)}
      />
      <MonadMintDialog
        open={activeDialog === "monadModal"}
        onClose={() => setActiveDialog(null)}
      />
      <Title>You have {userObject.credits} credits</Title>
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" onClick={() => setActiveDialog("stripe")}>
          Buy using Stripe
        </Button>
        <Button size="lg" onClick={() => setActiveDialog("monad")}>
          Buy using your wallet on MONAD
        </Button>
        {isConnected && (
          <Link href="/swap">
            <Button size="lg">Swap $MON↔️$USDC</Button>
          </Link>
        )}
      </div>
      {address && <PrettyWallet />}
      <NFTsViewer />
      {/* <div>
        <pre>{JSON.stringify(userObject, null, 2)}</pre>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div> */}
    </div>
  )
}

export default ProfilePageClient
