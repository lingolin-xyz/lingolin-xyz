"use client"

import monad from "@/public/monad.svg"
import { ImSpinner8 } from "react-icons/im"
import { useAccount } from "wagmi"
import BlurryEntrance from "../BlurryEntrance"
import { useUser } from "@privy-io/react-auth"
import { usePrivy } from "@privy-io/react-auth"
import { useBalance } from "wagmi"
import { useEffect, useState } from "react"
import BigTitle from "../BigTitle"
import SmolTitle from "../SmolTitle"
import NumberFlow from "@number-flow/react"
import { formatAddress } from "@/lib/strings"
import { Button } from "../ui/button"

export default function PrettyWallet() {
  const { linkWallet } = usePrivy()
  const { address, isConnected } = useAccount()
  const { user } = useUser()
  const { data: balanceData } = useBalance({
    address: address,
  })
  const [exactFormattedBalance, setExactFormattedBalance] = useState<number>(0)

  const [privyLinkedWallet, setPrivyLinkedWallet] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (balanceData) {
      setExactFormattedBalance(Number(Number(balanceData.formatted).toFixed(4)))
    }
  }, [balanceData])

  useEffect(() => {
    if (!user) return
    if (user.linkedAccounts) {
      user.linkedAccounts.forEach((account: any) => {
        if (account.chainType === "ethereum") {
          setPrivyLinkedWallet(account.address)
        }
      })
    }
  }, [user])

  const { ready } = usePrivy()
  if (!ready)
    return (
      <div className="p-24">
        <BlurryEntrance>
          <div className="w-10 h-10 bg-indigo-100 rounded-full animate-pulse flex items-center justify-center">
            <div className="animate-spin text-2xl">
              <ImSpinner8 />
            </div>
          </div>
        </BlurryEntrance>
      </div>
    )

  return (
    <div className="border-2 border-monad min-w-80 md:min-w-[420px] p-2 pb-0 px-3 mt-4 max-w-md rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: `url(/images/gradient3.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      {privyLinkedWallet && address ? (
        <div className="">
          <img src={monad.src} alt="monad" className="w-64 h-20 rounded-xl" />
          {/* <h3 className="text-lg font-medium mb-2">
            Wallet Explorer {formatAddress(address)}
          </h3> */}
          {/* <p className="text-sm text-gray-500">
            User ID: {user?.id || "Not available"}
          </p> */}
          <div className="text-2xl font-medium">{formatAddress(address)}</div>
          <div className="translate-y-4">
            <SmolTitle>Balance:</SmolTitle>
          </div>
          <BigTitle>
            <div className="tracking-tight text-black">
              <NumberFlow value={exactFormattedBalance} suffix="$MON" />
            </div>
          </BigTitle>
        </div>
      ) : (
        <>
          {address ? (
            <div className="p-12">
              <Button onClick={linkWallet}>Link your wallet</Button>
            </div>
          ) : (
            <Button onClick={linkWallet}>Link your wallet</Button>
          )}
        </>
      )}
    </div>
  )
}
