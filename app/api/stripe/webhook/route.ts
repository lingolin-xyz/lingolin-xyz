import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"
import { postToDiscord } from "@/lib/discord"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")!

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
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const quantity = session.line_items?.data[0]?.quantity ?? 1

      // ACTUALIZA AQUÍ TU DB (Firebase, Supabase, Prisma, lo que uses)
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

// Función ejemplo para actualizar créditos
async function updateUserCredits(userId: string, credits: number) {
  await postToDiscord(
    `🔔 Compra completada para usuario ${userId}: ${credits} créditos`
  )
  // Ejemplo rápido con Firestore:
  // import { db } from '@/lib/firebase';
  // await db.collection('users').doc(userId).update({ credits: FieldValue.increment(credits) });

  // O si usas Prisma:
  // await prisma.user.update({
  //   where: { id: userId },
  //   data: { credits: { increment: credits } },
  // });

  console.log(
    `DB actualizada: Usuario ${userId} ha recibido ${credits} créditos.`
  )
}
