"use client"

import { useLinkAccount, usePrivy, useSignMessage } from "@privy-io/react-auth"
import { useUser, useCreateWallet } from "@privy-io/react-auth"
import React, { useEffect, useState } from "react"
import { useAccount, useBalance } from "wagmi"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"

import monad from "@/public/monad.svg"
import { formatAddress } from "@/lib/strings"
import BlurryEntrance from "../BlurryEntrance"
import { ImSpinner8 } from "react-icons/im"
import Title from "../Title"
import SmolTitle from "../SmolTitle"
import NumberFlow from "@number-flow/react"
import BigTitle from "../BigTitle"
import { FiCopy } from "react-icons/fi"

interface UserWalletClientExplorerProps {
  userId?: string
}

const UserWalletClientExplorer: React.FC<UserWalletClientExplorerProps> = ({
  userId,
}) => {
  const { linkWallet } = usePrivy()
  const { createWallet } = useCreateWallet()
  const { address, isConnected } = useAccount()
  const { user } = useUser()
  const { data: balanceData } = useBalance({
    address: address,
  })
  const [exactFormattedBalance, setExactFormattedBalance] = useState<number>(0)

  const [privyLinkedWallet, setPrivyLinkedWallet] = useState<string | null>(
    null
  )

  const { toast } = useToast()

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
  //   const { linkWallet } = useLinkAccount({
  //     onSuccess: ({ user, linkMethod, linkedAccount }) => {
  //       console.log(user, linkMethod, linkedAccount)
  //       // Any logic you'd like to execute if the user successfully links an account while this
  //       // component is mounted
  //     },
  //     onError: (error, details) => {
  //       console.log(error, details)
  //       // Any logic you'd like to execute after a user exits the link flow or there is an error
  //     },
  //   })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Success",
        description: "Wallet address copied to clipboard!",
      });
    }).catch(err => {
      toast({
        title: "Error",
        description: "Failed to copy wallet address.",
        variant: "destructive",
      });
    });
  };

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

  if (!isConnected)
    return (
      <div className="flex flex-col gap-y-4 p-24">
        <Button onClick={linkWallet}>Link your wallet</Button>
        <p className="text-md text-gray-700 text-center">or</p>
        <Button onClick={createWallet}>Create a new wallet</Button>
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
          <div className="flex text-2xl font-medium">
            {formatAddress(address)}
            <button 
              onClick={() => copyToClipboard(address)} 
              className="ml-2 text-blue-500 underline flex items-center"
            >
              <FiCopy className="h-5 w-5 text-black hover:text-gray-700" />
            </button>
          </div>
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

export default UserWalletClientExplorer
