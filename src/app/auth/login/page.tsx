"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/components/login/login-container";
import { useAuthStore } from "@/lib/store/auth/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    const isLoggedIn = checkAuth();    
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [router, checkAuth]);
  return <Login />;
} 