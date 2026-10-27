"use client";

import Image from "next/image";
import { useState } from "react";

type StaffAvatarProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className?: string;
};

/**
 * Renders a staff avatar with graceful fallback: if the profile picture file
 * is missing (404), it swaps to the placeholder avatar instead of showing a
 * broken image.
 */
export function StaffAvatar({ src, fallbackSrc, alt, sizes, className }: StaffAvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      unoptimized
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
