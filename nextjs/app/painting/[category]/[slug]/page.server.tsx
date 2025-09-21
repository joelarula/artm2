import { fetchAllImageMeta, ImageMeta } from '../../../../lib/imageData';
import { fetchCategories } from '../../../../lib/categoryData';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const images = await fetchAllImageMeta();
  const params = images.map(img => {
    let categoryLink = '';
    const cat = img.category;
    if (cat && typeof cat === 'object' && cat !== null && 'link' in cat && typeof (cat as any).link === 'string') {
      categoryLink = (cat as any).link;
    } else if (typeof cat === 'string') {
      // fallback: try to use the string directly
      categoryLink = cat;
    }
    if (typeof categoryLink !== 'string' || typeof img.slug !== 'string' || !categoryLink || !img.slug) {
      // eslint-disable-next-line no-console
      console.warn('Skipping invalid static param:', { category: categoryLink, slug: img.slug, img });
      return null;
    }
    return { category: categoryLink, slug: img.slug };
  }).filter(Boolean);
  // eslint-disable-next-line no-console
  console.log('Static params for painting detail:', params);
  return params;
}


export default async function PaintingDetailPage(props: { params: { category: string; slug: string } }) {
  // Await props to ensure params is available for static export
  const { params } = await Promise.resolve(props);
  const { category, slug } = params;
  const images: ImageMeta[] = await fetchAllImageMeta();
  // Try to match by category link (not key) and slug
  const img = images.find(img => {
    let imgCategoryLink = '';
    const cat = img.category;
    if (cat && typeof cat === 'object' && cat !== null && 'link' in cat && typeof (cat as any).link === 'string') {
      imgCategoryLink = (cat as any).link;
    }
    // fallback: try categoryKey if link is missing
    if (!imgCategoryLink && 'categoryKey' in img && typeof (img as any).categoryKey === 'string') {
      imgCategoryLink = (img as any).categoryKey;
    }
    return img.slug === slug && imgCategoryLink === category;
  });
  if (!img) return notFound();

  function getNameField(val: unknown): string {
    if (val && typeof val === 'object' && val !== null && 'name' in val && typeof (val as any).name === 'string') {
      return (val as any).name;
    }
    if (typeof val === 'string') return val;
    return '';
  }
  // Defensive: if author/category are objects, get their .name, else string or empty
  const author = getNameField(img.author);
  const categoryName = getNameField(img.category);

  // Find all paintings in this gallery (category)
  const galleryImages = images.filter(gimg => {
    let gcat = gimg.category;
    let gcatLink = '';
    if (gcat && typeof gcat === 'object' && gcat !== null && 'link' in gcat && typeof (gcat as any).link === 'string') {
      gcatLink = (gcat as any).link;
    }
    if (!gcatLink && 'categoryKey' in gimg && typeof (gimg as any).categoryKey === 'string') {
      gcatLink = (gimg as any).categoryKey;
    }
    return gcatLink === category;
  });
  // Find current index
  const currentIdx = galleryImages.findIndex(gimg => gimg.slug === slug);
  let prevIdx = currentIdx - 1;
  let nextIdx = currentIdx + 1;
  if (prevIdx < 0) prevIdx = galleryImages.length - 1;
  if (nextIdx >= galleryImages.length) nextIdx = 0;
  const prevPainting = galleryImages[prevIdx];
  const nextPainting = galleryImages[nextIdx];

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
        color: 'var(--foreground)',
        transition: 'background 0.3s, color 0.3s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={`/gallery/data/catalog/original/${img.key}.png`}
          alt={img.name}
          style={{ maxWidth: '100%', maxHeight: 600, borderRadius: 12, boxShadow: '0 2px 16px #0002', marginBottom: 24 }}
        />
        <h1
          style={{
            textAlign: 'center',
            margin: '0 0 0.5rem 0',
            color: 'var(--foreground)',
            textShadow: '0 2px 12px #0006',
            transition: 'color 0.3s',
            fontSize: '2.1rem',
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          {img.name}
        </h1>
        <div style={{
          color: 'var(--foreground)',
          fontSize: '1.08rem',
          marginBottom: 16,
          opacity: 0.82,
          textAlign: 'center',
          fontWeight: 500,
          letterSpacing: 0.1,
        }}>{author} &middot; {categoryName}</div>
        <div style={{ width: '100%' }}>
          {img.description && <p style={{ margin: 0, color: 'var(--foreground)', opacity: 0.8 }}>{img.description}</p>}
        </div>
      </div>
      {/* Navigation links */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 24,
        padding: '0 1rem',
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          {prevPainting && (
            <a
              href={`/painting/${category}/${prevPainting.slug}`}
              style={{
                textDecoration: 'none',
                color: 'var(--foreground)',
                fontWeight: 600,
                fontSize: '1.7rem',
                width: 54,
                height: 54,
                borderRadius: 14,
                background: '#e5e5e7',
                boxShadow: '0 2px 8px #0001',
                opacity: 0.92,
                position: 'relative',
                transition: 'background 0.18s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
                border: '2px solid #c2c2c7',
              }}
              aria-label={`Previous: ${prevPainting.name}`}
            >
              <span aria-hidden="true" style={{fontSize:'2.2rem',lineHeight:1, fontWeight:700, fontFamily:'inherit'}}>&lt;</span>
              <span
                style={{
                  position: 'absolute',
                  left: '110%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px #0002',
                  fontSize: '1rem',
                  fontWeight: 500,
                  opacity: 0,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  transition: 'opacity 0.18s',
                }}
                className="prev-tooltip"
              >
                {prevPainting.name}
              </span>
              <style>{`
                a:hover .prev-tooltip { opacity: 1; pointer-events: auto; }
              `}</style>
            </a>
          )}
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          {nextPainting && (
            <a
              href={`/painting/${category}/${nextPainting.slug}`}
              style={{
                textDecoration: 'none',
                color: 'var(--foreground)',
                fontWeight: 600,
                fontSize: '1.7rem',
                width: 54,
                height: 54,
                borderRadius: 14,
                background: '#e5e5e7',
                boxShadow: '0 2px 8px #0001',
                opacity: 0.92,
                position: 'relative',
                transition: 'background 0.18s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
                border: '2px solid #c2c2c7',
              }}
              aria-label={`Next: ${nextPainting.name}`}
            >
              <span aria-hidden="true" style={{fontSize:'2.2rem',lineHeight:1, fontWeight:700, fontFamily:'inherit'}}>&gt;</span>
              <span
                style={{
                  position: 'absolute',
                  right: '110%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px #0002',
                  fontSize: '1rem',
                  fontWeight: 500,
                  opacity: 0,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  transition: 'opacity 0.18s',
                }}
                className="next-tooltip"
              >
                {nextPainting.name}
              </span>
              <style>{`
                a:hover .next-tooltip { opacity: 1; pointer-events: auto; }
              `}</style>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
