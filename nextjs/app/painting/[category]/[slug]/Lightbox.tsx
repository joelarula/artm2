"use client";
import React, { useEffect } from "react";

export default function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
        transition: "background 0.2s",
      }}
      aria-modal="true"
      tabIndex={-1}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: "98vw",
          maxHeight: "96vh",
          boxShadow: "0 4px 32px #000a",
          borderRadius: 12,
          background: "#222",
          objectFit: "contain",
        }}
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 24,
          right: 32,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: "1.5rem",
          padding: "0.3rem 1.1rem",
          cursor: "pointer",
          zIndex: 10000,
        }}
        aria-label="Close lightbox"
      >
        ×
      </button>
    </div>
  );
}
