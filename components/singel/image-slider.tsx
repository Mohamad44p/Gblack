"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ArrowRight, Star } from "lucide-react";

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
  ratingCount: number;
  attributes: Array<{ id: number; name: string; options: string[] }>;
  short_description: string;
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
    slideContentDiv.className =
      "relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-6";
    slideContentDiv.style.backgroundColor = getNextBackgroundColor();

    const contentHeader = document.createElement("div");
    contentHeader.className = "text-center cursor-pointer mb-4";
    const header = document.createElement("h1");
    header.addEventListener("click", (event: MouseEvent) =>
      handleHeaderClick(
        event as unknown as React.MouseEvent<HTMLDivElement>,
        newSlide.id
      )
    );
    header.textContent = newSlide.name;
    header.className =
      "font-romie text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal uppercase text-white mb-4";
    splitHeader(header);

    const shortDescription = document.createElement("p");
    shortDescription.className = "text-lg text-white mb-6 max-w-md text-center";
    shortDescription.textContent = newSlide.short_description;

    const priceDiv = document.createElement("div");
    priceDiv.className = "flex items-center gap-4 mb-4";
    const price = document.createElement("span");
    price.className = "text-3xl font-bold text-white";
    price.textContent = `$${newSlide.price}`;
    const regularPrice = document.createElement("span");
    regularPrice.className = "text-xl line-through text-gray-300";
    regularPrice.textContent = `$${newSlide.regular_price}`;
    priceDiv.appendChild(price);
    priceDiv.appendChild(regularPrice);

    const ratingDiv = document.createElement("div");
    ratingDiv.className = "flex items-center gap-2 mb-6";
    const rating = document.createElement("span");
    rating.className = "text-xl font-bold text-white";
    rating.textContent = newSlide.average_rating;
    const starIcon = document.createElement("span");
    starIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const ratingCount = document.createElement("span");
    ratingCount.className = "text-sm text-gray-300";
    ratingCount.textContent = `(${newSlide.ratingCount} reviews)`;
    ratingDiv.appendChild(rating);
    ratingDiv.appendChild(starIcon);
    ratingDiv.appendChild(ratingCount);

    const attributesDiv = document.createElement("div");
    attributesDiv.className = "flex flex-wrap justify-center gap-4 mb-6";
    newSlide.attributes.forEach((attr) => {
      const attrSpan = document.createElement("span");
      attrSpan.className =
        "px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-white";
      attrSpan.textContent = `${attr.name}: ${attr.options[0]}`;
      attributesDiv.appendChild(attrSpan);
    });

    contentHeader.appendChild(header);
    slideContentDiv.appendChild(contentHeader);
    slideContentDiv.appendChild(shortDescription);
    slideContentDiv.appendChild(priceDiv);
    slideContentDiv.appendChild(ratingDiv);
    slideContentDiv.appendChild(attributesDiv);

    slideDiv.appendChild(slideImgDiv);
    slideDiv.appendChild(slideContentDiv);

    const letters = header.querySelectorAll("span");

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-6"
              style={{ backgroundColor: currentBgColor }}
            >
              <div
                className="text-center cursor-pointer mb-4"
                onClick={(e) => handleHeaderClick(e, products[0].id)}
              >
                <h1 className="font-romie text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal uppercase text-white mb-4">
                  {products[0].name}
                </h1>
              </div>
              <p className="text-lg text-white mb-6 max-w-md text-center"
                dangerouslySetInnerHTML={{ __html: products[0].short_description }}
              >
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-white">
                  ${products[0].price}
                </span>
                <span className="text-xl line-through text-gray-300">
                  ${products[0].regular_price}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl font-bold text-white">
                  {products[0].average_rating}
                </span>
                <Star className="text-yellow-400" />
                <span className="text-sm text-gray-300">
                  ({products[0].ratingCount} reviews)
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {products[0].attributes.map((attr) => (
                  <span
                    key={attr.id}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-white"
                  >
                    {attr.name}: {attr.options[0]}
                  </span>
                ))}
              </div>
            </div>
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
