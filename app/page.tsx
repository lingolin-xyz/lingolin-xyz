"use client";

import LoginButton from "@/components/LoginButton";
import { usePrivy } from "@privy-io/react-auth";
import LoggedInHome from "@/components/LoggedInHome";

export default function Home() {
  const { user } = usePrivy();
  if (!user) {
    return (
      <div className="py-6 max-w-7xl mx-auto w-full">
        <LoginButton />
      </div>
    );
  }
  return (
    <div className="py-6 max-w-7xl mx-auto w-full">
      <LoggedInHome />
    </div>
  );
}
