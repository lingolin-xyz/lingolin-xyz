import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="border-b pb-4  flex items-center justify-between">
      <Link href="/">
        <Button variant="outline" className="font-bold text-sm">
          <div className="flex items-center gap-2">
            <div className="hidden md:block">home</div>
            <div className="block md:hidden">home</div>
          </div>
        </Button>
      </Link>
      <div className="flex items-center gap-2">.</div>
    </div>
  );
};

export default Header;
