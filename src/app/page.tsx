"use client"

import { UserButton } from "@/components/auth/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  const user = useCurrentUser();

  return (
    <div>
      {user?.name}
      <UserButton />
    </div>
  );
}
