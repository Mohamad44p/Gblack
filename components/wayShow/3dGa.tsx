'use client'

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Gallery3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const activeSlideImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const initAnimation = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const totalSlides = slidesRef.current.length;
      const slideHeight = window.innerHeight; // Assuming each slide takes up the full viewport height

      gsap.set(slidesRef.current, {
        z: (i) => i * -1000,
        opacity: 0,
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalSlides * slideHeight}`,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentSlideIndex = Math.floor(progress * totalSlides);

          slidesRef.current.forEach((slide, index) => {
            const slideProgress = gsap.utils.wrap(0, 1, progress * totalSlides - index);
            
            gsap.to(slide, {
              z: -1000 + slideProgress * 1000,
              opacity: slideProgress,
              scale: 1 - Math.abs(slideProgress - 0.5) * 0.5,
              duration: 0.5,
            });

            if (index === currentSlideIndex) {
              gsap.to(activeSlideImageRef.current, {
                attr: { src: slide.querySelector('img')?.src },
                opacity: 1,
                duration: 0.5,
              });
            }
          });
        },
      });
    };

    initAnimation();
  }, []);

  const slides = [
    { title: "Neo Elegance°", index: "ES 2023 0935", image: "/assets/img1.jpeg" },
    { title: "Future Luxe", index: "ES 2023 0936", image: "/assets/img2.jpeg" },
    { title: "Cyber Glam", index: "ES 2023 0937", image: "/assets/img3.jpeg" },
    { title: "Visionary Threads", index: "ES 2023 0938", image: "/assets/img4.jpeg" },
    { title: "Galactic Chic", index: "ES 2023 0939", image: "/assets/img5.jpeg" },
    { title: "Tech Sophistication", index: "ES 2023 0940", image: "/assets/img6.jpeg" },
    { title: "Avant Edge", index: "ES 2023 0941", image: "/assets/img7.jpeg" },
    { title: "Moda Futura", index: "ES 2023 0942", image: "/assets/img8.jpeg" },
    { title: "Eco Futurist", index: "ES 2023 0943", image: "/assets/img9.jpeg" },
    { title: "Sleek Tomorrow", index: "ES 2023 0944", image: "/assets/img1.jpeg" },
  ];

  return (
    <div className="container" ref={containerRef}>
      <div className="active-slide">
        <img ref={activeSlideImageRef} src={slides[0].image} alt="" />
      </div>

      <div className="slider">
        {slides.map((slide, index) => (
          <div key={index} className="slide" ref={el => slidesRef.current[index] = el as HTMLDivElement}>
            <div className="slide-copy">
              <p>{slide.title}</p>
              <p id="index">( {slide.index} )</p>
            </div>
            <div className="slide-img">
              <img src={slide.image} alt={slide.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}