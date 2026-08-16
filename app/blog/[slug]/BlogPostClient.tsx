'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Twitter,
  Linkedin,
  MessageSquare,
  List,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface BlogPostClientProps {
  post: any;
  relatedPosts: any[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const BlogPostClient: React.FC<BlogPostClientProps> = ({ post, relatedPosts }) => {
  const [copied, setCopied] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);

  // Parse headings from markdown content to construct Table of Contents
  useEffect(() => {
    if (!post.content) return;
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      items.push({ id, text, level });
    }
    setToc(items);
  }, [post.content]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.category || 'Articles', href: `/blog?category=${encodeURIComponent(post.category || '')}` },
          { label: post.title },
        ]}
      />

      {/* Article Header & Hero */}
      <header className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F4F2ED] border border-[#E5E2DA] rounded-full text-[#B08D57]">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            {post.category || 'Architectural Hardware'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#222222] tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-3xl mx-auto">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-center gap-6 pt-4 border-t border-b border-[#E5E2DA] py-4 text-xs text-[#666666]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#B08D57]" />
            <span className="font-semibold text-[#222222]">{post.author || 'SB Pattern Works'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#B08D57]" />
            <span>{new Date(post.publishDate || post.createdAt).toLocaleDateString()}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B08D57]" />
            <span>{post.readingTime || '5 min read'}</span>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      {post.featuredImage && (
        <div className="max-w-5xl mx-auto relative h-[300px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#E5E2DA] shadow-sm bg-[#FAF9F6]">
          <Image
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Article Content Layout: Sidebar Table of Contents + Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
        {/* Left Sticky Sidebar: Table of Contents & Share */}
        <aside className="lg:col-span-4 space-y-6 sticky top-28 hidden lg:block">
          {toc.length > 0 && (
            <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#E5E2DA] pb-3 text-[#B08D57]">
                <List className="w-4 h-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#222222]">
                  Table of Contents
                </h4>
              </div>
              <nav className="space-y-2 text-xs">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block transition-colors hover:text-[#B08D57] ${
                      item.level === 3 ? 'pl-4 text-[#666666]' : 'font-medium text-[#222222]'
                    }`}
                  >
                    • {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Share Box */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57]">
              Share Article
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#222222] hover:bg-[#E5E2DA] transition flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-[#666666] hover:text-[#222222] transition"
                title="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-[#666666] hover:text-[#222222] transition"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* Right Main Article Content */}
        <main className="lg:col-span-8 space-y-8">
          {/* Mobile TOC Accordion */}
          {toc.length > 0 && (
            <div className="lg:hidden bg-[#F4F2ED] p-5 rounded-2xl border border-[#E5E2DA] space-y-3">
              <span className="text-xs font-semibold text-[#B08D57] uppercase tracking-wider block">
                Article Outline
              </span>
              <div className="space-y-1.5 text-xs text-[#666666]">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="block py-1">
                    • {item.text}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Rendered Article Body */}
          <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-[#222222] leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph: string, idx: number) => {
              const trimmed = paragraph.trim();

              if (trimmed.startsWith('### ')) {
                const headingText = trimmed.replace('### ', '');
                const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <h3 key={idx} id={id} className="text-lg font-serif font-bold text-[#222222] pt-4 scroll-mt-28">
                    {headingText}
                  </h3>
                );
              }

              if (trimmed.startsWith('## ')) {
                const headingText = trimmed.replace('## ', '');
                const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <h2 key={idx} id={id} className="text-xl font-serif font-bold text-[#222222] pt-6 border-b border-[#E5E2DA] pb-2 scroll-mt-28">
                    {headingText}
                  </h2>
                );
              }

              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const items = trimmed.split('\n').map((li) => li.replace(/^[-*]\s+/, ''));
                return (
                  <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-[#666666]">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (trimmed.startsWith('```')) {
                const codeLines = trimmed.replace(/```[a-z]*/g, '').trim();
                return (
                  <pre key={idx} className="p-4 bg-[#222222] text-[#FAF9F6] rounded-xl overflow-x-auto text-xs font-mono">
                    <code>{codeLines}</code>
                  </pre>
                );
              }

              return (
                <p key={idx} className="text-[#666666] leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="pt-6 border-t border-[#E5E2DA] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#B08D57] uppercase tracking-wider mr-2">
                Article Tags:
              </span>
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-[#F4F2ED] border border-[#E5E2DA] rounded-full text-xs text-[#666666] hover:text-[#222222] transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Card */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] flex flex-col sm:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#B08D57]/15 border border-[#B08D57]/30 flex items-center justify-center text-[#B08D57] shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif font-bold text-base text-[#222222]">
                Written by {post.author || 'SB Pattern Works'}
              </h4>
              <p className="text-xs text-[#666666]">
                Technical metallurgical team and hardware specification division at SB PATTERN WORKS, Aligarh, India.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="pt-12 border-t border-[#E5E2DA] space-y-8 max-w-6xl mx-auto">
          <SectionHeading
            title="Related Articles"
            subtitle="Explore more technical insights from our metallurgy and hardware journal"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rel) => (
              <article
                key={rel.id}
                className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-sm flex flex-col group hover:border-[#B08D57]/50 transition"
              >
                <div className="relative h-40 w-full bg-[#FAF9F6]">
                  <Image
                    src={rel.featuredImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'}
                    alt={rel.imageAlt || rel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#222222] group-hover:text-[#B08D57] transition line-clamp-2">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-xs font-semibold text-[#B08D57] uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
