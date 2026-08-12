'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Large Main Display Image */}
      <div
        className="relative aspect-square bg-brand-slate rounded border border-brand-border overflow-hidden cursor-zoom-in group"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={selectedImage || 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop'}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className={`object-cover object-center transition-transform duration-500 ${
            isZoomed ? 'scale-150' : 'group-hover:scale-105'
          }`}
        />
        <div className="absolute bottom-3 right-3 z-10 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4" />
        </div>
      </div>

      {/* Thumbnail Gallery Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 aspect-square rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedImage === img
                  ? 'border-brand-brass shadow-md scale-95'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
