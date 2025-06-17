export interface Blog {
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
  DRAFT = 'DRAFT',
  PUBLISHED = 'TERBIT'
}

export interface BlogPostFilter {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: BlogStatus;
}