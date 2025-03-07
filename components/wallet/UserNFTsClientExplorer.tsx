"use client"

import { useAccount, useContractRead } from "wagmi"
import { NFT_CREDITS_CONTRACT_ADDRESS, TESTNET_CHAIN_ID, USDC_TOKEN_CONTRACT_ABI, USDC_MONAD_TESTNET_CONTRACT_ADDRESS } from "@/lib/constants"
import { useState, useEffect } from "react"
import { NFT_CREDITS_CONTRACT_ABI } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import NumberFlow from "@number-flow/react"
import SmolTitle from "../SmolTitle"
import Title from "../Title"
import axios from "axios"
import Image from "next/image"
import BlurryEntrance from "../BlurryEntrance"
import NFTInProfilePage from "./NFTInProfilePage"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { encodeFunctionData, createPublicClient, http } from 'viem'
import { monadTestnet } from 'viem/chains'

const UserNFTsClientExplorer = () => {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { address, isConnected } = useAccount()
  const [nftCount, setNftCount] = useState<number | null>(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [tokenIds, setTokenIds] = useState<number[]>([])
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: number]: any }>({})
  const { toast } = useToast()

  const { data, isError, isLoading } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
  })

  const { data: tokenOfOwnerByIndexData } = useContractRead({
    address: NFT_CREDITS_CONTRACT_ADDRESS,
    abi: NFT_CREDITS_CONTRACT_ABI,
    functionName: "tokensOfOwner",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
  })

  const { data: usdcBalance } = useContractRead({
    address: USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
    abi: USDC_TOKEN_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: TESTNET_CHAIN_ID,
  })

  const handleIncrement = () => {
    setMintAmount((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (mintAmount > 1) {
      setMintAmount((prev) => prev - 1)
    }
  }

  const handlePrivyMint = async () => {
    if (!user || !wallets.length) return false;

    const wallet = wallets[0]; // Use the first wallet (embedded wallet)

    // Check if the wallet is connected to the correct network
    const currentChainId = wallet.chainId; // Get the current chain ID from the wallet
    console.log({currentChainId});
    if (currentChainId !== `eip155:${monadTestnet.id}`) {
      try {
        // Switch to the Monad Testnet using Privy's wallet method
        await wallet.switchChain(monadTestnet.id);

        toast({
          title: "Switched Network",
          description: "You are now connected to the Monad Testnet.",
        });
      } catch (error) {
        toast({
          title: "Network Switch Failed",
          description: "Could not switch to Monad Testnet. Please switch manually.",
          variant: "destructive",
        });
        return;
      }
    }

    // Calculate required USDC amount (0.01 USDC per NFT)
    const requiredAmount = mintAmount * 0.01;
    const userBalance = Number(usdcBalance) / 10 ** 6; // Convert from wei to USDC

    if (userBalance < requiredAmount) {
      toast({
        title: "Insufficient USDC Balance",
        description: `You need ${requiredAmount} USDC but only have ${userBalance.toFixed(2)} USDC`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the Ethereum provider from the wallet
      const provider = await wallet.getEthereumProvider();

      // First, send USDC approve transaction
      const approveData = encodeFunctionData({
        abi: USDC_TOKEN_CONTRACT_ABI,
        functionName: 'approve',
        args: [NFT_CREDITS_CONTRACT_ADDRESS, BigInt(requiredAmount * 10 ** 6)],
      });

      const approveTx = {
        to: USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
        data: approveData,
        gasLimit: '0xD6D8', // 55,000 gas limit for approve
      };

      // Send approval transaction using the provider
      const approveHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [approveTx],
      });

      toast({
        title: "Approving USDC",
        description: "Please wait while the approval transaction is being processed...",
      });

      // Wait for approval transaction to be mined
      const client = createPublicClient({
        chain: monadTestnet,
        transport: http(process.env.NEXT_PUBLIC_MONAD_RPC_URL),
      });

      const approveReceipt = await client.waitForTransactionReceipt({ hash: approveHash });

      if (approveReceipt.status !== 'success') {
        throw new Error("USDC approval failed");
      }

      toast({
        title: "USDC Approved",
        description: "USDC spending approved successfully",
      });

      // Now prepare and send the mint transaction
      const mintData = encodeFunctionData({
        abi: NFT_CREDITS_CONTRACT_ABI,
        functionName: 'mintNFTWithToken',
        args: [address, mintAmount],
      });

      const mintTx = {
        to: NFT_CREDITS_CONTRACT_ADDRESS,
        data: mintData,
        gasLimit: '0x186A0', // 100,000 gas limit for minting
      };

      // Send mint transaction using the provider
      const mintHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [mintTx],
      });

      toast({
        title: "Minting NFTs",
        description: "Please wait while your NFTs are being minted...",
      });

      // Wait for mint transaction to be mined
      const mintReceipt = await client.waitForTransactionReceipt({ hash: mintHash });

      if (mintReceipt.status !== 'success') {
        throw new Error("NFT minting failed");
      }

      // After successful on-chain mint, update credits on server
      const res = await axios.post("/api/client-mint", {
        amount: mintAmount,
        userId: user.id,
        txHash: mintHash,
      });

      if (res.data.success) {
        toast({
          title: "Success",
          description: `Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}!`,
        });
      } else {
        throw new Error("Failed to update credits");
      }
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Error",
        description: typeof error === 'string' ? error : "Failed to mint NFTs. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleMint = async () => {
    if (!user) return false
    toast({
      title: "Minting...",
      description: "Minting NFTs...",
    })

    const res = await axios.post("/api/server-mint", {
      address,
      amount: mintAmount,
      userId: user.id,
    })

    if (res.status === 200) {
      toast({
        title: "Minting successful",
        description: "NFTs minted successfully",
      })
    } else {
      toast({
        title: "Minting failed",
        description: "NFTs minting failed",
      })
    }
  }

  useEffect(() => {
    if (data) {
      setNftCount(Number(data))
    }
  }, [data])

  useEffect(() => {
    if (tokenOfOwnerByIndexData) {
      const ids = Array.isArray(tokenOfOwnerByIndexData)
        ? tokenOfOwnerByIndexData.map((id) => Number(id))
        : []
      setTokenIds(ids)
    }
  }, [tokenOfOwnerByIndexData])

  if (isLoading) return <div>Loading NFT balance...</div>
  if (isError) return <div>Error fetching NFT balance</div>
  if (!isConnected) return <div>Connect your wallet to view NFTs</div>

  return (
    <div>
      <h2>Your NFT Balance</h2>
      <p>You own {nftCount ?? 0} NFTs from this collection</p>

      <div>
        {/* <pre>{JSON.stringify(tokenOfOwnerByIndexData, null, 2)}</pre> */}
      </div>
      {tokenIds.length > 0 && (
        <div className="mt-4">
          <SmolTitle>Your Token IDs</SmolTitle>
          <div className="mt-2 flex flex-wrap gap-4">
            {tokenIds.map((id) => (
              <NFTInProfilePage key={id} tokenId={id} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Mint New NFTs</h3>
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
            <div className="min-w-16 text-center">
              <NumberFlow value={mintAmount} />
            </div>
          </Title>

          <Button variant="outline" size="icon" onClick={handleIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handlePrivyMint} className="w-full">
          MINT NOW!
        </Button>
      </div>
    </div>
  )
}

export default UserNFTsClientExplorer
