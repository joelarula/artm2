"use client";
import React, { useEffect, useState } from "react";
import { marked } from "marked";

export default function MarkdownFrontMatter() {
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
    <section
      style={{
        maxWidth: 700,
        margin: "0 auto 2.5rem auto",
        color: 'var(--foreground)',
        background: 'none',
        padding: 0,
        lineHeight: 1.7,
        fontSize: '1.08rem',
        wordBreak: 'break-word',
        /* Removed textShadow and any background for clean, readable text in both modes */
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: artmomentsHtml }} />
      <div dangerouslySetInnerHTML={{ __html: tellimineHtml }} />
    </section>
  );
}