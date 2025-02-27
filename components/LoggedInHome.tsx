"use client";

import { usePrivy } from "@privy-io/react-auth";
import Title from "./Title";
import { Button } from "./ui/button";

const LoggedInHome = () => {
  const { user, logout } = usePrivy();
  return (
    <div className="space-y-4">
      <Title>The user data:</Title>
      <Button onClick={logout}>Logout</Button>
      <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default LoggedInHome;
