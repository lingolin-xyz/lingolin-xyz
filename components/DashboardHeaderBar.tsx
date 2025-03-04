"use client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"

const DashboardHeaderBar = () => {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard/translations" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 ${
                    pathname === "/dashboard/translations"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  Translations
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard/users" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 ${
                    pathname === "/dashboard/users"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  Users
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard/usage" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`px-4 py-2 transition-all rounded-md hover:bg-accent/30 ${
                    pathname === "/dashboard/usage"
                      ? "bg-accent/50 font-bold"
                      : ""
                  }`}
                >
                  Usage
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
