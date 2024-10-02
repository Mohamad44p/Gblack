"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  isOnSale: boolean;
}

export default function ImageGallery({ images, isOnSale }: ImageGalleryProps) {
  const [bigImage, setBigImage] = useState(images[0]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    new Set([images[0].id])
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  const handleSmallImageClick = useCallback(
    (image: (typeof images)[0], index: number) => {
      setBigImage(image);
      setCurrentIndex(index);
      setLoadedImages((prev) => new Set(prev).add(image.id));
    },
    []
  );

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((image) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = image.src;
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(image.id));
            resolve();
          };
        });
      });
      await Promise.all(imagePromises);
    };
    preloadImages();
  }, [images]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setBigImage(images[(currentIndex + 1) % images.length]);
  }, [currentIndex, images]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    setBigImage(images[(currentIndex - 1 + images.length) % images.length]);
  }, [currentIndex, images]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !lensRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const lensWidth = lensRef.current.offsetWidth;
    const lensHeight = lensRef.current.offsetHeight;

    const newX = Math.max(
      0,
      Math.min(e.clientX - left - lensWidth / 2, width - lensWidth)
    );
    const newY = Math.max(
      0,
      Math.min(e.clientY - top - lensHeight / 2, height - lensHeight)
    );

    setLensPosition({ x: newX, y: newY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowLens(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowLens(false);
  }, []);

  const thumbnailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <motion.div
        className="order-last flex gap-2 overflow-x-auto lg:order-none lg:flex-col lg:overflow-x-visible"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            variants={thumbnailVariants}
            className={`flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl ${
              bigImage.id === image.id ? "ring-2 ring-primary" : ""
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className={`cursor-pointer object-cover object-center transition-opacity duration-300 ${
                loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => handleSmallImageClick(image, index)}
              loading="lazy"
              onLoad={() =>
                setLoadedImages((prev) => new Set(prev).add(image.id))
              }
            />
          </motion.div>
        ))}
      </motion.div>

      <div
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 lg:col-span-4 shadow-2xl"
        ref={imageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bigImage.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={bigImage.src}
              alt={bigImage.alt}
              fill
              className={`object-cover object-center transition-opacity duration-300 ${
                loadedImages.has(bigImage.id) ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onLoad={() =>
                setLoadedImages((prev) => new Set(prev).add(bigImage.id))
              }
            />
          </motion.div>
        </AnimatePresence>

        {showLens && (
          <motion.div
            ref={lensRef}
            className="absolute w-32 h-32 border-2 border-white rounded-full overflow-hidden pointer-events-none"
            style={{
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
              backgroundImage: `url(${bigImage.src})`,
              backgroundPosition: `${-lensPosition.x * 2}px ${
                -lensPosition.y * 2
              }px`,
              backgroundSize: `${
                imageRef.current ? imageRef.current.offsetWidth * 2 : 0
              }px ${
                imageRef.current ? imageRef.current.offsetHeight * 2 : 0
              }px`,
              backgroundRepeat: "no-repeat",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {showLens && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {isOnSale && (
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm font-bold tracking-wider text-white shadow-md"
          >
            SALE
          </motion.span>
        )}
      </div>
    </div>
  );
}
