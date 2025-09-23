"use client";
import React, { useEffect, useState } from "react";
import PaintingDetailClient from "./PaintingDetailClient";
import { useMainLayout } from "../../../MainLayout";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaintingDetailPage({ params }: { params: any }) {
  // Next.js 14+ params may be a Promise; unwrap with React.use() if needed
  const resolvedParams = typeof params?.then === "function"
    ? (React.use(params) as { category: string; slug: string })
    : (params as { category: string; slug: string });
  const { category, slug } = resolvedParams;
  const { catalog } = useMainLayout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [img, setImg] = useState<any | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get all paintings in this category from catalog
  const paintings = catalog && catalog[category] && Array.isArray(catalog[category].paintings)
    ? catalog[category].paintings
    : [];

  // Find current, previous, and next paintings in this category
  const idx = paintings.findIndex((p: any) => p.link === slug);
  let prev = null, next = null, current = null;
  if (idx !== -1 && paintings.length > 0) {
    prev = idx > 0 ? paintings[idx - 1] : paintings[paintings.length - 1];
    next = idx < paintings.length - 1 ? paintings[idx + 1] : paintings[0];
    current = paintings[idx];
  }

  // Fetch image data for current slug, but keep previous img until new one is loaded
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);
    fetch(`/db/paintings/${slug}.json`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data) {
          setImg(data);
          setLoading(false);
        } else if (isMounted) {
          setError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [slug]);

  // Handler for prev/next navigation
  const handleNav = (newSlug: string) => {
    // Update URL but keep lightbox open if it was open
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (params.get('lightbox') === '1') {
      router.replace(`/painting/${category}/${newSlug}?lightbox=1`, { scroll: false });
    } else {
      router.replace(`/painting/${category}/${newSlug}`, { scroll: false });
    }
  };

  // If lightbox=1 is present, add it to prev/next/current hrefs
  const hasLightbox = searchParams.get('lightbox') === '1';
  const makeHref = (slug: string) => `/painting/${category}/${slug}` + (hasLightbox ? '?lightbox=1' : '');

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '80vh',
        justifyContent: 'center',
        color: 'var(--foreground)',
        transition: 'background 0.3s, color 0.3s',
        position: 'relative',
      }}
    >
      <PaintingDetailClient
        img={img}
        loading={loading}
        prev={prev && prev.link ? { href: makeHref(prev.link), name: String(prev.name), slug: String(prev.link), photo: prev.photo } : undefined}
        next={next && next.link ? { href: makeHref(next.link), name: String(next.name), slug: String(next.link), photo: next.photo } : undefined}
        current={current && current.link ? { href: makeHref(current.link), name: String(current.name), slug: String(current.link), photo: current.photo } : undefined}
        onNav={handleNav}
      />
      {img && (
        <>
          <h1
            style={{
              textAlign: 'center',
              margin: '0 0 0.5rem 0',
              color: 'var(--foreground)',
              textShadow: '0 2px 12px #0006',
              transition: 'color 0.3s',
              fontSize: '1.3rem',
              fontWeight: 400,
              letterSpacing: 0.1,
            }}
          >
            {img.name}
          </h1>
          <div style={{
            color: 'var(--foreground)',
            fontSize: '1.08rem',
            marginBottom: 16,
            opacity: 0.82,
            textAlign: 'center',
            fontWeight: 500,
            letterSpacing: 0.1,
          }}>{img.author}</div>
          <div style={{ width: '100%' }}>
            {img.description && <p style={{ margin: 0, color: 'var(--foreground)', opacity: 0.8 }}>{img.description}</p>}
          </div>
        </>
      )}
    </main>
  );
}