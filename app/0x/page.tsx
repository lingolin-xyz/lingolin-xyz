'use client';

import { useState } from 'react';

interface QuoteResponse {
    buyAmount?: string;
    blockNumber?: string;
    buyToken?: string;
    fees?: {
        integratorFee?: string | null;
        zeroExFee?: {
            amount: string;
            token: string;
            type: string;
        };
        gasFee?: string | null;
    };
    issues?: {
        allowance?: {
            actual: string;
            spender: string;
        };
        balance?: string | null;
        simulationIncomplete: boolean;
        invalidSourcesPassed: any[];
    };
    liquidityAvailable?: boolean;
    minBuyAmount?: string;
    permit2?: {
        type: string;
        hash: string;
        eip712: {
            types: {
                TokenPermissions: { name: string; type: string }[];
                EIP712Domain: { name: string; type: string }[];
                PermitTransferFrom: { name: string; type: string }[];
            };
            domain: {
                name: string;
                chainId: number;
                verifyingContract: string;
            };
            message: {
                permitted: { token: string; amount: string };
                spender: string;
                nonce: string;
                deadline: string;
            };
            primaryType: string;
        };
    };
    route?: {
        fills: {
            from: string;
            to: string;
            source: string;
            proportionBps: string;
        }[];
        tokens: {
            address: string;
            symbol: string;
        }[];
    };
    sellAmount?: string;
    sellToken?: string;
    tokenMetadata?: {
        buyToken: { buyTaxBps: string; sellTaxBps: string };
        sellToken: { buyTaxBps: string; sellTaxBps: string };
    };
    totalNetworkFee?: string;
    transaction?: {
        to: string;
        data: string;
        gas: string;
        gasPrice: string;
        value: string;
    };
    zid?: string;
    [key: string]: any;
}

const tokens = {
    MON: { address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', ticker: 'MON', decimal: 18 },
    WMON: { address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701', ticker: 'WMON', decimal: 18 },
    USDC: { address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea', ticker: 'USDC', decimal: 6 },
    USDT: { address: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D', ticker: 'USDT', decimal: 6 },
};

export default function SwapPage() {
    const [sellAmount, setSellAmount] = useState('');
    const [sellToken, setSellToken] = useState(tokens.MON);
    const [buyToken, setBuyToken] = useState(tokens.USDC);
    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [buyAmount, setBuyAmount] = useState('');

    const getQuote = async () => {
        try {
            setLoading(true);
            setQuote(null);

            // Convert amount to base units (assuming 18 decimals for simplicity)
            const baseUnits = Math.floor(parseFloat(sellAmount) * Math.pow(10, sellToken.decimal)).toString();
            
            const sellTokenAddress = sellToken.address;
            const buyTokenAddress = buyToken.address;

            const response = await fetch(
                `/api/0x/swap?` +
                `sellToken=${sellTokenAddress}&` +
                `buyToken=${buyTokenAddress}&` +
                `sellAmount=${baseUnits}`
            );
            const data = await response.json();
            setQuote(data);

            // Set the buyAmount based on the quote received
            if (data.buyAmount) {
                setBuyAmount((Number(data.buyAmount) / Math.pow(10, buyToken.decimal)).toFixed(4));
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Swap your Token</h1>
            
            <div className="space-y-4">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Sell</label>
                        <input
                            type="number"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.0"
                            min="0"
                            step="0.000001"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">From Token</label>
                        <select
                            value={sellToken.ticker}
                            onChange={(e) => setSellToken(tokens[e.target.value as keyof typeof tokens])}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {Object.entries(tokens).map(([key, token]) => (
                                <option key={key} value={token.ticker}>{token.ticker}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Buy</label>
                        <input
                            type="number"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.0"
                            min="0"
                            step="0.000001"
                            disabled
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">To Token</label>
                        <select
                            value={buyToken.ticker}
                            onChange={(e) => setBuyToken(tokens[e.target.value as keyof typeof tokens])}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {Object.entries(tokens).map(([key, token]) => (
                                <option key={key} value={token.ticker}>{token.ticker}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={getQuote}
                    disabled={loading || !sellAmount}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </div>
        </div>
    );
} 