"use client"
import { IoSwapVertical } from "react-icons/io5"
import qs from "qs"

const EXAGGERATION = 100000000000
import BallGame from "@/components/BallGame"

import { useState, useRef, useEffect } from "react"
import {
  useAccount,
  useBalance,
  useWriteContract,
  useReadContract,
  useSimulateContract,
  useSendTransaction,
  useSignTypedData,
} from "wagmi"
import { parseUnits, formatUnits, numberToHex, size, Hex, concat } from "viem"
import {
  AFFILIATE_FEE,
  FEE_RECIPIENT,
  TESTNET_CHAIN_ID,
  USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
} from "@/lib/constants"
import NumberFlow from "@number-flow/react"
import axios, { CancelTokenSource } from "axios"
import Title from "@/components/Title"
import { AnimatePresence, motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { formatNumber, getLabelFromAmount } from "@/lib/strings"
import { FaArrowRight, FaArrowRightArrowLeft } from "react-icons/fa6"
import MiniTitle from "@/components/MiniTitle"
import { useToast } from "@/hooks/use-toast"
import SuccessModal from "@/components/SuccessModal"

const CONTRACTS = {
  MON: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  USDC: USDC_MONAD_TESTNET_CONTRACT_ADDRESS,
}

// ABIs simplificados (deberás usar los correctos)
const erc20Abi = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
]

