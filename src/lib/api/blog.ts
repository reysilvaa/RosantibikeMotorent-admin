import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';

// Interface untuk parameter filter blog
export interface BlogParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

// Fungsi untuk mendapatkan semua blog post
export const getBlogPosts = async (params?: BlogParams) => {
  try {
    const token = getToken();
    console.log('Fetching blog posts with params:', params);
    console.log('API URL:', `${API_URL}/blog`);
    
    const response = await axios.get(`${API_URL}/blog`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    console.log('Blog posts response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching blog posts:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan daftar blog post');
  }
};

// Fungsi untuk mendapatkan detail blog post berdasarkan ID
export const getBlogPost = async (id: string) => {
  try {
    const token = getToken();
    console.log('Fetching blog post with ID:', id);
    console.log('API URL:', `${API_URL}/blog/${id}`);
    
    const response = await axios.get(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Blog post detail response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail blog post');
  }
};

// Fungsi untuk mendapatkan blog post berdasarkan slug
export const getBlogPostBySlug = async (slug: string) => {
  try {
    const token = getToken();
    console.log('Fetching blog post with slug:', slug);
    
    const response = await axios.get(`${API_URL}/blog/by-slug/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Blog post by slug response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan blog post berdasarkan slug');
  }
};

// Fungsi untuk membuat blog post baru
export const createBlogPost = async (formData: FormData) => {
  try {
    const token = getToken();
    console.log('Creating new blog post');
    
    const response = await axios.post(`${API_URL}/blog`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create blog post response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating blog post:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal membuat blog post baru');
  }
};

// Fungsi untuk mengupdate blog post berdasarkan ID
export const updateBlogPost = async (id: string, formData: FormData) => {
  try {
    const token = getToken();
    console.log('Updating blog post with ID:', id);
    console.log('API URL:', `${API_URL}/blog/${id}`);
    
    const response = await axios.patch(`${API_URL}/blog/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update blog post response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate blog post');
  }
};

// Fungsi untuk menghapus blog post
export const deleteBlogPost = async (id: string) => {
  try {
    const token = getToken();
    console.log('Deleting blog post with ID:', id);
    
    const response = await axios.delete(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Delete blog post response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus blog post');
  }
}; 