import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichEditor } from "@/components/ui/rich-editor";
import { FormActions } from "@/components/ui/form-actions";
import { StatusMessage } from "@/components/ui/status-message";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlogStatus } from "@/lib/types/blog";
import { searchBlogTags, BlogTag } from "@/lib/api/blog";
import { useDebounce } from "@/hooks/use-debounce";

interface BlogFormProps {
  initialValues?: {
    judul?: string;
    konten?: string;
    status?: BlogStatus;
    kategori?: string;
    tags?: string[];
    tagNames?: { [key: string]: string }; 
  };
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
  isEdit?: boolean;
  onChange?: () => void;
}

export function BlogForm({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
  error = "",
  success = false,
  isEdit = false,
  onChange,
}: BlogFormProps) {
  const isInitialMount = useRef(true);
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
  const [tagSuggestions, setTagSuggestions] = useState<BlogTag[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedTagInput = useDebounce(tagInput, 300);
  
  useEffect(() => {
    if (initialValues.judul) setJudul(initialValues.judul);
    if (initialValues.konten) setKonten(initialValues.konten);
    if (initialValues.status) setStatus(initialValues.status);
    if (initialValues.kategori) setKategori(initialValues.kategori);
    if (initialValues.tags) setTags(initialValues.tags);
    if (initialValues.tagNames) setTagNames(initialValues.tagNames);
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [initialValues]);
  
  useEffect(() => {
    if (!isInitialMount.current && onChange) {
      onChange();
    }
  }, [judul, konten, status, kategori, tags, onChange]);
  
  useEffect(() => {
    const fetchTagSuggestions = async () => {
      if (debouncedTagInput.trim().length < 1) {
        setTagSuggestions([]);
        return;
      }
      
      try {
        setIsLoadingSuggestions(true);
        const response = await searchBlogTags(debouncedTagInput);
        setTagSuggestions(response.data || []);
      } catch (error) {
        console.error("Gagal mengambil saran tag:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    
    fetchTagSuggestions();
  }, [debouncedTagInput]);
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setThumbnailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      
      if (onChange) {
        onChange();
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      const normalizedTag = tagInput.trim().toLowerCase();
      
      setTags([...tags, normalizedTag]);
      
      setTagNames({
        ...tagNames,
        [normalizedTag]: normalizedTag
      });
      
      setTagInput("");
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (tag: BlogTag) => {
    if (tags.includes(tag.id)) {
      setTagInput("");
      setShowSuggestions(false);
      return;
    }
    
    setTags([...tags, tag.id]);
    
    setTagNames({
      ...tagNames,
      [tag.id]: tag.nama
    });
    
    setTagInput("");
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'ArrowDown' && tagSuggestions.length > 0) {
      const suggestionElement = document.getElementById('tag-suggestion-0');
      if (suggestionElement) {
        suggestionElement.focus();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  const handleTagInputFocus = () => {
    if (tagInput.trim().length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!judul.trim()) {
      setFormError("Judul harus diisi");
      return;
    }
    
    if (!konten.trim()) {
      setFormError("Konten harus diisi");
      return;
    }
    
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("konten", konten);
    formData.append("status", status);
    
    if (kategori) {
      formData.append("kategori", kategori);
    }
    
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
  
  const getTagDisplayName = (tagId: string) => {
    return tagNames[tagId] || tagId;
  };
  
  const handleKontenChange = (newKonten: string) => {
    setKonten(newKonten);
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
          <div className="flex gap-2 relative">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowSuggestions(e.target.value.trim().length > 0);
              }}
              onKeyDown={handleTagInputKeyDown}
              onFocus={handleTagInputFocus}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
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
            
            {showSuggestions && tagSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="p-2 text-center text-gray-500 dark:text-gray-400">Mencari tag...</div>
                ) : (
                  <ul>
                    {tagSuggestions.map((tag, index) => (
                      <li 
                        key={tag.id} 
                        id={`tag-suggestion-${index}`}
                        tabIndex={0}
                        onClick={() => handleSelectSuggestion(tag)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSelectSuggestion(tag);
                          } else if (e.key === 'ArrowDown' && index < tagSuggestions.length - 1) {
                            const nextElement = document.getElementById(`tag-suggestion-${index + 1}`);
                            if (nextElement) nextElement.focus();
                          } else if (e.key === 'ArrowUp') {
                            if (index > 0) {
                              const prevElement = document.getElementById(`tag-suggestion-${index - 1}`);
                              if (prevElement) prevElement.focus();
                            } else {
                              const inputElement = document.getElementById('tags');
                              if (inputElement) inputElement.focus();
                            }
                          }
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none text-gray-800 dark:text-gray-200"
                      >
                        {tag.nama}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tagId, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-gray-800 dark:text-gray-200">{getTagDisplayName(tagId)}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tagId)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
            onChange={handleKontenChange}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <FormActions
        isLoading={isLoading}
        submitLabel={isEdit ? "Perbarui" : "Simpan"}
        onCancel={onCancel}
        cancelLabel="Batal"
      />
    </form>
  );
}