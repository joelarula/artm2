
"use client";
import React, { useEffect } from "react";

type NavItem = { href: string; name: string; slug: string };

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
  prev?: NavItem;
  next?: NavItem;
  onNav?: (slug: string) => void;
  loading?: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({ src, alt, onClose, prev, next, onNav, loading }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleNav(slug: string) {
    if (onNav) onNav(slug);
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
          if (typeof window === 'undefined') return null;
          return createPortal(
            <div
              onClick={onClose}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
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
                {prev && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleNav(prev.slug); }}
                    style={{
                      pointerEvents: 'auto',
                      marginLeft: 24,
                      background: '#fff',
                      color: '#222',
                      borderRadius: 8,
                      fontSize: '2.2rem',
                      fontWeight: 700,
                      padding: '0.2rem 1.4rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.15s',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px #0006',
                      opacity: 0.98,
                      zIndex: 1,
                    }}
                    aria-label={`Previous: ${prev.name}`}
                  >
                    &lt;
                  </button>
                )}
                {next && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleNav(next.slug); }}
                    style={{
                      pointerEvents: 'auto',
                      marginRight: 24,
                      background: '#fff',
                      color: '#222',
                      borderRadius: 8,
                      fontSize: '2.2rem',
                      fontWeight: 700,
                      padding: '0.2rem 1.4rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.15s',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px #0006',
                      opacity: 0.98,
                      zIndex: 1,
                    }}
                    aria-label={`Next: ${next.name}`}
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>,
            document.body
          );
