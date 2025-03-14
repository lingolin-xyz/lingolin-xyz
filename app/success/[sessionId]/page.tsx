import BigTitle from "@/components/BigTitle"
import BlurryEntrance from "@/components/BlurryEntrance"
import RedirectAfterThree from "@/components/RedirectAfterThree"
import Title from "@/components/Title"
import { stripe } from "@/lib/stripe"

// Next.js provides searchParams prop for server components
const SuccessPage = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) => {
  const { sessionId } = await params
  // console.log("sessionId::::", sessionId)
  // return <div>Success {sessionId}</div>
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  })

  const quantity = session.line_items?.data[0]?.quantity ?? 0
  const credits = quantity * 50 // Same calculation as in webhook

  return (
    <BlurryEntrance>
      <RedirectAfterThree />
      <div className="p-4 rounded-xl max-w-3xl mx-auto my-20 flex flex-col gap-2 items-center justify-center">
        <BigTitle>Thank you for your purchase!</BigTitle>
        <img
          src="/images/thanku.png"
          className="max-w-lg mx-auto py-6"
          draggable="false"
        />
        <Title>You purchased {quantity} items</Title>
        <Title>
          <div className="text-yellow-600">and received {credits} credits!</div>
        </Title>
      </div>
    </BlurryEntrance>
  )
}

export default SuccessPage
