import { NextResponse } from 'next/server';
import { getSwapQuote } from '@/lib/0x/swap';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sellToken = searchParams.get('sellToken');
    const buyToken = searchParams.get('buyToken');
    const sellAmount = searchParams.get('sellAmount');

    if (!sellToken || !buyToken || !sellAmount) {
        return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );
    }

    try {
        const data = await getSwapQuote({ sellToken, buyToken, sellAmount });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch quote' },
            { status: 500 }
        );
    }
} 