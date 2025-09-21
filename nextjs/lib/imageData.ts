

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


function slugify(str: string): string {
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
  const dbIndexRes = await fetch(getUrl('/gallery/data/db.json'));
  if (!dbIndexRes.ok) return [];
  const dbIndex = await dbIndexRes.json();
  const files: string[] = dbIndex.images || [];
  const images: Omit<ImageMeta, 'slug'>[] = [];
  for (const file of files) {
    const metaRes = await fetch(getUrl(`/gallery/data/db/${file}`));
    if (!metaRes.ok) continue;
    const meta = await metaRes.json();
    images.push({
      ...meta,
      imagePath: `/gallery/data/catalog/original/${meta.key}.png`,
    });
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
    return { ...img, slug };
  });
}

export async function fetchImageBySlug(slug: string, baseUrl?: string): Promise<ImageMeta | undefined> {
  const all = await fetchAllImageMeta(baseUrl);
  return all.find(img => img.slug === slug);
}
