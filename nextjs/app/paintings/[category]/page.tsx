"use client";
import React from "react";
import GalleryCategoryClient from "./GalleryCategoryClient";
import { useMainLayout } from "../../MainLayout";

export default function GalleryCategoryPage({ params }: { params: any }) {
  // Next.js 14+ params may be a Promise; unwrap with React.use() if needed
  const resolvedParams = typeof params?.then === "function"
    ? (React.use(params) as { category: string })
    : (params as { category: string });
  const { category } = resolvedParams;
  const { catalog } = useMainLayout();
  if (!catalog) {
    return <div style={{ color: '#888', textAlign: 'center', marginTop: 80 }}>Loading…</div>;
  }
  const cat = catalog[category];
  if (!cat) {
    return <div style={{ color: '#888', textAlign: 'center', marginTop: 80 }}>Category not found</div>;
  }
  const images = Array.isArray(cat.paintings) ? cat.paintings : [];
  return <GalleryCategoryClient images={images} cat={cat} />;
}
