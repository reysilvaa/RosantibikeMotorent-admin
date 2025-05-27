import { getBlogPosts, getBlogPost, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost } from "./api";

export interface BlogPost {
  id: string;
  judul: string;
  konten: string;
  slug: string;
  thumbnail: string;
  status: BlogStatus;
  kategori: string;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    tag: {
      id: string;
      nama: string;
    }
  }>;
}

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export interface BlogPostFilter {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: BlogStatus;
}

export const getBlogList = async (filter?: BlogPostFilter) => {
  return getBlogPosts(filter);
};

export const getBlogDetail = async (id: string) => {
  return getBlogPost(id);
};

export const getBlogDetailBySlug = async (slug: string) => {
  return getBlogPostBySlug(slug);
};

export const createBlog = async (formData: FormData) => {
  return createBlogPost(formData);
};

export const updateBlog = async (id: string, formData: FormData) => {
  return updateBlogPost(id, formData);
};

export const removeBlog = async (id: string) => {
  return deleteBlogPost(id);
}; 