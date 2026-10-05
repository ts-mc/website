"use client";
import { ElementType, ReactNode, useEffect, useRef } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger step in milliseconds, applied per child when `stagger` is set. */
  delay?: number;
  stagger?: boolean;
  className?: string;
  as?: ElementType;
};

const CHILD_SELECTOR = "[data-reveal-child]";

/**
 * Fades a block up once when it reaches 15% visibility. Children marked with
 * `data-reveal-child` are staggered ~60ms apart from each other.
 *
 * Under `prefers-reduced-motion` the CSS keeps everything visible, and the
 * observer is skipped entirely so nothing depends on JavaScript to be read.
 */
export function Reveal({
  children,
  delay = 0,
  stagger = false,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.dataset.visible = "true";
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (stagger) {
            const items = node.querySelectorAll<HTMLElement>(CHILD_SELECTOR);
            items.forEach((item, index) => {
              item.style.setProperty("--reveal-delay", `${delay + index * 60}ms`);
              item.dataset.visible = "true";
            });
          } else {
            node.style.setProperty("--reveal-delay", `${delay}ms`);
            node.dataset.visible = "true";
          }
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, stagger]);

  return (
    <Tag ref={ref} className={`reveal ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
