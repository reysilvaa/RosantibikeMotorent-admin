"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, ArrowLeft } from "lucide-react";
import { useBlogDetailStore } from "@/lib/store/blog/blog-detail-store";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { StatusMessage } from "@/components/ui/status-message";
import { Button } from "@/components/ui/button";
import { BlogStatus } from "@/lib/types/blog";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { blog, loading, error, fetchBlog } = useBlogDetailStore();
  const { id } = React.use(params);
  
  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id, fetchBlog]);

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
    return (
      <DashboardLayout>
        <LoadingIndicator />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <StatusMessage error={error} />
      </DashboardLayout>
    );
  }

  if (!blog) {
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
          title={blog.judul}
          description={`Kategori: ${blog.kategori || '-'}`}
          showBackButton={true}
          backHref="/dashboard/blog"
          actionLabel="Edit"
          actionIcon={<Edit className="mr-2 h-4 w-4" />}
          actionHref={`/dashboard/blog/edit/${blog.id}`}
        />

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <StatusBadge 
                status={blog.status === BlogStatus.PUBLISHED ? "Terbit" : "Draft"} 
                variant={getStatusVariant(blog.status)}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Dibuat pada {formatDate(blog.createdAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {blog.thumbnail && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img
                  src={blog.thumbnail}
                  alt={blog.judul}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div 
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.konten }}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
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
    </DashboardLayout>
  );
} 