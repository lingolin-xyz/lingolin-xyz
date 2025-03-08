"use client"
import { IoSwapVertical } from "react-icons/io5"
import qs from "qs"

import { useState, useRef } from "react"
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
import { motion } from "framer-motion"

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
  const [amount, setAmount] = useState("")
  const [price, setThePrice] = useState<any>(null)
  const [isReversed, setIsReversed] = useState(false)
  const [estimatedOutput, setEstimatedOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const cancelTokenRef = useRef<CancelTokenSource | null>(null)

  const { data: hash, isPending, error, sendTransaction } = useSendTransaction()

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

  // Función para obtener cotización
  const fetchQuote = async (amount: string) => {
    console.log("amount???", amount)
    if (amount === "") {
      setAmount("0")
      setEstimatedOutput("0")
      return
    }
    console.log("ole")

    // ignore if the amount (string) is not a valid number :
    if (isNaN(Number(amount))) return

    setAmount(amount)
    if (!amount || !address) return

    if (Number(amount) <= 0) return
    try {
      setIsLoading(true)

      // Cancel any previous request
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled due to new request")
      }

      // Create a new cancel token
      cancelTokenRef.current = axios.CancelToken.source()

      const sellToken = isReversed
        ? (CONTRACTS.USDC as `0x${string}`)
        : (CONTRACTS.MON as `0x${string}`)
      const buyToken = isReversed
        ? (CONTRACTS.MON as `0x${string}`)
        : (CONTRACTS.USDC as `0x${string}`)
      const sellDecimals = isReversed
        ? Number(usdcDecimals || 6)
        : Number(monDecimals || 18)

      const sellAmount = parseUnits(amount, sellDecimals).toString()

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
    } catch (error) {
      // Don't show error if it was just a cancellation
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message)
      } else {
        console.error("Error al obtener cotización:", error)
      }
    } finally {
      setIsLoading(false)
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
      const sellAmount = parseUnits(amount, sellDecimals)

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
      }

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
  const handleReverse = () => {
    // Guardar los valores actuales antes de invertir
    const currentAmount = amount
    const currentOutput = estimatedOutput

    setIsReversed(!isReversed)

    // Intercambiar los valores
    if (currentOutput && Number(currentOutput) > 0) {
      setAmount(currentOutput)
      setEstimatedOutput(currentAmount)
    } else {
      setAmount("")
      setEstimatedOutput("")
    }
  }

  //   console.log("estimatedOutput", estimatedOutput)

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto p-6 bg-zinc-100 rounded-lg shadow-md">
        <div className="flex justify-center pb-6">
          <Title>Swap {isReversed ? "USDC → MON" : "MON → USDC"}</Title>
        </div>

        <div className="px-8">
          <div className="mb-4">
            <label className="block text-lg opacity-70 font-medium mb-1">
              {isReversed ? "USDC" : "MON"} to send
            </label>
            <div className="flex items-center">
              <input
                // increase the value if user pressed arrow down or up u know
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    if (isNaN(Number(amount))) return
                    const newAmount = Number(amount) + 1
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
                    const newAmount = Number(amount) - 1
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
              />
              <span className="ml-2 font-medium">
                {isReversed ? "USDC" : "MON"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Balance:{" "}
              <NumberFlow
                value={Number(
                  isReversed
                    ? usdcBalance?.formatted || "0"
                    : monBalance?.formatted || "0"
                )}
              />{" "}
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
              {isReversed
                ? monBalance?.formatted || "0"
                : usdcBalance?.formatted || "0"}{" "}
              {isReversed ? "MON" : "USDC"}
            </p>
          </div>

          <button
            onClick={handleSwap}
            disabled={!amount || Number(amount) <= 0 || isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Procesando..." : "Swap"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Swap
