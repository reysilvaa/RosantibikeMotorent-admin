"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, ArrowLeft } from "lucide-react";
import { useBlogDetailStore } from "@/lib/store/blog/blog-detail-store";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { StatusMessage } from "@/components/ui/status-message";
import { Button } from "@/components/ui/button";
import { BlogStatus } from "@/lib/types/blog";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { blog, loading, error, fetchBlog } = useBlogDetailStore();
  
  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id);
    }
  }, [params.id, fetchBlog]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  const getStatusVariant = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return "success";
      case BlogStatus.DRAFT:
        return "warning";
      default:
        return "neutral";
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <StatusMessage error={error} />;
  }

  if (!blog) {
    return <StatusMessage error="Blog tidak ditemukan" />;
  }

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <PageHeader
          title={blog.judul}
          description={`Kategori: ${blog.kategori || '-'}`}
          showBackButton
          backHref="/dashboard/blog"
          actionLabel="Edit"
          actionIcon={<Edit className="mr-2 h-4 w-4" />}
          actionHref={`/dashboard/blog/edit/${blog.id}`}
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge 
              status={blog.status === BlogStatus.PUBLISHED ? "Terbit" : "Draft"} 
              variant={getStatusVariant(blog.status)}
            />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Dibuat pada {formatDate(blog.createdAt)}
            </span>
          </div>

          {blog.thumbnail && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <img
                src={blog.thumbnail}
                alt={blog.judul}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <Card>
            <CardContent className="p-6">
              <div 
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.konten }}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <Button
              onClick={() => router.push(`/dashboard/blog/edit/${blog.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Blog
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 