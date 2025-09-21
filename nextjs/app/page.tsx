


import Link from 'next/link';

import { fetchAllImageMeta } from '../lib/imageData';
import { fetchCategories } from '../lib/categoryData';
import { headers } from 'next/headers';

export default async function PortfolioPage() {
  // For static export, do not use headers() or baseUrl logic
  const images = (await fetchAllImageMeta()).filter(img => img.published && img.imagePath);
  const categories = await fetchCategories();

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Artmoments</h1>
      <nav style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <Link
            key={cat.key}
            href={cat.link}
            style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: 500,
              fontSize: '1.1rem',
              padding: '0.5rem 1.2rem',
              borderRadius: 20,
              background: '#f5f5f5',
              border: '1px solid #e0e0e0',
              transition: 'background 0.2s',
              marginBottom: '0.5rem',
              display: 'inline-block',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </nav>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
      }}>
        {images.map(img => (
          <Link key={img.key} href={`/painting/${img.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px #0001', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
              <img
                src={`/gallery/data/catalog/original/${img.key}.png`}
                alt={img.name}
                style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.name}</h2>
                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: 4 }}>{img.author} &middot; {img.category}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
//

 