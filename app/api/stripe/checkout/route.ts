// app/api/checkout/route.ts
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const { quantity, email, userId } = await request.json()

  if (!quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${quantity * 50} In-App Credits`,
          },
          unit_amount: 100, // $1 es 100 centavos
        },
        quantity: quantity,
      },
    ],
    // success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    customer_email: email,
    metadata: {
      email: email,
      userId: userId,
    },
  })

  return NextResponse.json({ url: session.url })
}
