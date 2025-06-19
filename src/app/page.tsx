"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth/auth-store";
import { Login } from "@/components/login/login-container";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router, isAuthenticated]);

  return (
    <div>
      {isAuthenticated ? null : <Login />}
    </div>
  );
} 
