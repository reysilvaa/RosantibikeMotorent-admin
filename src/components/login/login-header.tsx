"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginHeader() {
  return (
    <CardHeader className="space-y-2 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
        <LayoutDashboard size={24} />
      </div>
      <CardTitle className="text-2xl font-bold">Admin Rental</CardTitle>
      <CardDescription>
        Masuk untuk mengelola sistem rental motor
      </CardDescription>
    </CardHeader>
  );
} 