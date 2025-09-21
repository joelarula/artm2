

import { fetchAllImageMeta } from '../../../lib/imageData';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  let baseUrl: string | undefined = undefined;
  if (typeof window === 'undefined') {
    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'http';
    if (host) baseUrl = `${proto}://${host}`;
  }
  const images = await fetchAllImageMeta(baseUrl);
  return images.map(img => ({ id: img.slug }));
}

export default async function PaintingDetailPage({ params }: { params: { id: string } }) {
  let baseUrl: string | undefined = undefined;
  if (typeof window === 'undefined') {
    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'http';
    if (host) baseUrl = `${proto}://${host}`;
  }
  const images = await fetchAllImageMeta(baseUrl);
  const img = images.find(img => img.slug === params.id);
  if (!img) return notFound();

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '80vh',
        justifyContent: 'center',
        background: '#c0c0c0',
        color: '#222',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ textAlign: 'center', margin: 0 }}>{img.name}</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={`/gallery/data/catalog/original/${img.key}.png`}
          alt={img.name}
          style={{ maxWidth: '100%', maxHeight: 600, borderRadius: 12, boxShadow: '0 2px 16px #0002', marginBottom: 24 }}
        />
        <div style={{ width: '100%', marginTop: 16 }}>
          <div style={{ color: '#444', fontSize: '1rem', marginBottom: 8 }}>{img.author} &middot; {img.category}</div>
          {img.description && <p style={{ margin: 0 }}>{img.description}</p>}
        </div>
      </div>
    </main>
  );
}
