"use client";

import { useMainLayout } from "./MainLayout";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GalleryThumbnails() {
  const { catalog } = useMainLayout();
  const [menu, setMenu] = useState<any>(null);

  useEffect(() => {
    fetch("/db/menu.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMenu(data));
  }, []);

  if (!catalog || !menu) return null;

  // Get all published/exposed galleries from menu.json
  const galleries = Object.entries(menu)
    .map(([link, value]: [string, any]) => ({ key: value.key || link, link, ...value }))
    .filter((cat) => cat.published || cat.exposed);

  function getRandomPainting(paintings: any[]) {
    if (!paintings || paintings.length === 0) return null;
    return paintings[Math.floor(Math.random() * paintings.length)];
  }

  return (
    <div
      style={{
        display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "40px 40px",
  justifyItems: "center",
  alignItems: "start",
  maxWidth: 600,
  margin: "2.5rem auto 2.5rem auto",
      }}
    >
      {galleries.map((gallery) => {
        // Find the corresponding catalog category by link or key
        const cat = catalog[gallery.link] || Object.values(catalog).find((c: any) => c.key === gallery.key);
        if (!cat || !Array.isArray(cat.paintings) || cat.paintings.length === 0) return null;
        const painting = getRandomPainting(cat.paintings);
        if (!painting) return null;
        // Use the "photo" field for the image filename, fallback to key if missing
        const photoFile = painting.photo || `${painting.key}.png`;
        return (
          <Link
            key={gallery.key}
            href={`/painting/${gallery.link}/${painting.link}`}
            style={{ textDecoration: "none", color: "inherit", width: 200, display: "block" }}
          >
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 2px 12px #0001",
                transition: "box-shadow 0.2s",
                cursor: "pointer",
                border: "1px solid transparent",
                width: 200,
              }}
            >
              <img
                src={`/db/photos/${photoFile}`}
                alt={painting.name}
                style={{ width: "100%", height: 150, objectFit: "cover", display: "block", background: "#eee" }}
              />
              <div style={{ padding: "0.5rem 0.7rem", textAlign: "center" }}>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  {gallery.name}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
