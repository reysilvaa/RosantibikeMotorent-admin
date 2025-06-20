import React, { useEffect, useRef, useState } from 'react';
import { FormActions } from '@/components/ui/form-actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichEditor } from '@/components/ui/rich-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusMessage } from '@/components/ui/status-message';
import { useDebounce } from '@/hooks/useDebounce';
import { BlogTag, searchBlogTags } from '@/lib/api/blog';
import { BlogStatus } from '@/lib/types/blog';

interface BlogFormProps {
  initialValues?: {
    judul?: string;
    konten?: string;
    status?: BlogStatus;
    kategori?: string;
    tags?: string[];
    tagNames?: { [key: string]: string };
  };
  onSubmit: () => Promise<void>;
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
  error = '',
  success = false,
  isEdit = false,
  onChange,
}: BlogFormProps) {
  const isInitialMount = useRef(true);
  const [judul, setJudul] = useState(initialValues.judul || '');
  const [konten, setKonten] = useState(initialValues.konten || '');
  const [status, setStatus] = useState<BlogStatus>(
    initialValues.status || BlogStatus.DRAFT
  );
  const [kategori, setKategori] = useState(initialValues.kategori || '');
  const [tags, setTags] = useState<string[]>(initialValues.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [tagNames, setTagNames] = useState<{ [key: string]: string }>(
    initialValues.tagNames || {}
  );
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
        console.error('Gagal mengambil saran tag:', error);
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
        [normalizedTag]: normalizedTag,
      });

      setTagInput('');
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (tag: BlogTag) => {
    if (tags.includes(tag.id)) {
      setTagInput('');
      setShowSuggestions(false);
      return;
    }

    setTags([...tags, tag.id]);

    setTagNames({
      ...tagNames,
      [tag.id]: tag.nama,
    });

    setTagInput('');
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
    setFormError('');

    if (!judul.trim()) {
      setFormError('Judul harus diisi');
      return;
    }

    if (!konten.trim()) {
      setFormError('Konten harus diisi');
      return;
    }

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('konten', konten);
    formData.append('status', status);

    if (kategori) {
      formData.append('kategori', kategori);
    }

    if (tags.length > 0) {
      tags.forEach(tag => {
        formData.append('tags', tag);
      });
    }

    if (thumbnail) {
      formData.append('file', thumbnail);
    }

    await onSubmit();
  };

  const getTagDisplayName = (tagId: string) => {
    return tagNames[tagId] || tagId;
  };

  const handleKontenChange = (newKonten: string) => {
    setKonten(newKonten);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {(formError || error) && <StatusMessage error={formError || error} />}
      {success && (
        <StatusMessage
          success={
            isEdit ? 'Blog berhasil diperbarui' : 'Blog berhasil ditambahkan'
          }
        />
      )}

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="judul">Judul</Label>
          <Input
            disabled={isLoading}
            id="judul"
            placeholder="Masukkan judul blog"
            value={judul}
            onChange={e => setJudul(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="kategori">Kategori</Label>
          <Input
            disabled={isLoading}
            id="kategori"
            placeholder="Masukkan kategori blog"
            value={kategori}
            onChange={e => setKategori(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="relative flex gap-2">
            <Input
              className="flex-grow"
              disabled={isLoading}
              id="tags"
              placeholder="Tambahkan tag"
              value={tagInput}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onChange={e => {
                setTagInput(e.target.value);
                setShowSuggestions(e.target.value.trim().length > 0);
              }}
              onFocus={handleTagInputFocus}
              onKeyDown={handleTagInputKeyDown}
            />
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading || !tagInput.trim()}
              type="button"
              onClick={handleAddTag}
            >
              Tambah
            </button>

            {showSuggestions && tagSuggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {isLoadingSuggestions ? (
                  <div className="p-2 text-center text-gray-500 dark:text-gray-400">
                    Mencari tag...
                  </div>
                ) : (
                  <ul>
                    {tagSuggestions.map((tag, index) => (
                      <li
                        key={tag.id}
                        className="cursor-pointer p-2 text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        id={`tag-suggestion-${index}`}
                        tabIndex={0}
                        onClick={() => handleSelectSuggestion(tag)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleSelectSuggestion(tag);
                          } else if (
                            e.key === 'ArrowDown' &&
                            index < tagSuggestions.length - 1
                          ) {
                            const nextElement = document.getElementById(
                              `tag-suggestion-${index + 1}`
                            );
                            if (nextElement) nextElement.focus();
                          } else if (e.key === 'ArrowUp') {
                            if (index > 0) {
                              const prevElement = document.getElementById(
                                `tag-suggestion-${index - 1}`
                              );
                              if (prevElement) prevElement.focus();
                            } else {
                              const inputElement =
                                document.getElementById('tags');
                              if (inputElement) inputElement.focus();
                            }
                          }
                        }}
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
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tagId, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700"
                >
                  <span className="text-gray-800 dark:text-gray-200">
                    {getTagDisplayName(tagId)}
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    type="button"
                    onClick={() => handleRemoveTag(tagId)}
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
            disabled={isLoading}
            value={status}
            onValueChange={value => setStatus(value as BlogStatus)}
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
            accept="image/*"
            disabled={isLoading}
            id="thumbnail"
            type="file"
            onChange={handleThumbnailChange}
          />
          {thumbnailPreview && (
            <div className="relative mt-2 h-40 w-full">
              <img
                alt="Thumbnail Preview"
                className="h-full w-auto object-contain"
                src={thumbnailPreview}
              />
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="konten">Konten</Label>
          <RichEditor
            disabled={isLoading}
            value={konten}
            onChange={handleKontenChange}
          />
        </div>
      </div>

      <FormActions
        cancelLabel="Batal"
        isLoading={isLoading}
        submitLabel={isEdit ? 'Perbarui' : 'Simpan'}
        onCancel={onCancel}
      />
    </form>
  );
}
