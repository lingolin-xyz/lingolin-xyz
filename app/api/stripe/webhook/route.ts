import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"
import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { getUserAndCredits } from "@/lib/cachedLayer"
import { updateCreditsValueById } from "@/lib/nillion/utils"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")!

  await postToDiscord(`🔔 Stripe webhook received`)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = (await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        }
      )) as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const quantity = session.line_items?.data[0]?.quantity ?? 1

      console.log("session.line_items 👀 👀 👀 👀 👀 👀 👀 ")
      console.log(session.line_items, quantity)

      console.log(
        `🔔 Compra completada para usuario ${userId}: ${quantity * 50} créditos`
      )

      await updateUserCredits(userId!, quantity * 50)

      break

    default:
      console.log(`Evento ${event.type} no manejado.`)
  }

  return NextResponse.json({ received: true })
}

async function updateUserCredits(userId: string, credits: number) {
  console.log(
    `DB actualizada: Usuario ${userId} ha recibido ${credits} créditos.`
  )

  const userWithCredits = await getUserAndCredits(userId)
  if (!userWithCredits) {
    await postErrorToDiscord("User not found!!")
    return NextResponse.json({
      finished: false,
      error: "User not found",
    })
  }

  // update credits
  await updateCreditsValueById(
    userWithCredits._id,
    userWithCredits.credits + credits
  )

  await postToDiscord(`🔔 Usuario ${userId} ha comprado ${credits} créditos.`)
}
