"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit, Trash, FileText, Plus, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBlogList, removeBlog, BlogPost, BlogStatus } from "@/lib/blog";
import { formatTanggal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";

export default function BlogPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchBlogs = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await getBlogList({
        page,
        limit: 10,
        search,
      });
      setBlogs(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Error mengambil data blog:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(meta.page, search);
  }, [meta.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(1, search);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus blog ini?")) {
      try {
        await removeBlog(id);
        toast({
          title: "Sukses",
          description: "Blog berhasil dihapus",
        });
        fetchBlogs(meta.page, search);
      } catch (error) {
        console.error("Error menghapus blog:", error);
        toast({
          title: "Error",
          description: "Gagal menghapus blog",
          variant: "destructive",
        });
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== meta.page) {
      setMeta({ ...meta, page });
    }
  };

  const getStatusBadge = (status: BlogStatus) => {
    switch (status) {
      case BlogStatus.PUBLISHED:
        return <Badge className="bg-green-600">Dipublikasi</Badge>;
      case BlogStatus.DRAFT:
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
          <p className="text-muted-foreground">
            Kelola artikel blog untuk website Anda
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => router.push("/dashboard/blog/tambah")}
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>
            Daftar artikel blog yang telah dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6 flex gap-2">
            <Input
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <p>Sedang memuat data...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Tidak ada artikel</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Anda belum memiliki artikel blog. Buat artikel baru sekarang.
              </p>
              <Button
                onClick={() => router.push("/dashboard/blog/tambah")}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Blog
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.judul}</TableCell>
                      <TableCell>{getStatusBadge(blog.status)}</TableCell>
                      <TableCell>
                        {formatTanggal(new Date(blog.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              window.open(`/blog/${blog.slug}`, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(`/dashboard/blog/${blog.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(blog.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {meta.totalPages > 1 && (
            <Pagination className="w-full justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (meta.page > 1) handlePageChange(meta.page - 1);
                    }}
                    className={meta.page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === meta.totalPages ||
                      (page >= meta.page - 1 && page <= meta.page + 1)
                  )
                  .map((page, i, arr) => {
                    const showEllipsis =
                      i > 0 && page - arr[i - 1] > 1;
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === meta.page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </div>
                    );
                  })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (meta.page < meta.totalPages)
                        handlePageChange(meta.page + 1);
                    }}
                    className={
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
} 