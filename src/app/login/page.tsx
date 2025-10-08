"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Settings() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      window.location.href = "/";
    }
  }, [session]);

  return (
    <div className="flex-1 text-center content-center">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
