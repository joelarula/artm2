


import Link from 'next/link';

import { fetchAllImageMeta } from '../lib/imageData';
import { fetchCategories } from '../lib/categoryData';
import { headers } from 'next/headers';

export default async function PortfolioPage() {
  // For static export, do not use headers() or baseUrl logic
  const images = (await fetchAllImageMeta()).filter(img => img.published && img.imagePath);
  const categories = await fetchCategories();

  // Map categoryKey to link for each image
  const catKeyToLink = Object.fromEntries(categories.map(cat => [cat.key, cat.link]));
  return (
    <main style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'grid',
          gap: '2rem',
        }}
        className="gallery-grid"
      >
        {images.map(img => {
          // Type guards for category and author
          const getCategoryKey = (cat: any) => {
            if (typeof cat === 'string') return cat;
            if (cat && typeof cat === 'object' && 'key' in cat && typeof cat.key === 'string') return cat.key;
            return '';
          };
          const getCategoryName = (cat: any) => {
            if (typeof cat === 'string') return cat;
            if (cat && typeof cat === 'object' && 'name' in cat && typeof cat.name === 'string') return cat.name;
            return '';
          };
          const getAuthorName = (author: any) => {
            if (typeof author === 'string') return author;
            if (author && typeof author === 'object' && 'name' in author && typeof author.name === 'string') return author.name;
            return '';
          };
          const catKey = getCategoryKey(img.category);
          const catName = getCategoryName(img.category);
          const authorName = getAuthorName(img.author);
          return (
            <Link key={img.key} href={`/painting/${catKeyToLink[catKey]}/${img.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px #0001', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
                <img
                  src={`/gallery/data/catalog/original/${img.key}.png`}
                  alt={img.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '1rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.name}</h2>
                  <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: 4 }}>{authorName} &middot; {catName}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
//

 