import { NextResponse } from 'next/server';

const ZRX_API_URL = 'https://api.0x.org/swap/permit2';

interface SwapQuoteParams {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
}

export async function getSwapQuote({ sellToken, buyToken, sellAmount }: SwapQuoteParams) {
    if (!sellToken || !buyToken || !sellAmount) {
        throw new Error('Missing required parameters');
    }

    try {
        const params = new URLSearchParams({
            chainId: '10143', // TODO: make this dynamic
            sellToken,
            buyToken,
            sellAmount,
            taker: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // TODO: make this dynamic
        });

        const headers = {
            '0x-api-key': process.env.ZEROX_API_KEY || '',
            '0x-version': 'v2',
        };

        const response = await fetch(`${ZRX_API_URL}/quote?${params.toString()}`, { headers });
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch quote');
    }
} 