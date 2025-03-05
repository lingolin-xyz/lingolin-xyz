export const getEmailAddressFromPrivyUserObject = (user: any) => {
  let emailFound = null
  user.linkedAccounts.forEach((account: any) => {
    if (account.type === "email") {
      emailFound = account.address
    } else if (account.type === "google_oauth") {
      emailFound = account.email
    }
  })
  return emailFound
}
