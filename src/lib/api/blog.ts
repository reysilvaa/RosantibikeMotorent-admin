import axios from '../axios';

export interface BlogParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}


export interface BlogTag {
  id: string;
  nama: string;
}

export const getBlogPosts = async (params?: BlogParams) => {
  try {
    console.log('Fetching blog posts with params:', params);
    
    const response = await axios.get(`/blog`, {
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

export const getBlogPost = async (id: string) => {
  try {
    console.log('Fetching blog post with ID:', id);
    
    const response = await axios.get(`/blog/${id}`);
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

export const getBlogPostBySlug = async (slug: string) => {
  try {
    console.log('Fetching blog post with slug:', slug);
    
    const response = await axios.get(`/blog/by-slug/${slug}`);
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

export const getBlogTags = async () => {
  try {
    console.log('Fetching blog tags');
    
    const response = await axios.get(`/blog/tags`);
    console.log('Blog tags response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching blog tags:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mendapatkan daftar tag');
  }
};

export const searchBlogTags = async (query: string) => {
  try {
    console.log('Searching blog tags with query:', query);
    
    const response = await axios.get(`/blog/tags/search`, {
      params: { q: query },
    });
    console.log('Search blog tags response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error searching blog tags:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Gagal mencari tag');
  }
};

export const createBlogPost = async (formData: FormData) => {
  try {
    console.log('Creating new blog post');
    
    const response = await axios.post(`/blog`, formData, {
      headers: {
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

export const updateBlogPost = async (id: string, formData: FormData) => {
  try {
    console.log('Updating blog post with ID:', id);
    
    const response = await axios.patch(`/blog/${id}`, formData, {
      headers: {
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

export const deleteBlogPost = async (id: string) => {
  try {
    console.log('Deleting blog post with ID:', id);
    
    const response = await axios.delete(`/blog/${id}`);
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