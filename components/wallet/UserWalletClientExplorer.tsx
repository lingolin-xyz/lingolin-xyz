"use client"

import { useLinkAccount, usePrivy, useSignMessage } from "@privy-io/react-auth"
import { useUser } from "@privy-io/react-auth"
import React from "react"
import { useAccount } from "wagmi"
import { Button } from "../ui/button"

interface UserWalletClientExplorerProps {
  userId?: string
}

const UserWalletClientExplorer: React.FC<UserWalletClientExplorerProps> = ({
  userId,
}) => {
  const { linkWallet } = usePrivy()
  const { address } = useAccount()
  const { user } = useUser()

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

  return (
    <div className="rounded-md border p-4 mt-4">
      <h3 className="text-lg font-medium mb-2">Wallet Explorer</h3>
      <p className="text-sm text-gray-500">
        User ID: {user?.id || "Not available"}
      </p>
      {/* {!address ? ( */}
      <Button onClick={linkWallet}>Link your wallet</Button>
      {/* ) : ( */}
      <p className="text-sm text-gray-500">
        Wallet Address: {address || "Not available"}
      </p>
      {/* )} */}
    </div>
  )
}

export default UserWalletClientExplorer
