"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ImageMeta } from '../../../../lib/imageData';

const Lightbox = dynamic(() => import("./LightboxNew"), { ssr: false });

type NavItem = { href: string; name: string; slug: string; photo?: string };
export default function PaintingDetailClient({ img, prev, next, current, onNav, lightboxOpen, loading }: {
  img: ImageMeta;
  prev?: NavItem;
  next?: NavItem;
  current?: NavItem;
  onNav?: (slug: string) => void;
  lightboxOpen?: boolean;
  loading?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // When closing, remove ?lightbox=1 from URL
  function handleClose() {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('lightbox');
    router.replace('?' + params.toString(), { scroll: false });
  }

  // Debug: log prev and next props
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('PaintingDetailClient nav debug:', { prev, next, current, img });
  }
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%' }}>
        {img ? (
          <img
            src={img.photo?.startsWith('/') ? img.photo : `/db/photos/${img.photo}`}
            alt={img.name}
            style={{
              maxWidth: '100%',
              maxHeight: '62vh',
              borderRadius: 12,
              boxShadow: '0 2px 16px #0002',
              marginBottom: 16,
              cursor: 'zoom-in',
              objectFit: 'contain',
              display: 'block',
            }}
            onClick={() => {
              const params = new URLSearchParams(Array.from(searchParams.entries()));
              params.set('lightbox', '1');
              router.replace('?' + params.toString(), { scroll: false });
            }}
          />
        ) : null}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          {prev && prev.slug && (
            <button
              type="button"
              onClick={() => onNav && onNav(prev.slug)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                opacity: 0.85,
                borderRadius: 8,
                boxShadow: '0 1px 6px #0002',
                transition: 'box-shadow 0.15s, opacity 0.15s',
                minWidth: 64,
                minHeight: 64,
              }}
              aria-label={`Previous: ${prev.name}`}
            >
              {prev.photo ? (
                <img
                  src={prev.photo.startsWith('/') ? prev.photo : `/db/photos/${prev.photo}`}
                  alt={prev.name}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '2px solid #ccc', background: '#fff' }}
                />
              ) : (
                <span style={{ fontSize: '2rem', color: 'var(--foreground, #222)' }}>&#60;</span>
              )}
            </button>
          )}
          <div style={{ flex: 1 }} />
          {next && next.slug && (
            <button
              type="button"
              onClick={() => onNav && onNav(next.slug)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                opacity: 0.85,
                borderRadius: 8,
                boxShadow: '0 1px 6px #0002',
                transition: 'box-shadow 0.15s, opacity 0.15s',
                minWidth: 64,
                minHeight: 64,
              }}
              aria-label={`Next: ${next.name}`}
            >
              {next.photo ? (
                <img
                  src={next.photo.startsWith('/') ? next.photo : `/db/photos/${next.photo}`}
                  alt={next.name}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '2px solid #ccc', background: '#fff' }}
                />
              ) : (
                <span style={{ fontSize: '2rem', color: 'var(--foreground, #222)' }}>&#62;</span>
              )}
            </button>
          )}
        </div>
      </div>
      {searchParams.get('lightbox') === '1' && img && (
        <Lightbox
          src={img.photo?.startsWith('/') ? img.photo : `/db/photos/${img.photo}`}
          alt={img.name}
          title={img.name}
          onClose={handleClose}
          prev={prev}
          next={next}
          onNav={onNav}
          loading={loading}
        />
      )}
    </>
  );
}