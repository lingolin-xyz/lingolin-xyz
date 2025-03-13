// Next.js provides searchParams prop for server components
const SuccessPage = ({
  searchParams,
}: {
  searchParams: { session_id: string }
}) => {
  const sessionId = searchParams.session_id

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Session ID: {sessionId}</p>
    </div>
  )
}

export default SuccessPage
