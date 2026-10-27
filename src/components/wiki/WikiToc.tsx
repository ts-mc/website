"use client";

import { useEffect, useState } from "react";

export function WikiToc({ headings }: { headings: { id: string; text: string; level: 2 | 3 }[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    void reduced;
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p className="label-mono mb-3 text-ink-dim">On this page</p>
      <ul className="space-y-2">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "true" : undefined}
                className={`block border-l-2 py-0.5 pl-3 leading-5 transition-colors ${heading.level === 3 ? "ml-4" : ""
                  } ${active
                    ? "border-[#4CADD0] text-brand"
                    : "border-transparent text-ink-dim hover:text-ink"
                  }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
