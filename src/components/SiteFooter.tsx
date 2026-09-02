"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RevealText } from "@/components/ui/reveal-text";

const columns: {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    heading: "Contact",
    links: [
      { label: "tracyholbrook532@gmail.com", href: "mailto:tracyholbrook532@gmail.com" },
      { label: "Start a project", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Work", href: "/#work" },
      { label: "Demos", href: "/#demos" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/pricing#faq" },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/trayfolio", external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function SiteFooter() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    const node = wordmarkRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowWordmark(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="border-t border-stone-100 bg-peach/40">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-stone-600">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-terracotta"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="transition hover:text-terracotta">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-stone-200 pt-8 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Trayfolio. All rights reserved.</span>
          <span>Built by Tracy Holbrook.</span>
        </div>

        <div ref={wordmarkRef} className="mt-10 select-none overflow-hidden">
          {showWordmark && <RevealText text="Trayfolio" />}
        </div>
      </div>
    </footer>
  );
}
