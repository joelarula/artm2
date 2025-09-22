"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Lightbox({ src, alt, onClose, prev, next, current }: {
  src: string;
  alt: string;
  onClose: () => void;
  prev?: { href: string; name: string };
  next?: { href: string; name: string };
  current?: { href: string; name: string };
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const router = useRouter();

  function handleNav(href: string) {
    router.push(href);
  }

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
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 10001,
      }}>
        {prev && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); handleNav(prev.href + (prev.href.includes('?') ? '&' : '?') + 'lightbox=1'); }}
            style={{
              pointerEvents: 'auto',
              marginLeft: 12,
              background: 'rgba(255,255,255,0.13)',
              color: '#eee',
              borderRadius: 8,
              fontSize: '1.4rem',
              fontWeight: 500,
              padding: '0.1rem 0.7rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.15s',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              opacity: 0.7,
            }}
            aria-label={`Previous: ${prev.name}`}
          >
            &lt;
          </button>
        )}
        {next && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); handleNav(next.href + (next.href.includes('?') ? '&' : '?') + 'lightbox=1'); }}
            style={{
              pointerEvents: 'auto',
              marginRight: 12,
              background: 'rgba(255,255,255,0.13)',
              color: '#eee',
              borderRadius: 8,
              fontSize: '1.4rem',
              fontWeight: 500,
              padding: '0.1rem 0.7rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.15s',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              opacity: 0.7,
            }}
            aria-label={`Next: ${next.name}`}
          >
            &gt;
          </button>
        )}
      </div>
      {current && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); handleNav(current.href + (current.href.includes('?') ? '&' : '?') + 'lightbox=1'); }}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 32,
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            borderRadius: 8,
            fontSize: '1.1rem',
            fontWeight: 500,
            padding: '0.4rem 1.3rem',
            textDecoration: 'none',
            zIndex: 10002,
            pointerEvents: 'auto',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label={`Go to detail page for ${current.name}`}
        >
          {current.name}
        </button>
      )}
    </div>
  );
}
