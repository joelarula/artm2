"use client";
import React, { useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
const BgContext = createContext<{ bg: 'dark' | 'light'; toggleBg: () => void }>({ bg: 'light', toggleBg: () => {} });

export function useBg() {
  return useContext(BgContext);
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [bg, setBg] = useState<'dark' | 'light'>('light');
  const [categories, setCategories] = useState<{ key: string; name: string; link: string; exposed: boolean }[]>([]);

  const toggleBg = () => {
    setBg(bg === 'dark' ? 'light' : 'dark');
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', bg !== 'dark');
      document.body.classList.toggle('light', bg === 'dark');
    }
  };

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', bg === 'dark');
      document.body.classList.toggle('light', bg === 'light');
    }
  }, [bg]);

  React.useEffect(() => {
    fetch('/gallery/data/db.json')
      .then(res => {
        if (!res.ok) {
          console.error('Failed to fetch /gallery/data/db.json:', res.status, res.statusText);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.categories) {
          const cats = Object.entries(data.categories)
            .map(([key, value]: [string, any]) => ({ key, ...value }))
            .filter(cat => cat.exposed);
          setCategories(cats);
          console.log('Loaded categories:', cats);
        } else {
          console.error('No categories found in db.json', data);
        }
      })
      .catch(err => {
        console.error('Error fetching /gallery/data/db.json:', err);
      });
  }, []);

  const pathname = usePathname();
  // Determine active category for both gallery and detail views
  let activeCategoryLink = '';
  const isSearchPage = pathname === '/search'; // Check if on search page


  if (pathname.startsWith('/paintings/')) {
    // /paintings/[category]
    const match = pathname.match(/^\/paintings\/([^\/]+)/);
    if (match) activeCategoryLink = match[1];
  } else if (pathname.startsWith('/painting/')) {
    // /painting/[gallery]/[slug]
    const match = pathname.match(/^\/painting\/([^\/]+)/);
    if (match) activeCategoryLink = match[1];
  }

  return (
    <BgContext.Provider value={{ bg, toggleBg }}>
      <div>
        {/* Top Menu with search and dark/light toggle */}
        <nav style={{
          width: '100%',
          height: '2.5rem',
          marginBottom: '1.5rem',
          /* background removed */
          /* borderRadius and boxShadow removed for no border */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 1rem',
          gap: '0.7rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}>
          {!isSearchPage && ( // Only show the link if not on the search page
            <Link
              href="/search"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '2rem',
                padding: '0 1.1rem',
                borderRadius: 6,
                border: 'none',
                background: bg === 'dark' ? '#222' : '#f0f0f0',
                color: bg === 'dark' ? '#fff' : '#222',
                fontWeight: 500,
                fontSize: '0.97rem',
                boxShadow: bg === 'dark' ? '0 1px 4px #0006' : '0 1px 4px #0001',
                textDecoration: 'none',
                cursor: 'pointer',
                marginRight: '0.5rem',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ opacity: 0.85 }}>Search paintings ...</span>
            </Link>
          )}
          <button
            onClick={toggleBg}
            style={{
              background: bg === 'dark' ? '#222' : '#fff',
              color: bg === 'dark' ? '#fff' : '#222',
              border: 'none',
              borderRadius: 6,
              padding: '0.25rem 0.8rem',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.95rem',
              boxShadow: bg === 'dark' ? '0 2px 8px #0006' : '0 2px 8px #0002',
            }}
            aria-label="Switch dark/light mode"
          >
            {bg === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2.5rem 0 2.2rem 0',
          background: 'var(--background)',
          position: 'relative',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            minHeight: 0,
          }}>
            {/* Removed extra dark/light button from header */}
            {/* Image logo removed as requested */}
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '0.5rem',
                marginBottom: '2.2rem',
              }}
            >
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-geist-sans), Arial, Helvetica, sans-serif',
                  lineHeight: 1.1,
                  display: 'inline-block',
                  userSelect: 'none',
                }}
              >
                artmoments
              </span>
            </div>
          </div>
          <nav style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: 0, marginTop: '-0.5rem' }}>
            {categories.length === 0 ? (
              <div style={{ color: 'var(--muted)', fontSize: '1.1rem', padding: '0.7rem 0' }}>
                Loading galleries...
              </div>
            ) : (
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map((cat) => {
                  const isActive = cat.link === activeCategoryLink;
                  return (
                    <li key={cat.key}>
                      <Link
                        href={`/paintings/${cat.link}`}
                        style={{
                          textDecoration: 'none',
                          color: isActive ? 'var(--foreground)' : 'inherit',
                          fontWeight: isActive ? 700 : 500,
                          padding: isActive ? '0.3rem 1.1rem' : '0.3rem 1rem',
                          borderRadius: 8,
                          transition: 'all 0.18s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          verticalAlign: 'middle',
                          background: undefined,
                          boxShadow: undefined,
                          fontSize: isActive ? '1.13rem' : '1rem',
                          transform: isActive ? 'scale(1.08)' : 'none',
                          zIndex: isActive ? 1 : undefined,
                        }}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>
          {/* Dark/Light button moved to top left */}
        </header>
        <main style={{ minHeight: '80vh', padding: 0 }}>{children}</main>
      </div>
    </BgContext.Provider>
  );
}
