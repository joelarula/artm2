"use client";
import React from 'react';
import Link from 'next/link';
import type { Category } from '../../../lib/categoryData';
import type { ImageMeta } from '../../../lib/imageData';

interface GalleryCategoryClientProps {
  images: ImageMeta[];
  cat: Category;
}

export default function GalleryCategoryClient({ images, cat }: GalleryCategoryClientProps) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{cat.name}</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
      }}>
        {images.length === 0 && <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#888'}}>No images in this category.</div>}
        {images.map((img: ImageMeta) => (
          <Link key={img.key} href={`/painting/${img.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px #0001', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
              <img
                src={`/gallery/data/catalog/original/${img.key}.png`}
                alt={img.name}
                style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.name}</h2>
                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: 4 }}>{img.author} &middot; {img.category}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
