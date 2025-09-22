"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type NavItem = { href: string; name: string; slug: string };

interface LightboxProps {
  src: string;
  alt: string;
  title?: string;
  onClose: () => void;
  prev?: NavItem;
  next?: NavItem;
  onNav?: (slug: string) => void;
  loading?: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({ src, alt, title, onClose, prev, next, onNav, loading }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Only render portal on client
  if (typeof window === 'undefined' || !document.body) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        zIndex: 10000,
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
      role="dialog"
      tabIndex={-1}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
          minHeight: 0,
          maxWidth: "98vw",
          maxHeight: "96vh",
        }}
        onClick={e => e.stopPropagation()}
      >
        {loading ? (
          <div style={{
            color: "#fff",
            fontSize: "1.3rem",
            padding: "2.5rem 3.5rem",
            background: "#222",
            borderRadius: 12,
          }}>
            Loading…
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: "98vw",
                maxHeight: "88vh",
                boxShadow: "0 4px 32px #000a",
                borderRadius: 12,
                background: "#222",
                objectFit: "contain",
                display: 'block',
                marginTop: 28, // add top margin
                marginBottom: 70, // more space for title overlay
              }}
              onClick={e => e.stopPropagation()}
            />
            {/* Painting title over the image, just above the bottom edge */}
            {title && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 38, // more space between image and title
                  transform: 'translateX(-50%)',
                  color: '#fff',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  textShadow: '0 2px 12px #000a',
                  background: 'rgba(0,0,0,0.32)',
                  borderRadius: 8,
                  padding: '0.25em 1.2em',
                  maxWidth: '80vw',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  display: 'inline-block',
                  pointerEvents: 'auto',
                }}
              >
                {title}
              </div>
            )}
          </div>
        )}
      </div>
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
          zIndex: 10001,
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
        zIndex: 10002,
      }}>
        {/* Left gradient overlay for prev button */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 80,
          height: '100%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 70%, transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        {/* Right gradient overlay for next button */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 80,
          height: '100%',
          background: 'linear-gradient(270deg, rgba(0,0,0,0.55) 70%, transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        {prev && prev.slug && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onNav && onNav(prev.slug); }}
            style={{
              pointerEvents: 'auto',
              marginLeft: 16,
              background: 'transparent',
              color: 'var(--foreground, #222)',
              borderRadius: 4,
              fontSize: '1.5rem',
              fontWeight: 600,
              padding: '0.1rem 0.7rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              opacity: 0.85,
              zIndex: 1,
              backgroundClip: 'padding-box',
              transition: 'color 0.15s, opacity 0.15s',
            }}
            aria-label={`Previous: ${prev.name}`}
            tabIndex={0}
          >
            &lt;
          </button>
        )}
        {next && next.slug && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onNav && onNav(next.slug); }}
            style={{
              pointerEvents: 'auto',
              marginRight: 16,
              background: 'transparent',
              color: 'var(--foreground, #222)',
              borderRadius: 4,
              fontSize: '1.5rem',
              fontWeight: 600,
              padding: '0.1rem 0.7rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              opacity: 0.85,
              zIndex: 1,
              backgroundClip: 'padding-box',
              transition: 'color 0.15s, opacity 0.15s',
            }}
            aria-label={`Next: ${next.name}`}
            tabIndex={0}
          >
            &gt;
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;