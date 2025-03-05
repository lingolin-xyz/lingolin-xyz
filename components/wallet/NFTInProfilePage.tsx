"use client"

import { useEffect, useRef, useState } from "react"
import BlurryEntrance from "../BlurryEntrance"
import { ImSpinner8 } from "react-icons/im"
import { ethers } from "ethers"
import { BrowserProvider, Contract } from "ethers"
import { NFT_CREDITS_CONTRACT_ADDRESS } from "@/lib/constants"

const NFTInProfilePage = ({ tokenId }: { tokenId: number }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [metadata, setMetadata] = useState<any>(null)

  const loadedRef = useRef(false)
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const fetchMetadata = async () => {
      try {
        // Get contract instance
        const provider = new BrowserProvider(window.ethereum)
        const nftContract = new Contract(
          NFT_CREDITS_CONTRACT_ADDRESS,
          ["function tokenURI(uint256 tokenId) view returns (string)"],
          provider
        )

        // Fetch tokenURI
        const uri = await nftContract.tokenURI(tokenId)

        // Fetch metadata from the URI
        const response = await fetch(uri)
        const data = await response.json()

        setMetadata(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching NFT metadata:", error)
        setIsLoading(false)
      }
    }
    fetchMetadata()
  }, [tokenId])

  return (
    <div className="p-3 bg-secondary rounded-md text-sm flex flex-col items-center justify-center min-w-60 aspect-square">
      {isLoading ? (
        <BlurryEntrance>
          <div className="w-10 h-10 bg-indigo-100 rounded-full animate-pulse flex items-center justify-center">
            <div className="animate-spin text-2xl">
              <ImSpinner8 />
            </div>
          </div>
        </BlurryEntrance>
      ) : metadata ? (
        <div className="flex flex-col items-center">
          {metadata.image && (
            <img
              src={metadata.image}
              alt={metadata.name || `NFT #${tokenId}`}
              className="h-auto rounded-md mb-2 w-52"
            />
          )}
          <h3 className="font-bold">{metadata.name || `NFT #${tokenId}`}</h3>
          {metadata.description && (
            <p className="text-xs mt-1 text-center">{metadata.description}</p>
          )}
        </div>
      ) : (
        <div>Failed to load NFT</div>
      )}
    </div>
  )
}

export default NFTInProfilePage
