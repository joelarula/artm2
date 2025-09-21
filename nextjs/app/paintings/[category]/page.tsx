import type { Category } from '../../../lib/categoryData';
import type { ImageMeta } from '../../../lib/imageData';
// Make sure GalleryCategoryClient.tsx exists in the same folder as this file.
// If it exists elsewhere, update the import path accordingly.
// Make sure the following import path is correct and the file exists.
// If GalleryCategoryClient.tsx is in a different folder, update the path accordingly.
import GalleryCategoryClient from './GalleryCategoryClient';
import { fetchCategories } from '../../../lib/categoryData';
import { slugify } from '../../../lib/imageData';

// SSG: generate all category params
export async function generateStaticParams() {
  const categories = await fetchCategories();
  return categories.map((cat: Category) => ({ category: cat.link }));
}


export default async function GalleryCategoryPage(props: { params: { category: string } }) {
  const { params } = await Promise.resolve(props);
  const categories = await fetchCategories();
  const cat = categories.find((c: Category) => c.link === params.category);
  if (!cat) {
    return <div style={{ color: '#888', textAlign: 'center', marginTop: 80 }}>Category not found</div>;
  }
  // Fetch painting references for this category from /gallery/data/[KEY].json
  let images: any[] = [];
  try {
    // Use absolute URL for server-side fetch
    function getUrl(path: string) {
      if (typeof window === 'undefined') {
        return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + path;
      }
      return path;
    }
    const res = await fetch(getUrl(`/gallery/data/${cat.key}.json`));
    if (res.ok) {
      images = await res.json();
    }
  } catch (e) {
    // ignore, images will be empty
  }
  // Map/normalize to ImageMeta shape as much as possible
  const normalizedImages = images.map((img: any) => ({
    key: img.key,
    name: img.name,
    description: img.description || null,
    photo: img.photo,
    author: typeof img.author === 'string' ? img.author : (img.author?.code || ''),
    translation_en: img.translation_en || null,
    category: cat.key,
    stock: img.stock || null,
    published: img.published ?? true,
    created: img.created || null,
    modified: img.modified || null,
    imagePath: `/gallery/data/catalog/original/${img.key}.png`,
    slug: slugify(img.name || img.key),
  }));
  return (
    <GalleryCategoryClient
      images={normalizedImages}
      cat={cat}
    />
  );
}
