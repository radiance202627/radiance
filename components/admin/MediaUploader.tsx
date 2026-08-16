'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { uploadImageToStorage } from '@/lib/storage';

interface MediaUploaderProps {
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  folder?: string;
  multiple?: boolean;
  label?: string;
  helperText?: string;
  acceptSvg?: boolean;
  maxSizeMb?: number;
  onUploadingStateChange?: (isUploading: boolean) => void;
}

export default function MediaUploader({
  value,
  onChange,
  folder = 'products',
  multiple = false,
  label,
  helperText,
  acceptSvg = true,
  maxSizeMb = 10,
  onUploadingStateChange,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format existing value into array for easy iteration
  const imageList: string[] = Array.isArray(value)
    ? value.filter(Boolean)
    : value
    ? [value]
    : [];

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    ...(acceptSvg ? ['image/svg+xml'] : []),
  ];

  const updateUploading = (state: boolean) => {
    setUploading(state);
    if (onUploadingStateChange) onUploadingStateChange(state);
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|avif|svg)$/i)) {
      return `Invalid file format (${file.name}). Allowed formats: JPG, PNG, WEBP, AVIF${acceptSvg ? ', SVG' : ''}.`;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum size is ${maxSizeMb} MB.`;
    }
    return null;
  };

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    setSuccess(null);
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    for (const f of fileArray) {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
    }

    updateUploading(true);
    setProgress(20);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        const f = fileArray[i];
        setProgress(Math.round(((i + 1) / fileArray.length) * 80) + 10);
        const publicUrl = await uploadImageToStorage(f, 'catalog-images', folder);
        uploadedUrls.push(publicUrl);
      }

      setProgress(100);
      setSuccess(
        multiple
          ? `Successfully uploaded ${uploadedUrls.length} file(s)`
          : 'Image uploaded successfully'
      );

      if (multiple) {
        const uniqueUrls = Array.from(new Set([...imageList, ...uploadedUrls]));
        onChange(uniqueUrls);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      updateUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple) {
      const updated = imageList.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="space-y-3 font-sans">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
          {label}
        </label>
      )}

      {/* Single Mode Image Preview if value exists */}
      {!multiple && imageList.length > 0 && (
        <div className="relative bg-stone-950 border border-stone-800 rounded-xl p-3 flex items-center justify-between gap-4 group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-16 h-16 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={imageList[0]}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-stone-200 truncate">{imageList[0]}</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Uploaded to {folder}/
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg transition flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={() => handleRemove(0)}
              disabled={uploading}
              className="p-1.5 bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 rounded-lg transition"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multiple Mode Image Grid Preview */}
      {multiple && imageList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {imageList.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative bg-stone-950 border border-stone-800 rounded-xl overflow-hidden group aspect-square flex items-center justify-center"
            >
              <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-2 right-2 p-1.5 bg-stone-950/80 text-stone-300 hover:text-red-400 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Upload Zone (Shown when single image is empty or multiple mode) */}
      {(multiple || imageList.length === 0) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer relative ${
            isDragging
              ? 'border-emerald-400 bg-emerald-950/20'
              : 'border-stone-800 hover:border-amber-500/50 bg-stone-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptSvg ? 'image/*,.svg' : 'image/*'}
            onChange={(e) => handleFiles(e.target.files || [])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
              {uploading ? (
                <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-200">
                Drag & drop image here, or <span className="text-amber-400 underline">Browse Files</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Supports JPG, PNG, WEBP, AVIF{acceptSvg ? ', SVG' : ''} (Max {maxSizeMb} MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
            <span>Uploading file to {folder}...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && !uploading && (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {helperText && <p className="text-[11px] text-stone-500">{helperText}</p>}
    </div>
  );
}
