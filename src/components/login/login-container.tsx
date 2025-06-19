"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoginHeader } from "./login-header";
import { LoginForm } from "./login-form";

export function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <Card className="mx-auto w-full max-w-md">
        <LoginHeader />
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
} 