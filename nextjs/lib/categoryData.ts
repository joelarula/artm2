

export type Category = {
  key: string;
  name: string;
  link: string;
  exposed: boolean;
};

// Fetch categories from /gallery/data/db.json via HTTP
export async function fetchCategories(baseUrl?: string): Promise<Category[]> {
  function getUrl(path: string) {
    if (typeof window === 'undefined') {
      return (baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + path;
    }
    return path;
  }
  const res = await fetch(getUrl('/gallery/data/db.json'));
  if (!res.ok) return [];
  const db = await res.json();
  return Object.entries(db.categories)
    .map(([key, value]: [string, any]) => ({
      key,
      name: value.name,
      link: value.link,
      exposed: value.exposed,
    }))
    .filter(cat => cat.exposed);
// ...existing code...
}

