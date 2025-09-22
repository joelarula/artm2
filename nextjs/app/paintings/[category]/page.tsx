"use client";
import React from "react";
import GalleryCategoryClient from "./GalleryCategoryClient";
import { useMainLayout } from "../../MainLayout";

export default function GalleryCategoryPage({ params }: { params: { category: string } }) {
  const { catalog } = useMainLayout();
  if (!catalog) {
    return <div style={{ color: '#888', textAlign: 'center', marginTop: 80 }}>Loading…</div>;
  }
  const cat = catalog[params.category];
  if (!cat) {
    return <div style={{ color: '#888', textAlign: 'center', marginTop: 80 }}>Category not found</div>;
  }
  const images = Array.isArray(cat.paintings) ? cat.paintings : [];
  return <GalleryCategoryClient images={images} cat={cat} />;
}
