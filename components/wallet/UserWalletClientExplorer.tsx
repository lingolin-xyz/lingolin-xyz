"use client"

import { useLinkAccount, usePrivy, useSignMessage } from "@privy-io/react-auth"
import { useUser } from "@privy-io/react-auth"
import React from "react"
import { useAccount } from "wagmi"
import { Button } from "../ui/button"

import monad from "@/public/monad.svg"
import { formatAddress } from "@/lib/strings"
import BlurryEntrance from "../BlurryEntrance"
import { ImSpinner8 } from "react-icons/im"

interface UserWalletClientExplorerProps {
  userId?: string
}

const UserWalletClientExplorer: React.FC<UserWalletClientExplorerProps> = ({
  userId,
}) => {
  const { linkWallet } = usePrivy()
  const { address, isConnected } = useAccount()
  const { user } = useUser()

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

  if (!isConnected) return <div>Not connected</div>

  return (
    <div className="border-2 border-purple-300 p-4 mt-4 max-w-md rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full opacity-70"
          style={{
            backgroundImage: `url(/images/gradient1.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      {address ? (
        <div className="hello">
          <img
            src={monad.src}
            alt="monad"
            className="w-60 h-16 rounded-xl hello"
          />
          <h3 className="text-lg font-medium mb-2">
            Wallet Explorer {formatAddress(address)}
          </h3>
          <p className="text-sm text-gray-500">
            User ID: {user?.id || "Not available"}
          </p>
          <p className="text-sm text-gray-500">
            Wallet Address: {address || "Not available"}
          </p>
        </div>
      ) : (
        <Button onClick={linkWallet}>Link your wallet</Button>
      )}
    </div>
  )
}

export default UserWalletClientExplorer
