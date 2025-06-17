"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogFormStore } from "@/lib/store/blog/blog-form-store";
import { PageHeader } from "@/components/ui/page-header";
import { BlogForm } from "@/components/blog/blog-form";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { BlogStatus } from "@/lib/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleCancel = () => {
    router.push("/dashboard/blog");
  };

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
      <div className="space-y-6">
        <PageHeader
          title="Tambah Blog Baru"
          description="Tambahkan blog baru untuk website"
          showBackButton={true}
          backHref="/dashboard/blog"
        />

        <Card>
          <CardHeader>
            <CardTitle>Data Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm
              onSubmit={handleSubmit}
              isLoading={loading}
              error={error}
              success={success}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 