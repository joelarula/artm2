"use client";
import React, { useState } from 'react';
import { useBg } from '../../MainLayout';
import Link from 'next/link';
import type { Category } from '../../../lib/categoryData';
import type { ImageMeta } from '../../../lib/imageData';

interface GalleryCategoryClientProps {
  images: ImageMeta[];
  cat: Category;
}

export default function GalleryCategoryClient({ images, cat }: GalleryCategoryClientProps) {
  const { bg } = useBg();
  const isDark = bg === 'dark';
  return (
    <main style={{ padding: '2rem', background: isDark ? '#111' : undefined }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
      }}>
        {images.length === 0 && <div style={{gridColumn: '1/-1', textAlign: 'center', color: isDark ? '#aaa' : '#888'}}>No images in this category.</div>}
        {images.map((img: ImageMeta) => (
          <Link key={img.key} href={`/painting/${cat.link}/${img.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{
                border: isDark ? '1px solid #222' : '1px solid #eee',
                borderRadius: 8,
                overflow: 'hidden',
                background: isDark ? '#181818' : '#fff',
                boxShadow: isDark ? '0 2px 12px #0008' : '0 2px 8px #0001',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
              }}
            >
              <img
                src={`/gallery/data/catalog/original/${img.key}.png`}
                alt={img.name}
                style={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  display: 'block',
                  background: isDark ? '#222' : '#f8f8f8',
                  filter: isDark ? 'brightness(0.92) contrast(1.08)' : undefined,
                }}
              />
              <div style={{ padding: '1rem' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: isDark ? '#fff' : '#111',
                    textShadow: isDark ? '0 1px 4px #000b' : undefined,
                  }}
                >
                  {img.name}
                </h2>
                  {img.author && (
                    <div style={{ color: isDark ? '#aaa' : '#888', fontSize: '0.9rem', marginBottom: 4 }}>
                      {img.author}
                    </div>
                  )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
