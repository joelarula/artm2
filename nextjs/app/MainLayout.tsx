"use client";
import React, { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';



const BgContext = createContext({ bg: 'white', toggleBg: () => {} });

export function useBg() {
  return useContext(BgContext);
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
            <button
              onClick={toggleBg}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: 6,
                padding: '0.35rem 1.1rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 8px #0002',
                zIndex: 10,
                margin: 0,
                alignSelf: 'flex-start',
              }}
              aria-label="Switch dark/light mode"
            >
              {bg === 'dark' ? 'Light' : 'Dark'}
            </button>
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
