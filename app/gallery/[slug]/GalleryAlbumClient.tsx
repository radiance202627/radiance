'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Images,
  ArrowLeft,
  Maximize2,
} from 'lucide-react';

interface GalleryAlbumClientProps {
  album: any;
}

export const GalleryAlbumClient: React.FC<GalleryAlbumClientProps> = ({ album }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const items = album.items || [];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === 0 ? items.length - 1 : prev! - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! === items.length - 1 ? 0 : prev! + 1));
    setIsZoomed(false);
  };

  // Keyboard Navigation Support (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      <Breadcrumbs
        items={[
          { label: 'Gallery', href: '/gallery' },
          { label: album.category || 'Albums', href: `/gallery?category=${encodeURIComponent(album.category || '')}` },
          { label: album.title },
        ]}
      />

      {/* Album Header */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-8 sm:p-10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF9F6] text-[#B08D57] border border-[#B08D57]/30 rounded-md">
            <Images className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              {album.category || 'Manufacturing'}
            </span>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#666666] hover:text-[#222222] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Albums</span>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#222222]">
          {album.title}
        </h1>

        {album.description && (
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-4xl">
            {album.description}
          </p>
        )}

        <div className="pt-2 text-xs font-semibold text-[#B08D57] uppercase tracking-wider">
          Total Photographs: {items.length}
        </div>
      </div>

      {/* Photo Grid */}
      {items.length === 0 ? (
        <div className="py-16 text-center bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] text-xs text-[#666666]">
          No images uploaded for this album yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              onClick={() => handleOpenLightbox(idx)}
              className="bg-[#F4F2ED] rounded-xl border border-[#E5E2DA] overflow-hidden shadow-sm group cursor-pointer relative aspect-square flex flex-col justify-end"
            >
              <Image
                src={item.url}
                alt={item.altText || item.title || album.title}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-white space-y-1">
                  <p className="text-xs font-semibold truncate">{item.title || `Photo ${idx + 1}`}</p>
                  {item.caption && <p className="text-[10px] text-gray-300 line-clamp-1">{item.caption}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Lightbox Overlay */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8">
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-xs font-mono font-medium tracking-wider text-gray-300">
              Image {lightboxIndex + 1} of {items.length}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                title="Toggle Zoom"
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                onClick={handleCloseLightbox}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Displayed Image with Zoom */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 z-20 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition"
              title="Previous (ArrowLeft)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              className={`relative max-w-full max-h-full transition-transform duration-300 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={items[lightboxIndex].url}
                alt={items[lightboxIndex].altText || album.title}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 z-20 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition"
              title="Next (ArrowRight)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Caption Bar */}
          <div className="text-center text-white space-y-1 max-w-2xl mx-auto z-10">
            {items[lightboxIndex].title && (
              <h3 className="font-serif font-bold text-sm tracking-wide text-white">
                {items[lightboxIndex].title}
              </h3>
            )}
            {items[lightboxIndex].caption && (
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                {items[lightboxIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
