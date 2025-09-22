"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useEffect as useLayoutEffect, useState as useLayoutState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type CatalogType = Record<string, any>;
interface MainLayoutContextType {
  bg: 'dark' | 'light';
  toggleBg: () => void;
  catalog: CatalogType | null;
}
const MainLayoutContext = createContext<MainLayoutContextType>({ bg: 'light', toggleBg: () => {}, catalog: null });
export function useMainLayout() {
  return useContext(MainLayoutContext);
}
// For backwards compatibility
const BgContext = {
  Provider: MainLayoutContext.Provider,
};

export function useBg() {
  return useContext(MainLayoutContext);
}

// Add Roboto font globally by injecting a link tag in the document head
if (typeof document !== 'undefined' && !document.getElementById('roboto-font')) {
  const link = document.createElement('link');
  link.id = 'roboto-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap';
  document.head.appendChild(link);
}

function useContactData() {
  const [contact, setContact] = useLayoutState<{ phone?: string; email?: string } | null>(null);
  useLayoutEffect(() => {
    fetch('/db/contact.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => setContact(data));
  }, []);
  return contact;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const router = useRouter();
  // Read initial theme from cookie if available
  // Always default to 'light' for SSR, update from cookie on client
  const [bg, setBg] = useState<'dark' | 'light'>('light');

  // On mount, update bg from cookie if present
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )artmoments_theme=([^;]*)/);
      if (match && (match[1] === 'dark' || match[1] === 'light')) {
        setBg(match[1] as 'dark' | 'light');
      }
    }
  }, []);
  const [categories, setCategories] = useState<{ key: string; name: string; link: string; exposed: boolean }[]>([]);
  const [catalog, setCatalog] = useState<CatalogType | null>(null);

  const toggleBg = () => {
    const newBg = bg === 'dark' ? 'light' : 'dark';
    setBg(newBg);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', newBg === 'dark');
      document.body.classList.toggle('light', newBg === 'light');
      // Persist preference in cookie for 1 year
      document.cookie = `artmoments_theme=${newBg}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', bg === 'dark');
      document.body.classList.toggle('light', bg === 'light');
      // Persist preference in cookie for 1 year
      document.cookie = `artmoments_theme=${bg}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [bg]);

  // Always fetch menu.json first, then catalog.json
  React.useEffect(() => {
  fetch('/db/menu.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          const cats = Object.entries(data)
            .map(([link, value]: [string, any]) => ({ key: value.key || link, link, ...value }))
            .filter(cat => cat.exposed || cat.published);
          setCategories(cats);
          console.log('Loaded categories:', cats);
        } else {
          setCategories([]);
          console.error('No categories found in menu.json', data);
        }
        // After menu.json, load catalog.json
  return fetch('/db/catalog.json');
      })
      .then(res => (res && res.ok ? res.json() : null))
      .then(data => {
        if (data && typeof data === 'object') {
          setCatalog(data);
        } else {
          setCatalog(null);
          console.error('No catalog data found in catalog.json', data);
        }
      })
      .catch(err => {
        setCategories([]);
        setCatalog(null);
        console.error('Error fetching menu.json or catalog.json:', err);
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

  const contact = useContactData();
  return (
    <MainLayoutContext.Provider value={{ bg, toggleBg, catalog }}>
  <div style={{ fontFamily: 'Roboto, Arial, Helvetica, sans-serif' }}>
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
              <span style={{ opacity: 0.85 }}>otsi maali</span>
            </Link>
          )}
          <button
            onClick={toggleBg}
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
              marginRight: 0,
              transition: 'background 0.15s',
            }}
            aria-label="Switch dark/light mode"
          >
            <span style={{ opacity: 0.85 }}>{bg === 'dark' ? 'helenda' : 'tumenda'}</span>
          </button>
        </nav>
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.1rem 0 1.2rem 0',
          background: 'var(--background)',
          position: 'relative',
          fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
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
            {/* Logo and site title */}
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '0',
                marginBottom: '40px',
              }}
            >
              <a
                href="/"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
                aria-label="Artmoments koduleht"
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 10 }}>
                  <img
                    src="/assets/lillelogo.png"
                    alt="Artmoments lille logo"
                    style={{
                      width: 160,
                      height: 160,
                      verticalAlign: 'middle',
                      display: 'block',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <span
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 300,
                        letterSpacing: 6,
                        color: 'var(--foreground)',
                        fontFamily: 'var(--font-geist-sans), Roboto, Arial, Helvetica, sans-serif, \"Pacifico\", \"Comic Sans MS\", cursive',
                        lineHeight: 1.1,
                        display: 'inline-block',
                        userSelect: 'none',
                        textTransform: 'uppercase',
                      }}
                    >
                      artmoments
                    </span>
                    <div
                      style={{
                        fontSize: '1.18rem',
                        fontWeight: 400,
                        color: 'var(--muted, #888)',
                        marginTop: 8,
                        letterSpacing: 0.1,
                        fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
                      }}
                    >
                      akrüülmaalid lõuendil
                    </div>
                  </div>
                </div>
                {/* subtitle moved above, next to logo */}
              </a>
            </div>
          </div>
          {/* Show main menu on all pages */}
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
        <footer style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '1.08rem',
          color: 'var(--muted, #888)',
          background: 'none',
          marginTop: 32,
          marginBottom: 18,
          letterSpacing: 0.01,
        }}>
          {contact && contact.phone && contact.email && (
            <span>
              Kontakt: helista <a href={`tel:${contact.phone}`} style={{ color: 'inherit', textDecoration: 'underline dotted' }}>{contact.phone}</a>
              {" või saada sõnum "}
              <a href={`mailto:${contact.email.trim()}`} style={{ color: 'inherit', textDecoration: 'underline dotted' }}>{contact.email.trim()}</a>
            </span>
          )}
        </footer>
      </div>
  </MainLayoutContext.Provider>
  );
}
