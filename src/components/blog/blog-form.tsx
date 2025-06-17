import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichEditor } from "@/components/ui/rich-editor";
import { FormActions } from "@/components/ui/form-actions";
import { StatusMessage } from "@/components/ui/status-message";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlogStatus } from "@/lib/types/blog";

interface BlogFormProps {
  initialValues?: {
    judul?: string;
    konten?: string;
    status?: BlogStatus;
    kategori?: string;
    tags?: string[];
    tagNames?: { [key: string]: string }; // Map dari ID tag ke nama tag
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
  isEdit?: boolean;
}

export function BlogForm({
  initialValues = {},
  onSubmit,
  isLoading = false,
  error = "",
  success = false,
  isEdit = false,
}: BlogFormProps) {
  const [judul, setJudul] = useState(initialValues.judul || "");
  const [konten, setKonten] = useState(initialValues.konten || "");
  const [status, setStatus] = useState<BlogStatus>(initialValues.status || BlogStatus.DRAFT);
  const [kategori, setKategori] = useState(initialValues.kategori || "");
  const [tags, setTags] = useState<string[]>(initialValues.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [formError, setFormError] = useState("");
  const [tagNames, setTagNames] = useState<{[key: string]: string}>(initialValues.tagNames || {});
  
  useEffect(() => {
    if (initialValues.judul) setJudul(initialValues.judul);
    if (initialValues.konten) setKonten(initialValues.konten);
    if (initialValues.status) setStatus(initialValues.status);
    if (initialValues.kategori) setKategori(initialValues.kategori);
    if (initialValues.tags) setTags(initialValues.tags);
    if (initialValues.tagNames) setTagNames(initialValues.tagNames);
  }, [initialValues]);
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      
      // Buat URL preview
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setThumbnailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      // Untuk form tambah, kita menggunakan nama tag sebagai ID sementara
      const newTagId = tagInput.trim();
      setTags([...tags, newTagId]);
      
      // Simpan nama tag untuk ditampilkan
      setTagNames({
        ...tagNames,
        [newTagId]: newTagId
      });
      
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Validasi form
    if (!judul.trim()) {
      setFormError("Judul harus diisi");
      return;
    }
    
    if (!konten.trim()) {
      setFormError("Konten harus diisi");
      return;
    }
    
    // Persiapkan FormData untuk dikirim
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("konten", konten);
    formData.append("status", status);
    
    if (kategori) {
      formData.append("kategori", kategori);
    }
    
    // Tambahkan tags jika ada
    if (tags.length > 0) {
      tags.forEach(tag => {
        formData.append("tags", tag);
      });
    }
    
    if (thumbnail) {
      formData.append("file", thumbnail);
    }
    
    await onSubmit(formData);
  };
  
  // Fungsi untuk mendapatkan nama tag yang ditampilkan
  const getTagDisplayName = (tagId: string) => {
    return tagNames[tagId] || tagId;
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(formError || error) && <StatusMessage error={formError || error} />}
      {success && <StatusMessage success={isEdit ? "Blog berhasil diperbarui" : "Blog berhasil ditambahkan"} />}
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="judul">Judul</Label>
          <Input
            id="judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Masukkan judul blog"
            disabled={isLoading}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="kategori">Kategori</Label>
          <Input
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            placeholder="Masukkan kategori blog"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Tambahkan tag"
              disabled={isLoading}
              className="flex-grow"
            />
            <button 
              type="button" 
              onClick={handleAddTag}
              disabled={isLoading || !tagInput.trim()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Tambah
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tagId, index) => (
                <div key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>{getTagDisplayName(tagId)}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tagId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status} 
            onValueChange={(value) => setStatus(value as BlogStatus)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BlogStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={BlogStatus.PUBLISHED}>Terbit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            disabled={isLoading}
          />
          {thumbnailPreview && (
            <div className="mt-2 h-40 w-full relative">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="h-full w-auto object-contain"
              />
            </div>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="konten">Konten</Label>
          <RichEditor
            value={konten}
            onChange={setKonten}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <FormActions
        isLoading={isLoading}
        submitLabel={isEdit ? "Perbarui" : "Simpan"}
      />
    </form>
  );
} 