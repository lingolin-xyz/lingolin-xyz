"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Users, BarChart, ClipboardList, Home } from "lucide-react"

const DashboardHeaderBar = () => {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-center px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 flex items-center gap-2 ${
                    pathname === "/dashboard" ? "bg-accent/50 font-bold" : ""
                  }`}
                >
                  <Home size={18} />{" "}
                  <span className="translate-y-[1.5px]">Home</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/dashboard/translations" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 flex items-center gap-2 ${
                    pathname === "/dashboard/translations"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  <FileText size={18} />{" "}
                  <span className="translate-y-[1.5px]">Translations</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard/users" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 flex items-center gap-2 ${
                    pathname === "/dashboard/users"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  <Users size={18} />{" "}
                  <span className="translate-y-[1.5px]">Users</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard/usage" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 flex items-center gap-2 ${
                    pathname === "/dashboard/usage"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  <BarChart size={18} />{" "}
                  <span className="translate-y-[1.5px]">Usage</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard/activity-log" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 flex items-center gap-2 ${
                    pathname === "/dashboard/activity-log"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  <ClipboardList size={18} />{" "}
                  <span className="translate-y-[1.5px]">Activity Log</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

export default DashboardHeaderBar
