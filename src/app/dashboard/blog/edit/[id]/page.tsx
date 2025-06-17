"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogEditStore } from "@/lib/store/blog/blog-edit-store";
import { PageHeader } from "@/components/ui/page-header";
import { BlogForm } from "@/components/blog/blog-form";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { StatusMessage } from "@/components/ui/status-message";
import { BlogStatus } from "@/lib/types/blog";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id; // Simpan dalam variabel untuk menghindari akses berulang
  
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
      fetchBlog(id);
    }
  }, [id, fetchBlog]);

  useEffect(() => {
    // Redirect ke halaman blog jika berhasil diupdate
    if (success) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/blog/${id}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router, id]);

  const handleSubmit = async (formDataSubmit: FormData) => {
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
    return <LoadingIndicator message="Memuat data blog..." />;
  }

  if (!blog && !loading) {
    return <StatusMessage error="Blog tidak ditemukan" />;
  }

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <PageHeader
          title="Edit Blog"
          description={`Mengedit blog: ${blog?.judul}`}
          showBackButton
          backHref={`/dashboard/blog/${id}`}
        />

        <div className="max-w-3xl">
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
            isLoading={loadingSubmit}
            error={error}
            success={success}
            isEdit={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
} 