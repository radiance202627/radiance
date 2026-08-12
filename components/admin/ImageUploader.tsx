'use client';

import React, { useState } from 'react';
import { Upload, Star, Trash2, ArrowLeft, ArrowRight, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { uploadImageToStorage } from '@/lib/storage';

export interface ImageItem {
  url: string;
  altText?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const newImages: ImageItem[] = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadImageToStorage(file);
        newImages.push({
          url: uploadedUrl,
          altText: file.name.split('.')[0].replace(/[-_]/g, ' '),
          isFeatured: newImages.length === 0,
          sortOrder: newImages.length + 1,
        });
      }
      onChange(newImages);
    } catch (e) {
      console.error('Image upload failed:', e);
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const newImages = [
      ...images,
      {
        url: urlInput.trim(),
        altText: 'Product image',
        isFeatured: images.length === 0,
        sortOrder: images.length + 1,
      },
    ];
    onChange(newImages);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const setFeatured = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isFeatured: i === index,
    }));
    onChange(updated);
  };

  const updateAltText = (index: number, altText: string) => {
    const updated = [...images];
    updated[index].altText = altText;
    onChange(updated);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isFeatured)) {
      updated[0].isFeatured = true;
    }
    onChange(updated);
  };

  const moveImage = (index: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    // update sortOrder
    updated.forEach((img, i) => (img.sortOrder = i + 1));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
          Product Gallery & Images ({images.length})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? 'Hide URL Input' : 'Add Image URL'}
        </button>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-2 rounded-xl">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold hover:bg-amber-300 transition"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-stone-950/60 transition cursor-pointer relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
            {uploading ? (
              <span className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-200">
              Drag & drop product images, or <span className="text-amber-400">browse files</span>
            </p>
            <p className="text-xs text-stone-500 mt-0.5">Supports PNG, JPG, WEBP (Supabase Storage URL)</p>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`bg-stone-900 border rounded-xl overflow-hidden group relative transition ${
                img.isFeatured ? 'border-amber-500 ring-1 ring-amber-500/40' : 'border-stone-800'
              }`}
            >
              <div className="relative aspect-square bg-stone-950 flex items-center justify-center overflow-hidden">
                <img
                  src={img.url}
                  alt={img.altText || 'Product Thumbnail'}
                  className="w-full h-full object-cover"
                />
                {img.isFeatured && (
                  <span className="absolute top-2 left-2 bg-amber-400 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-stone-950" /> Featured
                  </span>
                )}
                <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 'prev')}
                    disabled={idx === 0}
                    className="p-1.5 bg-stone-900 rounded-lg text-stone-300 hover:text-stone-100 disabled:opacity-30"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeatured(idx)}
                    title="Set as featured main image"
                    className={`p-1.5 rounded-lg transition ${
                      img.isFeatured ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-stone-300 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 bg-stone-900 rounded-lg text-stone-300 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 'next')}
                    disabled={idx === images.length - 1}
                    className="p-1.5 bg-stone-900 rounded-lg text-stone-300 hover:text-stone-100 disabled:opacity-30"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2 bg-stone-900 border-t border-stone-800">
                <input
                  type="text"
                  value={img.altText || ''}
                  onChange={(e) => updateAltText(idx, e.target.value)}
                  placeholder="Alt description..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-[11px] text-stone-300 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
