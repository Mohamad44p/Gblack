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
 
        onError={() => setImgSrc(fallbackSrc)}
        {...props}
      />
    </div>
  );
}
