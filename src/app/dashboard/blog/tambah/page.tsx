'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { BlogForm } from '@/components/blog/blog-form';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { useBlogFormStore } from '@/lib/store/blog/blog-form-store';
import { BlogStatus } from '@/lib/types/blog';

export default function TambahBlogPage() {
  const router = useRouter();
  const initialLoadComplete = useRef(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const {
    loading,
    error,
    success,
    submitForm,
    resetForm,
    setFormData,
    setSelectedFile,
  } = useBlogFormStore();

  useEffect(() => {
    resetForm();
    setTimeout(() => {
      initialLoadComplete.current = true;
    }, 100);
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/dashboard/blog');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleCancel = () => {
    router.push('/dashboard/blog');
  };

  const handleSubmit = async (formDataSubmit: FormData) => {
    if (!initialLoadComplete.current) {
      return;
    }

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

    if (file) {
      setSelectedFile(file);
    }

    await submitForm();
  };

  const handleFormChange = () => {
    if (initialLoadComplete.current) {
      setLastSaved(new Date());
    }
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
              onSubmit={handleSubmit}
              isLoading={loading}
              error={error}
              success={success}
              onCancel={handleCancel}
              onChange={handleFormChange}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
