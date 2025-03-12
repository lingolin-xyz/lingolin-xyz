import Title from "@/components/Title"
import { readCredits } from "@/lib/nillion/utils"
import { getEmailAddressFromUserId } from "@/lib/privy-utils"
import UserInDashboardMainList from "@/components/UserInDashboardMainList"

const UsersPage = async () => {
  const users = await readCredits()

  const usersWithEmails = []

  for (const user of users) {
    const email = await getEmailAddressFromUserId(user.userid)
    if (!email) {
      continue
    }
    usersWithEmails.push({ ...user, email })
  }
  return (
    <div>
      <div className="flex flex-col gap-3 max-w-2xl mx-auto px-4 py-12">
        <Title>Users</Title>
        <div className="flex flex-col gap-3">
          {usersWithEmails.map((user) => (
            <UserInDashboardMainList key={user.userid} user={user} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UsersPage
