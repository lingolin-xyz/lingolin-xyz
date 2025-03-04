import Title from "@/components/Title"
import { PRIVY_APP_ID } from "@/lib/constants"
import { readCredits } from "@/lib/nillion/utils"
import { getEmailAddressFromUserId } from "@/lib/privy-utils"

const UsersPage = async () => {
  const users = await readCredits()
  const usersWithEmails = []

  for (const user of users) {
    const email = await getEmailAddressFromUserId(user.userid)
    usersWithEmails.push({ ...user, email })
  }
  return (
    <div>
      <div>
        <Title>Users</Title>
        <div>
          <pre>{JSON.stringify(usersWithEmails, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default UsersPage
