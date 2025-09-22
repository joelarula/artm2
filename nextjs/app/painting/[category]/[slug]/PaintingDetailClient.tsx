"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ImageMeta } from '../../../../lib/imageData';

const Lightbox = dynamic(() => import("./LightboxNew"), { ssr: false });

type NavItem = { href: string; name: string; slug: string };
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
                color: 'var(--foreground, #222)',
                borderRadius: 4,
                fontSize: '1.7rem',
                padding: '0.1rem 0.7rem',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'color 0.15s, opacity 0.15s',
              }}
              aria-label={`Previous: ${prev.name}`}
            >
              &#60;
            </button>
          )}
          <div style={{ flex: 1 }} />
          {next && next.slug && (
            <button
              type="button"
              onClick={() => onNav && onNav(next.slug)}
              style={{
                background: 'transparent',
                color: 'var(--foreground, #222)',
                borderRadius: 4,
                fontSize: '1.7rem',
                padding: '0.1rem 0.7rem',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'color 0.15s, opacity 0.15s',
              }}
              aria-label={`Next: ${next.name}`}
            >
              &#62;
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