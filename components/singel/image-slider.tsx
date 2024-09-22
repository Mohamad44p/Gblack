"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

gsap.registerPlugin(CustomEase);

CustomEase.create(
  "hop",
  "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
);

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  images: { src: string; alt: string }[];
  average_rating: string;
  rating_count: number;
  attributes?: Array<{ name: string; options: string[] }>;
}

interface ProductImageSliderProps {
  products: Product[];
}

export default function ProductImageSlider({ products }: ProductImageSliderProps) {
  const [currentImg, setCurrentImg] = useState(1);
  const [indicatorRotation, setIndicatorRotation] = useState(0);
  const sliderImagesRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateCounterAndTitlePosition();
  }, [currentImg]);

  const updateCounterAndTitlePosition = () => {
    const counterY = -20 * (currentImg - 1);
    const titleY = -60 * (currentImg - 1);

    gsap.to(counterRef.current, {
      y: counterY,
      duration: 1,
      ease: "hop",
    });

    gsap.to(titlesRef.current, {
      y: titleY,
      duration: 1,
      ease: "hop",
    });
  };

  const animateSlide = (direction: "left" | "right") => {
    const currentSlide = sliderImagesRef.current?.lastElementChild as HTMLDivElement;
    const slideImg = document.createElement("div");
    slideImg.classList.add("absolute", "w-full", "h-full");

    const slideImgElem = document.createElement("img");
    slideImgElem.src = products[currentImg - 1].images[0].src;
    slideImgElem.alt = products[currentImg - 1].images[0].alt;
    slideImgElem.className = "w-full h-full object-cover";
    gsap.set(slideImgElem, { x: direction === "left" ? -500 : 500 });

    slideImg.appendChild(slideImgElem);
    sliderImagesRef.current?.appendChild(slideImg);

    gsap.to(currentSlide.querySelector("img"), {
      x: direction === "left" ? 500 : -500,
      duration: 1.5,
      ease: "hop",
    });

    gsap.fromTo(
      slideImg,
      {
        clipPath:
          direction === "left"
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
      }
    );
    gsap.to(slideImgElem, {
      x: 0,
      duration: 1.5,
      ease: "hop",
    });

    cleanupSlides();

    const newRotation = indicatorRotation + (direction === "left" ? -90 : 90);
    setIndicatorRotation(newRotation);
    if (indicatorsRef.current?.children) {
      gsap.to(indicatorsRef.current.children, {
        rotate: newRotation,
        duration: 1,
        ease: "hop",
      });
    }
  };

  const cleanupSlides = () => {
    const imgElements = sliderImagesRef.current?.children;
    if (imgElements && imgElements.length > 2) {
      imgElements[0].remove();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderWidth = e.currentTarget.clientWidth;
    const clickPosition = e.clientX;

    if (clickPosition < sliderWidth / 2 && currentImg !== 1) {
      setCurrentImg((prev) => prev - 1);
      animateSlide("left");
    } else if (clickPosition > sliderWidth / 2 && currentImg !== products.length) {
      setCurrentImg((prev) => prev + 1);
      animateSlide("right");
    }
  };

  const handlePreviewClick = (index: number) => {
    if (index + 1 !== currentImg) {
      if (index + 1 < currentImg) {
        setCurrentImg(index + 1);
        animateSlide("left");
      } else {
        setCurrentImg(index + 1);
        animateSlide("right");
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="slider relative w-full h-full" onClick={handleClick}>
        <div
          ref={sliderImagesRef}
          className="slider-images absolute w-full h-full"
        >
          <div className="absolute w-full h-full">
            <Image
              src={products[0].images[0].src}
              alt={products[0].images[0].alt}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        <div className="slider-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-16 overflow-hidden">
          <div
            ref={titlesRef}
            className="slider-title-wrapper relative w-full text-center"
          >
            {products.map((product, index) => (
              <p key={index} className="text-white text-5xl leading-[60px]">
                {product.name}
              </p>
            ))}
          </div>
        </div>

        <div className="slider-counter absolute bottom-8 left-1/2 transform -translate-x-1/2 h-6 flex gap-2 overflow-hidden">
          <div ref={counterRef} className="counter relative">
            {products.map((_, index) => (
              <p key={index} className="text-white leading-5">
                {index + 1}
              </p>
            ))}
          </div>
          <div>
            <p className="text-white">&mdash;</p>
          </div>
          <div>
            <p className="text-white">{products.length}</p>
          </div>
        </div>

        <div className="slider-preview absolute bottom-8 right-8 w-1/3 h-[50px] flex gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className={`preview relative flex-1 cursor-pointer ${
                index + 1 === currentImg ? "active" : ""
              }`}
              onClick={() => handlePreviewClick(index)}
            >
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                layout="fill"
                objectFit="cover"
              />
              <div
                className={`absolute inset-0 bg-black ${
                  index + 1 === currentImg ? "bg-opacity-0" : "bg-opacity-50"
                } transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        <div
          ref={indicatorsRef}
          className="slider-indicators absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 flex justify-between"
        >
          <p className="text-white text-4xl font-extralight">+</p>
          <p className="text-white text-4xl font-extralight">+</p>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <h2 className="text-white text-4xl font-bold mb-2">{products[currentImg - 1].name}</h2>
          <p className="text-white text-xl mb-2">{products[currentImg - 1].brand}</p>
          <p className="text-white text-2xl font-semibold mb-4">
            ${products[currentImg - 1].price}
          </p>
          <Link href={`/product/${products[currentImg - 1].id}`}>
            <Button variant="secondary" size="lg">
              View All Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}