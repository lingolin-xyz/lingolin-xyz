"use client"

import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth"
import { PRIVY_APP_ID } from "@/lib/constants"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "@privy-io/wagmi"
import { createConfig } from "@privy-io/wagmi"
import { monadTestnet } from "viem/chains"
import { http } from "wagmi"

const queryClient = new QueryClient()

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
})

const privyConfig = {
  appearance: {
    theme: "dark",
    accentColor: "#676FFF",
    logo: "https://javitoshi.com/images/lingolin.png",
  },
  walletChainType: "ethereum-only",
  loginMethods: ["email", "google"],
  embeddedWallets: {
    createOnLogin: "off",
  },
} as PrivyClientConfig

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
