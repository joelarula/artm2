"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ImageMeta } from '../../../../lib/imageData';

const Lightbox = dynamic(() => import("./LightboxNew"), { ssr: false });

export default function PaintingDetailClient({ img, prev, next, current }: {
  img: ImageMeta;
  prev?: { href: string; name: string };
  next?: { href: string; name: string };
  current?: { href: string; name: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Open lightbox if ?lightbox=1 is present
  useEffect(() => {
    if (searchParams.get('lightbox') === '1') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchParams]);

  // When closing, remove ?lightbox=1 from URL
  function handleClose() {
    setOpen(false);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('lightbox');
    router.replace('?' + params.toString(), { scroll: false });
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={`/gallery/data/catalog/original/${img.key}.png`}
          alt={img.name}
          style={{ maxWidth: '100%', maxHeight: 600, borderRadius: 12, boxShadow: '0 2px 16px #0002', marginBottom: 24, cursor: 'zoom-in' }}
          onClick={() => {
            const params = new URLSearchParams(Array.from(searchParams.entries()));
            params.set('lightbox', '1');
            router.replace('?' + params.toString(), { scroll: false });
            setOpen(true);
          }}
        />
      </div>
      {open && (
        <Lightbox
          src={`/gallery/data/catalog/original/${img.key}.png`}
          alt={img.name}
          onClose={handleClose}
          prev={prev}
          next={next}
          current={current}
        />
      )}
    </>
  );
}