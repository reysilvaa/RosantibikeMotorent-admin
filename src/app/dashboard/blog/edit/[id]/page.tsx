'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { BlogForm } from '@/components/blog/blog-form';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { PageHeader } from '@/components/ui/page-header';
import { StatusMessage } from '@/components/ui/status-message';
import { useBlogEditStore } from '@/lib/store/blog/blog-edit-store';
import { BlogStatus } from '@/lib/types/blog';

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = React.use(params);
  const initialLoadComplete = useRef(false);
  const userInteracted = useRef(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');

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

  const tagNames = React.useMemo(() => {
    if (!blog || !blog.tags) return {};

    const tagMap: { [key: string]: string } = {};
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
  }, [id, fetchBlog]);

  useEffect(() => {
    if (blog && blog.judul) {
      setPageTitle(blog.judul);
    }
  }, [blog]);

  useEffect(() => {
    if (success && userInteracted.current) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/blog/${id}`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router, id]);

  const handleCancel = () => {
    router.push(`/dashboard/blog/${id}`);
  };

  const handleSubmit = async (formDataSubmit: FormData) => {
    if (!initialLoadComplete.current) {
      return;
    }

    userInteracted.current = true;
    const judul = formDataSubmit.get('judul') as string;
    const konten = formDataSubmit.get('konten') as string;
    const status = formDataSubmit.get('status') as BlogStatus;
    const kategori = formDataSubmit.get('kategori') as string;
    const file = formDataSubmit.get('file') as File;

    setFormData({
      judul,
      konten,
      status,
      kategori,
      tags: Array.from(formDataSubmit.getAll('tags') as string[]),
    });

    if (file && file.size > 0) {
      setSelectedFile(file);
    }

    await submitForm(id);
  };

  const handleFormChange = () => {
    if (initialLoadComplete.current) {
      userInteracted.current = true;
      setLastSaved(new Date());
    }
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
          description={`Mengedit blog: ${pageTitle}`}
          showBackButton={true}
          backHref={`/dashboard/blog/${id}`}
        />

        {lastSaved && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            <span>
              Perubahan terakhir disimpan sementara:{' '}
              {lastSaved.toLocaleTimeString()}
            </span>
          </div>
        )}

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
              success={success}
              isEdit={true}
              onChange={handleFormChange}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
