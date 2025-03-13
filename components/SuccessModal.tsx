"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import Link from "next/link"
import MiniTitle from "./MiniTitle"
import SmolTitle from "./SmolTitle"
import Title from "./Title"
import BlurryEntrance from "./BlurryEntrance"

const SuccessModal = ({
  successModal,
  setSuccessModal,
}: {
  successModal: string | false
  setSuccessModal: (successModal: string | false) => void
}) => {
  return (
    <AlertDialog
      open={successModal !== false}
      onOpenChange={() => setSuccessModal(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="text-center text-balance">
              <Title>Your swap with 0x worked great!!!</Title>
            </div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <BlurryEntrance>
          <div className="flex flex-col gap-2 mt-6 items-center justify-center py-6 bg-gradient-to-br from-purple-50 to-purple-200 border border-purple-400 rounded-xl max-w-sm w-full mx-auto">
            <SmolTitle>See the transaction</SmolTitle>

            <Link
              href={`https://testnet.monadexplorer.com/tx/${successModal}`}
              target="_blank"
            >
              <Button variant="ghost">
                <div>
                  <img src="/explorer.svg" />
                </div>
              </Button>
            </Link>
          </div>
        </BlurryEntrance>
        <AlertDialogFooter>
          <Button onClick={() => setSuccessModal(false)}>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default SuccessModal
