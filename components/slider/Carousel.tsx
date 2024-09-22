"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Compass } from "lucide-react";
import { useInView } from "react-intersection-observer";

interface CarouselItem {
  id: number;
  productName: string;
  title: string;
  topic: string;
  description: string;
  videoSrc: string;
  imgSrc: string;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function ImprovedCarousel({
  initialItems,
}: {
  initialItems: CarouselItem[];
}) {
  const [carouselItems] = useState<CarouselItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const showSlider = useCallback(
    (index: number) => {
      const type = index > currentIndex ? "next" : "prev";
      setDirection(type);
      setCurrentIndex(index);

      if (videoRefs.current[currentIndex]) {
        videoRefs.current[currentIndex]!.pause();
      }

      if (videoRefs.current[index]) {
        videoRefs.current[index]!.currentTime = 0;
        videoRefs.current[index]!.play().catch((error) =>
          console.error("Video playback failed:", error)
        );
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDirection(null);
      }, 500);
    },
    [currentIndex]
  );

  useEffect(() => {
    if (carouselItems.length === 0) return;

    const autoNext = setInterval(() => {
      showSlider((currentIndex + 1) % carouselItems.length);
    }, 7000);

    return () => {
      clearInterval(autoNext);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, carouselItems.length, showSlider]);

  useEffect(() => {
    if (inView && videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]!.play().catch((error) =>
        console.error("Video playback failed:", error)
      );
    }
  }, [currentIndex, inView]);

  if (carouselItems.length === 0) {
    return <div>No items to display</div>;
  }

  return (
    <div
      className="relative h-[85vh] w-full overflow-hidden bg-black"
      ref={carouselRef}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={{
            enter: (direction) => ({
              x: direction === "next" ? "100%" : "-100%",
              opacity: 0,
            }),
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1,
            },
            exit: (direction) => ({
              zIndex: 0,
              x: direction === "next" ? "-100%" : "100%",
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <video
            ref={(el) => {
              videoRefs.current[currentIndex] = el;
            }}
            src={carouselItems[currentIndex].videoSrc}
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            aria-hidden="true"
            preload="metadata"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-70"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="absolute top-[20%] left-5 w-full max-w-2xl p-4 text-white md:left-10 lg:left-20"
          >
            <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {carouselItems[currentIndex].title}
            </h2>
            <p className="mb-6 text-lg md:text-xl">
              {carouselItems[currentIndex].topic}
            </p>
            <p className="mb-8 text-sm md:text-base lg:text-lg">
              {carouselItems[currentIndex].description}
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded border border-black bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-gray-200"
              >
                <ShoppingCart size={20} aria-hidden="true" />
                <span>SHOP NOW</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded border border-yellow-400 bg-transparent px-6 py-2 font-bold text-white transition-colors hover:bg-white hover:text-black"
              >
                <Compass size={20} aria-hidden="true" />
                <span>DISCOVER MORE</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div
        className="absolute bottom-4 right-4 z-10 flex gap-2 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12"
        role="tablist"
        ref={ref}
      >
        {carouselItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`group relative h-24 w-16 cursor-pointer overflow-hidden rounded-lg transition-transform md:h-32 md:w-24 lg:h-40 lg:w-28 ${
              index === currentIndex ? "ring-2 ring-yellow-400" : ""
            }`}
            onClick={() => showSlider(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Slide ${index + 1}: ${item.title}`}
          >
            <Image
              src={item.imgSrc}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 64px, (max-width: 1024px) 96px, 112px"
              className="transition-transform object-cover w-full h-full group-hover:scale-110"
              loading="lazy"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(112, 160)
              )}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 p-2">
              <p className="text-xs font-medium absolute bottom-4 text-white md:text-sm">
                {item.productName}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 7, ease: "linear" }}
        style={{ originX: 0 }}
        className="absolute top-0 left-0 h-1 w-full bg-white"
        aria-hidden="true"
      />
    </div>
  );
}
