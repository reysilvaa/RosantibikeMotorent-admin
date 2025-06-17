"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogFormStore } from "@/lib/store/blog/blog-form-store";
import { PageHeader } from "@/components/ui/page-header";
import { BlogForm } from "@/components/blog/blog-form";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function TambahBlogPage() {
  const router = useRouter();
  const { loading, error, success, submitForm, resetForm } = useBlogFormStore();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard/blog");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async () => {
    await submitForm();
  };

  return (
    <DashboardLayout>
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Tambah Blog"
        description="Tambahkan blog baru untuk website"
        showBackButton
        backHref="/dashboard/blog"
      />

      <div className="max-w-3xl">
        <BlogForm
          onSubmit={handleSubmit}
          isLoading={loading}
          error={error}
          success={success}
        />
      </div>
    </div>
    </DashboardLayout>
  );
} 