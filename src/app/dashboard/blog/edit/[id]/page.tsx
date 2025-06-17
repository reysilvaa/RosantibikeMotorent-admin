"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogEditStore } from "@/lib/store/blog/blog-edit-store";
import { PageHeader } from "@/components/ui/page-header";
import { BlogForm } from "@/components/blog/blog-form";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { StatusMessage } from "@/components/ui/status-message";
import { BlogStatus } from "@/lib/types/blog";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const initialLoadComplete = useRef(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const {
    blog,
    formData,
    loading,
    loadingSubmit,
    error,
    success,
    fetchBlog,
    submitForm,
    setFormData,
    setSelectedFile,
  } = useBlogEditStore();

  // Buat mapping dari ID tag ke nama tag
  const tagNames = React.useMemo(() => {
    if (!blog || !blog.tags) return {};
    
    const tagMap: {[key: string]: string} = {};
    blog.tags.forEach((tagItem: { tag: { id: string; nama: string } }) => {
      tagMap[tagItem.tag.id] = tagItem.tag.nama;
    });
    
    return tagMap;
  }, [blog]);

  useEffect(() => {
    if (id) {
      fetchBlog(id).then(() => {
        initialLoadComplete.current = true;
      });
    }
    
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
  }, [id, fetchBlog]);

  useEffect(() => {
    // Redirect ke halaman blog jika berhasil diupdate DAN pengguna telah berinteraksi
    if (success && hasUserInteracted) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/blog/${id}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router, id, hasUserInteracted]);

  const handleCancel = () => {
    router.push(`/dashboard/blog/${id}`);
  };

  const handleSubmit = async (formDataSubmit: FormData) => {
    // Hanya lakukan submit jika load awal sudah selesai dan pengguna telah berinteraksi
    if (!initialLoadComplete.current || !hasUserInteracted) {
      return;
    }
    
    // Ekstrak data dari FormData
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
    await submitForm(id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingIndicator message="Memuat data blog..." />
      </DashboardLayout>
    );
  }

  if (!blog && !loading) {
    return (
      <DashboardLayout>
        <StatusMessage error="Blog tidak ditemukan" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Edit Blog"
          description={`Mengedit blog: ${blog?.judul}`}
          showBackButton={true}
          backHref={`/dashboard/blog/${id}`}
        />

        <Card>
          <CardHeader>
            <CardTitle>Data Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm
              initialValues={{
                judul: formData.judul,
                konten: formData.konten,
                status: formData.status,
                kategori: formData.kategori,
                tags: formData.tags,
                tagNames: tagNames,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={loadingSubmit}
              error={error}
              success={success && hasUserInteracted}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 