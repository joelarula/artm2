"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ImageMeta } from "../../lib/imageData";

async function fetchAllPaintings(): Promise<ImageMeta[]> {
  const res = await fetch("/gallery/data/db.json");
  if (!res.ok) return [];
  const db = await res.json();
  const all: ImageMeta[] = [];
  for (const key of Object.keys(db.categories)) {
    const arrRes = await fetch(`/gallery/data/${key}.json`);
    if (!arrRes.ok) continue;
    const arr = await arrRes.json();
    if (Array.isArray(arr)) all.push(...arr);
  }
  return all;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const query = search.trim();
  const [paintings, setPaintings] = useState<ImageMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPaintings().then((all) => {
      setPaintings(all);
      setLoading(false);
    });
  }, []);

  const filtered = query
    ? paintings.filter((img) =>
        img.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

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
          placeholder="Search paintings..."
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
                Search results for: <span style={{ color: "#888" }}>{query}</span>
              </h1>
              {loading ? (
                <div>Loading...</div>
              ) : filtered.length === 0 ? (
                <div style={{ color: "#888" }}>No paintings found.</div>
              ) : (
                <>
                  <div style={{ color: "#666", fontSize: "1rem", marginBottom: 18 }}>
                    Showing first {shown} paintings of {totalMatches} matching
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: "2rem",
                    }}
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
                      // fallback to 'uncategorized' if catLink is falsy
                      if (!catLink) catLink = 'uncategorized';
                      return (
                        <Link
                          key={img.key}
                          href={`/painting/${catLink}/${img.slug}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div
                            style={{
                              border: "1px solid #eee",
                              borderRadius: 8,
                              overflow: "hidden",
                              background: "#fff",
                              boxShadow: "0 2px 8px #0001",
                              transition: "box-shadow 0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={`/gallery/data/catalog/original/${img.key}.png`}
                              alt={img.name}
                              style={{
                                width: "100%",
                                height: 180,
                                objectFit: "cover",
                                display: "block",
                                background: "#f8f8f8",
                              }}
                            />
                            <div style={{ padding: "1rem" }}>
                              <h2
                                style={{
                                  margin: 0,
                                  fontSize: "1.1rem",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  color: "#111",
                                }}
                              >
                                {img.name}
                              </h2>
                              {img.author && (
                                <div style={{ color: "#888", fontSize: "0.9rem", marginBottom: 4 }}>
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
}
