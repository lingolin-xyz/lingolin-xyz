const UserInDashboardMainList = ({ user }: { user: any }) => {
  return (
    <div className="flex items-center justify-between bg-zinc-100 p-3 px-6 rounded-lg">
      <div>{user.email}</div>
      <div>{user.credits}</div>
    </div>
  )
}

export default UserInDashboardMainList
