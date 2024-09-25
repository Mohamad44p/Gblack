"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function OptimizedImageProduct({
  src,
  alt,
  fallbackSrc = "/BlurImage.jpg",
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    typeof src === "string" ? src : ""
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof src !== "string") return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        {...props}
        src={imgSrc || fallbackSrc}
        alt={alt}
        onError={() => setImgSrc(fallbackSrc)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${btoa(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
            <rect width="400" height="300" fill="#cccccc" />
          </svg>`
        )}`}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
