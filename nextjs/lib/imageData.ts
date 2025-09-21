

export type ImageMeta = {
  key: string;
  name: string;
  description: string | null;
  photo: string;
  author: string;
  translation_en: string | null;
  category: string;
  stock: string | null;
  published: boolean;
  created: string | null;
  modified: string | null;
  imagePath: string;
  slug: string;
};


export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

// Fetch all image metadata from /gallery/data/db/ via HTTP
export async function fetchAllImageMeta(baseUrl?: string): Promise<ImageMeta[]> {
  function getUrl(path: string) {
    if (typeof window === 'undefined') {
      return (baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + path;
    }
    return path;
  }

  // Fetch category keys from db.json
  let categoryKeys: string[] = [];
  try {
    const dbRes = await fetch(getUrl('/gallery/data/db.json'));
    if (dbRes.ok) {
      const db = await dbRes.json();
      if (db && db.categories) {
        categoryKeys = Object.keys(db.categories);
      }
    }
  } catch (e) {
    // ignore
  }

  let images: (Omit<ImageMeta, 'slug'> & { categoryKey: string })[] = [];
  for (const key of categoryKeys) {
    try {
      const res = await fetch(getUrl(`/gallery/data/${key}.json`));
      if (!res.ok) continue;
      const arr = await res.json();
      if (Array.isArray(arr)) {
        images = images.concat(
          arr.map((meta: any) => {
            // Normalize category field to always be an object with link, name, exposed
            let category = meta.category;
            if (!category || typeof category !== 'object' || !('link' in category)) {
              // fallback: get from db.json if possible
              category = undefined;
            }
            return {
              ...meta,
              imagePath: `/gallery/data/catalog/original/${meta.key}.png`,
              categoryKey: key,
              category: category && typeof category === 'object' && 'link' in category ? category : undefined,
            };
          })
        );
      }
    } catch (e) {
      // ignore missing category files
    }
  }
  // Ensure unique slugs
  const slugMap = new Map<string, number>();
  return images.map(img => {
    let baseSlug = slugify(img.name || img.key);
    let slug = baseSlug;
    let n = 1;
    while (slugMap.has(slug)) {
      n++;
      slug = `${baseSlug}-${n}`;
    }
    slugMap.set(slug, 1);
    // include categoryKey in returned object
    return { ...img, slug, categoryKey: img.categoryKey };
  });
}

export async function fetchImageBySlug(slug: string, baseUrl?: string): Promise<ImageMeta | undefined> {
  const all = await fetchAllImageMeta(baseUrl);
  return all.find(img => img.slug === slug);
}
