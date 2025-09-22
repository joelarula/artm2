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

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {img ? (
          <img
            src={img.photo?.startsWith('/') ? img.photo : `/db/photos/${img.photo}`}
            alt={img.name}
            style={{ maxWidth: '100%', maxHeight: 600, borderRadius: 12, boxShadow: '0 2px 16px #0002', marginBottom: 24, cursor: 'zoom-in' }}
            onClick={() => {
              const params = new URLSearchParams(Array.from(searchParams.entries()));
              params.set('lightbox', '1');
              router.replace('?' + params.toString(), { scroll: false });
            }}
          />
        ) : null}
      </div>
      {searchParams.get('lightbox') === '1' && img && (
        <Lightbox
          src={img.photo?.startsWith('/') ? img.photo : `/db/photos/${img.photo}`}
          alt={img.name}
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