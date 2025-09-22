"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMainLayout, useBg } from "../MainLayout";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const query = search.trim();
  const { catalog } = useMainLayout();
  const { bg } = useBg();
  const isDark = bg === 'dark';
  // Flatten all paintings from catalog
  const paintings = React.useMemo(() => {
    if (!catalog) return [];
    return Object.values(catalog).flatMap((cat: any) =>
      Array.isArray(cat.paintings) ? cat.paintings.map((img: any) => ({ ...img, category: cat.link || cat.key || "uncategorized" })) : []
    );
  }, [catalog]);
  const filtered = query
    ? paintings.filter((img) =>
        img.name && img.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];
  const loading = !catalog;

  return (
    <main style={{ padding: "2rem" }}>
      <form
        onSubmit={e => e.preventDefault()}
        style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="otsi maale nime järgi"
          style={{
            width: 260,
            height: '1.7rem',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#fff',
            color: '#222',
            padding: '0 0.6rem',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: '0 1px 4px #0001',
          }}
        />
      </form>
      {query === "" ? null : (
        (() => {
          // Calculate total matches and how many are shown
          const totalMatches = paintings.filter((img) =>
            img.name.toLowerCase().includes(query.toLowerCase())
          ).length;
          const shown = Math.min(filtered.length, totalMatches);
          return (
            <>
              <h1 style={{ fontSize: "1.5rem", marginBottom: 12 }}>
                Otsingu tulemused: <span style={{ color: "#888" }}>{query}</span>
              </h1>
              {loading ? (
                <div>Loading...</div>
              ) : filtered.length === 0 ? (
                <div style={{ color: "#888" }}>No paintings found.</div>
              ) : (
                <>
                  <div style={{ color: "#666", fontSize: "1rem", marginBottom: 18 }}>
                    Kuvatakse esimesed {shown} maali. Kokku leitud {totalMatches}.
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 0fr))',
                      gap: '1.1rem',
                      justifyContent: 'center',
                      justifyItems: 'center',
                      width: '100%',
                      maxWidth: 1200,
                      margin: '0 auto',
                    }}
                    className="gallery-grid"
                  >
                    {filtered.map((img) => {
                      let catLink = 'uncategorized';
                      if (typeof img.category === 'string' && img.category) {
                        catLink = img.category;
                      } else if (img.category && typeof img.category === 'object' && typeof (img.category as any).link === 'string' && (img.category as any).link) {
                        catLink = (img.category as any).link;
                      } else if ('categoryKey' in img && typeof (img as any).categoryKey === 'string' && (img as any).categoryKey) {
                        catLink = (img as any).categoryKey;
                      }
                      if (!catLink) catLink = 'uncategorized';
                      const slug = img.link || img.slug || img.key;
                      return (
                        <Link key={img.key} href={`/painting/${catLink}/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div
                            style={{
                              border: isDark ? '1px solid #222' : '1px solid #eee',
                              borderRadius: 8,
                              overflow: 'hidden',
                              background: isDark ? '#181818' : '#fff',
                              boxShadow: isDark ? '0 2px 12px #0008' : '0 2px 8px #0001',
                              transition: 'box-shadow 0.2s',
                              cursor: 'pointer',
                              margin: '1.3rem',
                              width: 260,
                              minWidth: 260,
                              maxWidth: 260,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              src={img.photo ? (img.photo.startsWith('/') ? img.photo : `/db/photos/${img.photo}`) : `/gallery/data/catalog/original/${img.key}.png`}
                              alt={img.name}
                              style={{
                                width: 240,
                                height: 180,
                                objectFit: 'cover',
                                display: 'block',
                                background: isDark ? '#222' : '#f8f8f8',
                                filter: isDark ? 'brightness(0.92) contrast(1.08)' : undefined,
                                borderRadius: 6,
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
                                  {typeof img.author === 'string'
                                    ? img.author
                                    : (img.author && typeof (img.author as { name?: string }).name === 'string'
                                        ? (img.author as { name: string }).name
                                        : '')}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          );
        })()
      )}
    </main>
  );


