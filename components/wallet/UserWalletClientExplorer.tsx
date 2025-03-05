"use client"

import { useUser } from "@privy-io/react-auth"
import React from "react"
import { useAccount } from "wagmi"

interface UserWalletClientExplorerProps {
  userId?: string
}

const UserWalletClientExplorer: React.FC<UserWalletClientExplorerProps> = ({
  userId,
}) => {
  const { address } = useAccount()
  const { user } = useUser()
  return (
    <div className="rounded-md border p-4 mt-4">
      <h3 className="text-lg font-medium mb-2">Wallet Explorer</h3>
      <p className="text-sm text-gray-500">
        User ID: {user?.id || "Not available"}
      </p>
      <p className="text-sm text-gray-500">
        Wallet Address: {address || "Not available"}
      </p>
    </div>
  )
}

export default UserWalletClientExplorer
