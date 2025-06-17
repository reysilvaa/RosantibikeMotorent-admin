"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogFormStore } from "@/lib/store/blog/blog-form-store";
import { PageHeader } from "@/components/ui/page-header";
import { BlogForm } from "@/components/blog/blog-form";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { BlogStatus } from "@/lib/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TambahBlogPage() {
  const router = useRouter();
  const initialLoadComplete = useRef(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const { loading, error, success, submitForm, resetForm, setFormData, setSelectedFile } = useBlogFormStore();

  useEffect(() => {
    resetForm();
    setTimeout(() => {
      initialLoadComplete.current = true;
    }, 100);
    
    // Tambahkan event listener untuk mendeteksi interaksi pengguna
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [resetForm]);

  useEffect(() => {
    // Redirect ke halaman blog jika berhasil diupdate DAN pengguna telah berinteraksi
    if (success && hasUserInteracted) {
      const timer = setTimeout(() => {
        router.push("/dashboard/blog");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router, hasUserInteracted]);

  const handleCancel = () => {
    router.push("/dashboard/blog");
  };

  const handleSubmit = async (formDataSubmit: FormData) => {
    // Hanya lakukan submit jika load awal sudah selesai dan pengguna telah berinteraksi
    if (!initialLoadComplete.current || !hasUserInteracted) {
      return;
    }
    
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
              success={success && hasUserInteracted}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 