const Swap = () => {
  const [amount, setAmount] = useState("0")
  const [price, setThePrice] = useState<any>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [estimatedOutput, setEstimatedOutput] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource | null>(null)
  const currentRequestIdRef = useRef<number>(0)
  const [cube1Value, setCube1Value] = useState({
    value: 0,
    label: false as false | string,
  })
  const [cube2Value, setCube2Value] = useState({
    value: 0,
    label: false as false | string,
  })

  const { data: hash, isPending, error, sendTransaction } = useSendTransaction()

  const { toast } = useToast()
  useEffect(() => {
    if (error) {
      toast({
        title: "Error sending transaction :( ",
        description: "Please make sure you're on the Monad Testnet!!",
      })
      console.log(" ERROR TX??", error)
    }
  }, [error, toast])

  const { address } = useAccount()

  // Obtener decimales de los tokens
  const { data: monDecimals } = useReadContract({
    address: CONTRACTS.MON as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
  }) as { data: number | undefined }

  const { data: usdcDecimals } = useReadContract({
    address: CONTRACTS.USDC as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
  }) as { data: number | undefined }

  // Obtener balances
  const { data: monBalance } = useBalance({
    address,
  })

  const { data: usdcBalance } = useBalance({
    address,
    token: CONTRACTS.USDC as `0x${string}`,
  })

  const [successModal, setSuccessModal] = useState<false | string>(false)

  useEffect(() => {
    if (hash) {
      setSuccessModal(hash)
    }
  }, [hash, toast])

  useEffect(() => {
    setCube1Value({
      value: Number(
        Number(Number(amount) * EXAGGERATION)
          .toString()
          .charAt(0)
      ),
      label: getLabelFromAmount(Number(amount)),
    })
  }, [amount])

  useEffect(() => {
    setCube2Value({
      value: Number(
        (Number(estimatedOutput) * EXAGGERATION).toString().charAt(0)
      ),
      label: getLabelFromAmount(Number(estimatedOutput)),
    })
  }, [estimatedOutput])

  const fetchQuote = async (amount: string) => {
    if (amount === "") {
      setAmount("0")
      setEstimatedOutput("0")
      return
    }
    if (isNaN(Number(amount))) return

    setAmount(amount)
    if (!amount || !address) return

    if (Number(amount) <= 0) return

    // Define requestId outside the try block so it's accessible in finally
    const requestId = currentRequestIdRef.current + 1
    currentRequestIdRef.current = requestId

    try {
      setIsLoading(true)

      // Cancel any previous request
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled due to new request")
      }

      // Create a new cancel token
      cancelTokenRef.current = axios.CancelToken.source()
      const currentCancelToken = cancelTokenRef.current // Store reference to current token

      const sellToken = isReversed
        ? (CONTRACTS.USDC as `0x${string}`)
        : (CONTRACTS.MON as `0x${string}`)
      const buyToken = isReversed
        ? (CONTRACTS.MON as `0x${string}`)
        : (CONTRACTS.USDC as `0x${string}`)
      const sellDecimals = isReversed
        ? Number(usdcDecimals || 6)
        : Number(monDecimals || 18)

      const sellAmount = parseUnits(amount.toString(), sellDecimals).toString()

      const res = await axios.post(
        "/api/0x/get-price",
        {
          sellToken: sellToken.toString(),
          buyToken: buyToken.toString(),
          sellAmount: sellAmount.toString(),
          taker: address,
        },
        {
          cancelToken: cancelTokenRef.current.token,
        }
      )

      const data = res.data

      console.log("data::::", data.quote)
      if (data.quote.name === "INTERNAL_SERVER_ERROR") {
        toast({
          title: "Error fetching quote from the 0x API",
          description:
            "Please try again later.. we're so sorry! Other days this was working! SORRY!!",
          variant: "destructive",
        })
      } else {
        const { buyAmount } = data

        if (buyAmount) {
          const buyDecimals = isReversed
            ? Number(monDecimals || 18)
            : Number(usdcDecimals || 6)
          setEstimatedOutput(formatUnits(BigInt(buyAmount), buyDecimals))
          // console.log("buyAmount", buyAmount)
          // console.log("formatted", formatUnits(BigInt(buyAmount), buyDecimals))
          setThePrice(data.quote)
        }
      }
    } catch (error) {
      // Don't show error if it was just a cancellation
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message)
        return // Exit early without setting isLoading to false
      } else {
        console.error("Error al obtener cotización:", error)
      }
    } finally {
      // Now requestId is in scope
      if (currentRequestIdRef.current === requestId) {
        setIsLoading(false)
      }
    }
  }

  const { signTypedDataAsync } = useSignTypedData()

  // Ejecutar swap
  const handleSwap = async () => {
    if (!amount || !address) return

    try {
      setIsLoading(true)

      const sellDecimals = isReversed
        ? Number(usdcDecimals || 6)
        : Number(monDecimals || 18)
      const sellAmount = parseUnits(amount.toString(), sellDecimals)

      const sellTokenAddress = isReversed ? CONTRACTS.USDC : CONTRACTS.MON
      const buyTokenAddress = isReversed ? CONTRACTS.MON : CONTRACTS.USDC

      const params = {
        chainId: TESTNET_CHAIN_ID,
        sellToken: sellTokenAddress,
        buyToken: buyTokenAddress,
        sellAmount: sellAmount.toString(),
        taker: address,
        swapFeeRecipient: FEE_RECIPIENT,
        swapFeeBps: AFFILIATE_FEE,
        swapFeeToken: price.buyToken,
        tradeSurplusRecipient: FEE_RECIPIENT,
      }

      // Get quote from API
      const response = await fetch(`/api/0x/get-quote?${qs.stringify(params)}`)
      const quote = await response.json()

      console.log("quote", quote)
      console.log("submitting quote to blockchain")
      console.log("to", quote.transaction.to)
      console.log("value", quote.transaction.value)

      // On click, (1) Sign the Permit2 EIP-712 message returned from quote
      if (quote.permit2?.eip712) {
        console.log(" step 1")

        let signature: Hex | undefined
        try {
          signature = await signTypedDataAsync(quote.permit2.eip712)
          console.log("Signed permit2 message from quote response")
        } catch (error) {
          console.error("Error signing permit2 coupon:", error)
        }

        // (2) Append signature length and signature data to calldata

        if (signature && quote?.transaction?.data) {
          const signatureLengthInHex = numberToHex(size(signature), {
            signed: false,
            size: 32,
          })

          const transactionData = quote.transaction.data as Hex
          const sigLengthHex = signatureLengthInHex as Hex
          const sig = signature as Hex

          quote.transaction.data = concat([transactionData, sigLengthHex, sig])
        } else {
          throw new Error("Failed to obtain signature or transaction data")
        }
      } else {
        console.log(" step 2")
      }

      console.log(" sending transaction....", quote)

      //   (3) Submit the transaction with Permit2 signature

      sendTransaction({
        account: address,
        gas: quote?.transaction.gas ? BigInt(quote.transaction.gas) : undefined,
        to: quote.transaction.to as `0x${string}`,
        data: quote.transaction.data as `0x${string}`,
        value: quote.transaction.value
          ? BigInt(quote.transaction.value)
          : undefined,
        chainId: TESTNET_CHAIN_ID,
      })

      // ! ENDDD
    } catch (error) {
      console.error("Error al ejecutar swap:", error)
      //   alert("Error al ejecutar swap")
    } finally {
      setIsLoading(false)
    }
  }

  // Invertir dirección del swap
  const handleReverse = async () => {
    // Guardar los valores actuales antes de invertir
    const currentAmount = amount
    const currentOutput = estimatedOutput

    // empty the cubes first:
    setCube1Value({
      value: 0,
      label: false as false | string,
    })
    setCube2Value({
      value: 0,
      label: false as false | string,
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    setIsReversed(!isReversed)

    // Intercambiar los valores
    if (currentOutput && Number(currentOutput) > 0) {
      setAmount(currentOutput)
      setEstimatedOutput(amount.toString())
    } else {
      setAmount("0")
      setEstimatedOutput("0")
    }
  }

  //   console.log("estimatedOutput", estimatedOutput)

  return (
    <div className="py-12 w-full flex justify-center items-center gap-6">
      <SuccessModal
        successModal={successModal}
        setSuccessModal={setSuccessModal}
      />
      <div className="flex-1 flex justify-center items-center">
        <BallGame
          scaleFactor={isReversed ? 4.2 : 3.5}
          value={cube1Value.value}
          label={cube1Value.label}
          image={
            isReversed
              ? "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg"
              : "https://cdn.prod.website-files.com/667c57e6f9254a4b6d914440/667d7104644c621965495f6e_LogoMark.svg"
          }
        />
        {/* <BallGame value={3} /> */}
        {/* CUBO 1: {cube1Value.value} label:{cube1Value.label} */}
      </div>
      <div className="max-w-md w-full mx-auto p-6 bg-zinc-100 rounded-lg shadow-md">
        <div className="flex justify-center pb-6">
          <MiniTitle>
            <div className="flex items-center gap-2">
              <span className="">Swap</span>{" "}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={isReversed ? "usdc-left" : "mon-left"}
                  id="left-side"
                  className="w-20 text-center"
                  initial={{
                    opacity: 0,
                    y: 20,
                    rotate: -5,
                  }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -20, rotate: -20, scale: 0.6 }}
                  layout
                  layoutId={isReversed ? "usdc-left" : "mon-left"}
                >
                  {isReversed ? (
                    <div className="flex items-center justify-center">
                      <img
                        src="https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg"
                        className="w-4 h-4"
                      />
                      <span>USDC</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <img
                        src="https://cdn.prod.website-files.com/667c57e6f9254a4b6d914440/667d7104644c621965495f6e_LogoMark.svg"
                        className="w-4 h-4"
                      />
                      <span>MON</span>
                    </div>
                  )}
                </motion.div>
                <FaArrowRight className="text-lg" />
                <motion.div
                  key={isReversed ? "mon-right" : "usdc-right"}
                  id="right-side"
                  className="w-20 text-center"
                  initial={{
                    opacity: 0,
                    y: 20,
                    rotate: -5,
                  }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -20, rotate: -20, scale: 0.6 }}
                  //   transition={{ duration: 0.3 }}
                  layout
                  layoutId={isReversed ? "mon-right" : "usdc-right"}
                >
                  {!isReversed ? (
                    <div className="flex items-center justify-center">
                      <img
                        src="https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg"
                        className="w-4 h-4"
                      />
                      <span>USDC</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <img
                        src="https://cdn.prod.website-files.com/667c57e6f9254a4b6d914440/667d7104644c621965495f6e_LogoMark.svg"
                        className="w-4 h-4"
                      />
                      <span>MON</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </MiniTitle>
        </div>

        <div className="px-8">
          <div className="mb-4">
            <label className="block text-lg opacity-70 font-medium mb-1">
              <DollarSign />
              {isReversed ? "USDC" : "MON"} to send
            </label>
            <div className="flex items-center">
              <Input
                max={Number(
                  isReversed
                    ? usdcBalance?.formatted || "0"
                    : monBalance?.formatted || "0"
                )}
                type="number"
                min={0}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  fetchQuote(e.target.value)
                }}
                className="bg-white !text-2xl !h-10 !pb-0 font-semibold"
              />

              {/* <input
                // increase the value if user pressed arrow down or up u know
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    if (isNaN(Number(amount))) return
                    const newAmount = Number(
                      (Number(amount) + 1).toFixed(6)
                    ).toString()
                    setAmount(newAmount.toString())
                    // put the cursor at the end of the input
                    setTimeout(() => {
                      const input = e.target as HTMLInputElement
                      input.setSelectionRange(amount.length, amount.length)
                    }, 6)
                    fetchQuote(newAmount.toString())
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === "ArrowDown") {
                    if (isNaN(Number(amount))) return
                    const newAmount = Number(
                      (Number(amount) - 1).toFixed(6)
                    ).toString()
                    setAmount(newAmount.toString())
                    // put the cursor at the end of the input
                    setTimeout(() => {
                      const input = e.target as HTMLInputElement
                      input.setSelectionRange(amount.length, amount.length)
                    }, 6)
                    fetchQuote(newAmount.toString())
                  }
                }}
                type="text"
                value={amount}
                onChange={(e) => {
                  // Reemplazar comas por puntos y validar que sea un número válido
                  const value = e.target.value.replace(",", ".")
                  if (value === "") {
                    setAmount("0")
                    setEstimatedOutput("0")
                    return
                  }
                  if (
                    !isNaN(parseFloat(value)) ||
                    value === "" ||
                    value === "."
                  ) {
                    if (isNaN(Number(value))) return
                    setAmount(value)
                    if (value && value !== ".") fetchQuote(value)
                  }
                }}
                placeholder="0.0"
                className="w-full text-xl p-3 pb-2 border rounded-lg"
              /> */}
              <span className="ml-2 font-medium">
                <DollarSign />
                {isReversed ? "USDC" : "MON"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Balance:{" "}
              <NumberFlow
                value={Number(
                  isReversed
                    ? usdcBalance?.formatted || "0"
                    : monBalance?.formatted || "0"
                )}
              />{" "}
              <DollarSign />
              {isReversed ? "USDC" : "MON"}
            </p>
          </div>

          <div className="flex justify-center my-4">
            <motion.button
              onClick={handleReverse}
              className="p-2 rounded-full bg-indigo-200 text-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isReversed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoSwapVertical />
            </motion.button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              {isReversed ? "MON" : "USDC"} to receive (estimated)
            </label>
            <div className="rounded-lg font-semibold tracking-tighter tabular-nums text-4xl">
              <NumberFlow
                value={Number(Number(estimatedOutput).toFixed(6) || "0")}
              />{" "}
              {isReversed ? "MON" : "USDC"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Balance:{" "}
              <NumberFlow
                value={Number(
                  isReversed
                    ? monBalance?.formatted || "0"
                    : usdcBalance?.formatted || "0"
                )}
              />{" "}
              <DollarSign />
              {isReversed ? "MON" : "USDC"}
            </p>
          </div>

          <button
            onClick={handleSwap}
            disabled={!amount || Number(amount) <= 0 || isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-0.5">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              "Swap"
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <BallGame
          value={cube2Value.value}
          label={cube2Value.label}
          scaleFactor={!isReversed ? 4.2 : 3.5}
          image={
            isReversed
              ? "https://cdn.prod.website-files.com/667c57e6f9254a4b6d914440/667d7104644c621965495f6e_LogoMark.svg"
              : "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg"
          }
        />
      </div>
    </div>
  )
}

export default Swap

const DollarSign = () => {
  return <span className="font-mono text-[10px]">$</span>
}
