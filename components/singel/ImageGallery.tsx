"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X } from "lucide-react";

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
  const [isZoomed, setIsZoomed] = useState(false);

  const handleSmallImageClick = (image: (typeof images)[0]) => {
    setBigImage(image);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="order-last flex gap-4 lg:order-none lg:flex-col">
        <Suspense
          fallback={
            <>
              {images.map((image) => (
                <div className="flex flex-col space-y-3" key={image.id}>
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </>
          }
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="overflow-hidden rounded-lg bg-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover object-center cursor-pointer transition-transform duration-300 hover:scale-110"
                width={200}
                height={200}
                onClick={() => handleSmallImageClick(image)}
              />
            </motion.div>
          ))}
        </Suspense>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4 shadow-2xl">
        <Image
          src={bigImage.src}
          alt={bigImage.alt}
          loading="lazy"
          className="h-full w-full object-cover object-center"
          width={500}
          height={500}
        />

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

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-4 right-4 rounded-full bg-white p-2 shadow-md transition-colors duration-300 hover:bg-gray-200"
          onClick={toggleZoom}
        >
          <ZoomIn className="h-6 w-6 text-gray-800" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={toggleZoom}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-h-[90vh] max-w-[90vw]"
            >
              <Image
                src={bigImage.src}
                alt={bigImage.alt}
                className="h-full w-full object-contain"
                width={1000}
                height={1000}
              />
              <button
                className="absolute top-4 right-4 rounded-full bg-white p-2 shadow-md transition-colors duration-300 hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}