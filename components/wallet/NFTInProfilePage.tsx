"use client"

import { useEffect, useRef, useState } from "react"
import BlurryEntrance from "../BlurryEntrance"
import { ImSpinner8 } from "react-icons/im"
import { ethers } from "ethers"
import { BrowserProvider, Contract } from "ethers"
import { NFT_CREDITS_CONTRACT_ADDRESS } from "@/lib/constants"
import { Tilt } from "../Tilt"
import Link from "next/link"

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
        console.log(" OK gonna call for tokenId:", tokenId)

        try {
          const uri = await nftContract.tokenURI(tokenId)

          // Fetch metadata from the URI
          const response = await fetch(uri)
          const data = await response.json()

          setMetadata(data)
        } catch (error) {
          // console.error("Error fetching NFT metadata:", error)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching NFT metadata:", error)
        setIsLoading(false)
      }
    }
    fetchMetadata()
  }, [tokenId])

  return (
    <div className="p-3 bg-secondary group rounded-md text-sm hover:scale-105 transition-all duration-300 active:opacity-60 flex flex-col items-center justify-center min-w-60 aspect-square">
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
            <Link
              href={`https://magiceden.io/item-details/monad-testnet/${NFT_CREDITS_CONTRACT_ADDRESS}/${tokenId}`}
              target="_blank"
              className="active:scale-90 transition-all duration-100 active:opacity-60"
            >
              <Tilt>
                <img
                  src={metadata.image}
                  alt={metadata.name || `NFT #${tokenId}`}
                  className="h-auto rounded-md mb-2 w-52"
                />
              </Tilt>
            </Link>
          )}
          <h3 className="font-bold opacity-40 group-hover:opacity-100 transition-all duration-300">
            {metadata.name || `NFT #${tokenId}`}
          </h3>
          {metadata.description && (
            <p className="text-xs mt-1 text-center opacity-40 group-hover:opacity-100 transition-all duration-300">
              {metadata.description}
            </p>
          )}
        </div>
      ) : (
        <div>Failed to load NFT</div>
      )}
    </div>
  )
}

export default NFTInProfilePage
