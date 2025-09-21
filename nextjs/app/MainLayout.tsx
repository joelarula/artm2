"use client";
import React, { useState, createContext, useContext } from 'react';
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
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const cats = Object.entries(data.categories)
            .map(([key, value]: [string, any]) => ({ key, ...value }))
            .filter(cat => cat.exposed);
          setCategories(cats);
        }
      });
  }, []);

  return (
    <BgContext.Provider value={{ bg, toggleBg }}>
      <div>
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 0 1.5rem 0',
          borderBottom: '1px solid #e0e0e0',
          background: 'var(--background)',
        }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: 1, color: 'var(--foreground)', textAlign: 'center', marginBottom: '1rem' }}>
            artmoments
          </h1>
          <nav style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {categories.map((cat) => (
                <li key={cat.key}>
                  <Link href={`/paintings/${cat.link}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500, padding: '0.3rem 1rem', borderRadius: 6, transition: 'background 0.2s', display: 'inline-block' }}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={toggleBg}
            style={{
              background: 'var(--foreground)',
              color: 'var(--background)',
              border: 'none',
              borderRadius: 6,
              padding: '0.5rem 1.2rem',
              cursor: 'pointer',
              fontWeight: 600,
              marginTop: 0,
              boxShadow: '0 2px 8px #0002',
              alignSelf: 'center',
            }}
            aria-label="Switch dark/light mode"
          >
            {bg === 'dark' ? 'Light' : 'Dark'}
          </button>
        </header>
        <main style={{ minHeight: '80vh', padding: 0 }}>{children}</main>
      </div>
    </BgContext.Provider>
  );
}
