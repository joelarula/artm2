"use client";
import React, { useEffect, useState } from "react";
import { marked } from "marked";

export default function MarkdownFrontMatter({ after }: { after?: React.ReactNode }) {
  const [artmomentsHtml, setArtmomentsHtml] = useState("");
  const [tellimineHtml, setTellimineHtml] = useState("");

  useEffect(() => {
    fetch("/db/artmoments.md")
      .then((res) => res.ok ? res.text() : "")
      .then(async (md) => {
        const html = await marked.parse(md);
        setArtmomentsHtml(typeof html === 'string' ? html : '');
      });
    fetch("/db/tellimine.md")
      .then((res) => res.ok ? res.text() : "")
      .then(async (md) => {
        const html = await marked.parse(md);
        setTellimineHtml(typeof html === 'string' ? html : '');
      });
  }, []);

  return (
    <>
      {/* Artmoments card */}
      <div
        style={{
          maxWidth: 700,
          width: '100%',
          borderRadius: 16,
          boxShadow: "0 2px 16px #0002",
          background: "var(--background)",
          overflow: "hidden",
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto 2.5rem auto',
        }}
      >
        <img
          src="/db/assets/fingers_sm.jpg"
          alt="Artmoments cover"
          style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />
        <div
          style={{
            padding: '1.3rem 1.5rem 1.5rem 1.5rem',
            color: 'var(--foreground)',
            fontSize: '1.08rem',
            lineHeight: 1.7,
            textAlign: 'center',
            wordBreak: 'break-word',
            background: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: artmomentsHtml }}
        />
      </div>
      {after}
      {/* Tellimine card */}
      <div
        style={{
          maxWidth: 700,
          width: '100%',
          borderRadius: 16,
          boxShadow: "0 2px 16px #0002",
          background: "var(--background)",
          overflow: "hidden",
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '2.5rem auto 2.5rem auto',
        }}
      >
        <img
          src="/db/assets/pudelid.jpg"
          alt="Tellimine cover"
          style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />
        <div
          style={{
            padding: '1.3rem 1.5rem 1.5rem 1.5rem',
            color: 'var(--foreground)',
            fontSize: '1.08rem',
            lineHeight: 1.7,
            textAlign: 'center',
            wordBreak: 'break-word',
            background: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: tellimineHtml }}
        />
      </div>
    </>
  );
}