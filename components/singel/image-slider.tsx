/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{ id: number; src: string; alt: string }>;
  average_rating: string;
  rating_count: number;
  attributes: Array<{ id: number; name: string; options: string[] }>;
}

interface WorkCarouselProps {
  products: Product[];
}

const backgroundColors = ["#4c4c4c", "#666666", "#7F7F7F", "#999999"];

export default function WorkCarousel({ products }: WorkCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideCount = useRef(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const [currentBgColor, setCurrentBgColor] = useState(backgroundColors[0]);

  const getNextBackgroundColor = () => {
    const nextColor =
      backgroundColors[slideCount.current % backgroundColors.length];
    setCurrentBgColor(nextColor);
    return nextColor;
  };

  const handleHeaderClick = (
    event: React.MouseEvent<HTMLDivElement>,
    productId: number
  ) => {
    event.stopPropagation();
    router.push(`/product/${productId}`);
  };

  const splitHeader = (element: HTMLElement) => {
    let text = element.innerText;
    let splitText = text
      .split("")
      .map((char) => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`)
      .join("");
    element.innerHTML = splitText;
  };

  const addNewSlide = () => {
    if (isAnimating || !carouselRef.current) return;
    setIsAnimating(true);

    const nextSlideIndex = slideCount.current % products.length;
    setSlideIndex(nextSlideIndex);
    const newSlide = products[nextSlideIndex];

    const slideDiv = document.createElement("div");
    slideDiv.className =
      "absolute top-0 left-0 w-full h-full flex flex-col md:flex-row";

    const slideImgDiv = document.createElement("div");
    slideImgDiv.className = "relative w-full md:w-1/2 h-1/2 md:h-full";
    const image = document.createElement("img");
    image.src = newSlide.images[0]?.src || "/placeholder.jpg";
    image.alt = newSlide.name;
    image.className = "object-cover w-full h-full";
    slideImgDiv.appendChild(image);

    const slideContentDiv = document.createElement("div");
    slideContentDiv.className = "relative w-full md:w-1/2 h-1/2 md:h-full";
    slideContentDiv.style.backgroundColor = getNextBackgroundColor();
    const contentHeader = document.createElement("div");
    contentHeader.className =
      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-2 cursor-pointer";
    const header = document.createElement("h1");
    header.addEventListener("click", (event: MouseEvent) =>
      handleHeaderClick(
        event as unknown as React.MouseEvent<HTMLDivElement>,
        newSlide.id
      )
    );
    header.textContent = newSlide.name;
    header.className =
      "font-romie text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal uppercase text-black";
    splitHeader(header);
    const letters = header.querySelectorAll("span");

    contentHeader.appendChild(header);
    slideContentDiv.appendChild(contentHeader);

    const workClient = document.querySelector("#work-client");
    const workRole = document.querySelector("#work-role");
    const workType = document.querySelector("#work-type");

    if (workClient && workRole && workType) {
      gsap.to([workClient, workRole, workType], {
        opacity: 0,
        x: 15,
        duration: 0.3,
        stagger: 0.1,
        onComplete: () => {
          if (workClient) workClient.textContent = newSlide.brand;
          if (workRole) workRole.textContent = `$${newSlide.price}`;
          if (workType)
            workType.textContent = newSlide.attributes[0]?.options[0] || "N/A";
          gsap.to([workClient, workRole, workType], {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.1,
            delay: 0.3,
          });
        },
      });
    }

    slideDiv.appendChild(slideImgDiv);
    slideDiv.appendChild(slideContentDiv);

    gsap.set(letters, { top: "100px" });

    gsap.to(letters, {
      top: "0px",
      duration: 0.5,
      ease: "power2.out",
      delay: 0.35,
      stagger: 0.075,
    });

    gsap.set([slideImgDiv, slideContentDiv], {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    gsap.to([slideImgDiv, slideContentDiv], {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.125,
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    carouselRef.current.appendChild(slideDiv);
    slideCount.current++;

    if (carouselRef.current.children.length > 5) {
      const slidesToRemove = Array.from(carouselRef.current.children).slice(
        0,
        -5
      );
      slidesToRemove.forEach((slide) => {
        if (carouselRef.current?.contains(slide)) {
          setTimeout(() => {
            if (carouselRef.current?.contains(slide)) {
              carouselRef.current.removeChild(slide);
            }
          }, 2000);
        }
      });
    }
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !document.querySelector(".menu")?.contains(target) &&
        !document.querySelector(".slide-content-header")?.contains(target) &&
        !document.querySelector(".slide-content-header h1")?.contains(target) &&
        !document.querySelector(".back-btn")?.contains(target) &&
        !isAnimating
      ) {
        addNewSlide();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isAnimating]);

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <h1 className="text-5xl text-center my-10">
        More Products in This Category
      </h1>
      <section className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-black">
        <div ref={carouselRef} className="w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
              <Image
                src={products[0].images[0]?.src}
                alt={products[0].name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div
              className={`relative w-full md:w-1/2 h-1/2 md:h-full`}
              style={{ backgroundColor: currentBgColor }}
            >
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-2 cursor-pointer"
                onClick={(e) => handleHeaderClick(e, products[0].id)}
              >
                <h1 className="font-romie text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-normal uppercase text-black">
                  {products[0].name}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 md:left-1/2 p-4 z-10">
          <div className="flex items-center gap-2.5">
            <p className="font-romie italic text-xs capitalize text-gray-300">
              Brand
            </p>
            <p
              id="work-client"
              className="text-xs font-medium uppercase text-white"
            >
              {products[0].brand}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <p className="font-romie italic text-xs capitalize text-gray-300">
              Price
            </p>
            <p
              id="work-role"
              className="text-xs font-medium uppercase text-white"
            >
              ${products[0].price}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <p className="font-romie italic text-xs capitalize text-gray-300">
              Type
            </p>
            <p
              id="work-type"
              className="text-xs font-medium uppercase text-white"
            >
              {products[0].attributes[0]?.options[0] || "N/A"}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 p-4 flex gap-2.5">
          <p className="text-xs font-medium text-gray-300">{slideIndex + 1}</p>
          <p className="text-xs font-medium text-gray-300">/</p>
          <p className="text-xs font-medium text-gray-300">{products.length}</p>
        </div>
        <div
          className="absolute bottom-4 right-4 cursor-pointer bg-white p-2 rounded-full shadow-lg"
          onClick={addNewSlide}
        >
          <ArrowRight className="w-6 h-6 text-black" />
        </div>
      </section>
    </>
  );
}
