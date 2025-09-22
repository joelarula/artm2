



import Link from 'next/link';


import { fetchAllImageMeta } from '../lib/imageData';
import { fetchCategories } from '../lib/categoryData';
import { headers } from 'next/headers';
import MarkdownFrontMatter from './MarkdownFrontMatter';
import GalleryThumbnails from './GalleryThumbnails';

export default async function PortfolioPage() {
  // For static export, do not use headers() or baseUrl logic
  const images = (await fetchAllImageMeta()).filter(img => img.published && img.imagePath);
  const categories = await fetchCategories();

  // Map categoryKey to link for each image
  const catKeyToLink = Object.fromEntries(categories.map(cat => [cat.key, cat.link]));
  return (
    <main style={{ padding: '2rem' }}>
      <MarkdownFrontMatter after={<GalleryThumbnails />} />
    </main>
  );
}