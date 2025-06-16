import axios from 'axios';
import { API_URL } from '../config';
import { getToken } from '../cookies';

// Fungsi untuk mendapatkan semua blog post
export const getBlogPosts = async (params?: any) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/blog`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan daftar blog post');
  }
};

// Fungsi untuk mendapatkan detail blog post
export const getBlogPost = async (id: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan detail blog post');
  }
};

// Fungsi untuk mendapatkan blog post berdasarkan slug
export const getBlogPostBySlug = async (slug: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/blog/by-slug/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan blog post berdasarkan slug');
  }
};

// Fungsi untuk membuat blog post baru
export const createBlogPost = async (formData: FormData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/blog`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal membuat blog post baru');
  }
};

// Fungsi untuk mengupdate blog post
export const updateBlogPost = async (id: string, formData: FormData) => {
  try {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/blog/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mengupdate blog post');
  }
};

// Fungsi untuk menghapus blog post
export const deleteBlogPost = async (id: string) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal menghapus blog post');
  }
}; 