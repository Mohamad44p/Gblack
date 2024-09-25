import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  fill,
  sizes,
  fallbackSrc = "/BlurImage.jpg",
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative w-full h-full">
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        sizes={
          sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        onError={() => setImgSrc(fallbackSrc)}
        {...props}
      />
    </div>
  );
}
