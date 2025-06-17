"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogFormStore } from "@/lib/store/blog/blog-form-store";
import { PageHeader } from "@/components/ui/page-header";
import { BlogForm } from "@/components/blog/blog-form";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { BlogStatus } from "@/lib/types/blog";

export default function TambahBlogPage() {
  const router = useRouter();
  const { loading, error, success, submitForm, resetForm, setFormData, setSelectedFile } = useBlogFormStore();

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

  const handleSubmit = async (formDataSubmit: FormData) => {
    const judul = formDataSubmit.get('judul') as string;
    const konten = formDataSubmit.get('konten') as string;
    const status = formDataSubmit.get('status') as BlogStatus;
    const kategori = formDataSubmit.get('kategori') as string;
    const file = formDataSubmit.get('file') as File;
    
    // Update state di store
    setFormData({
      judul,
      konten,
      status,
      kategori,
      tags: Array.from(formDataSubmit.getAll('tags') as string[])
    });
    
    if (file) {
      setSelectedFile(file);
    }
    
    // Submit form
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