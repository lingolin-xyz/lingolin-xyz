import { Button } from "@/components/ui/button"
import Link from "next/link"
import UserHeaderCorner from "./UserHeaderCorner"
const Header = () => {
  return (
    <div className="border-b pb-4  flex items-center justify-between">
      <Link href="/">
        <Button variant="outline" className="font-bold text-sm group">
          <div className="flex items-center gap-2">
            <div className="">
              <img
                src="/images/logo.png"
                className="h-6 group-hover:rotate-[360deg] transition-all duration-500 group-active:scale-[60%] group-active:rotate-[720deg] group-active:duration-300"
              />
            </div>
            <div className="">home</div>
          </div>
        </Button>
      </Link>
      <div className="flex items-center gap-2">
        <UserHeaderCorner />
      </div>
    </div>
  )
}

export default Header
