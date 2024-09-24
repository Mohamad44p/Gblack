"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import ImageAnimation from "./GblackImage";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ImprovedComponent() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    const scrollTriggerSettings = {
      trigger: mainRef.current,
      start: "top 25%",
      toggleActions: "play reverse play reverse",
    };

    const leftXValues = [-800, -900, -400];
    const rightXValues = [800, 900, 400];
    const leftRotationValues = [-30, -20, -35];
    const rightRotationValues = [30, 20, 35];
    const yValues = [100, -150, -400];

    const rows = mainRef.current.querySelectorAll(".row");
    rows.forEach((row, index) => {
      const cardLeft = row.querySelector(".card-left");
      const cardRight = row.querySelector(".card-right");

      gsap.to(cardLeft, {
        x: leftXValues[index],
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top center",
          end: "150% bottom",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            if (cardLeft instanceof HTMLElement) {
              cardLeft.style.transform = `translateX(${
                progress * leftXValues[index]
              }px) translateY(${progress * yValues[index]}px) rotate(${
                progress * leftRotationValues[index]
              }deg)`;
            }
            if (cardRight instanceof HTMLElement) {
              cardRight.style.transform = `translateX(${
                progress * rightXValues[index]
              }px) translateY(${progress * yValues[index]}px) rotate(${
                progress * rightRotationValues[index]
              }deg)`;
            }
          },
        },
      });
    });

    gsap.to(".logo", {
      scale: 1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });

    gsap.to(".line p", {
      y: 0,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.1,
      scrollTrigger: scrollTriggerSettings,
    });

    gsap.to("button", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out",
      delay: 0.25,
      scrollTrigger: scrollTriggerSettings,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className="row" key={i}>
          <div className="card card-left">
            <Image
              src={`/images/Rotated/img-${2 * i - 1}.jpg`}
              alt=""
              width={1800}
              height={1900}
              className="img"
              loading="lazy"
            />
          </div>
          <div className="card card-right">
            <Image
              src={`/images/Rotated/img-${2 * i}.jpg`}
              alt=""
              width={1800}
              height={1900}
              className="img"
              loading="lazy"
            />
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <ReactLenis root>
      <section className="hero section md:my-44">
        <ImageAnimation />
      </section>

      <div className="hidden md:block">
        <section
          ref={mainRef}
          className="main section overflow-y-hidden"
          aria-label="Product Showcase"
        >
          <div className="main-content">
            <div className="logo">
              <Image
                src="/LogoSection.png"
                alt="Company Logo"
                width={100}
                height={100}
                className="img"
              />
            </div>
            <div className="copy" aria-label="Product Description">
              <div className="line">
                <p>Explore Our Wide Range of Products</p>
              </div>
              <div className="line">
                <p>From Electronics to Fashion, We&apos;ve Got You Covered</p>
              </div>
              <div className="line">
                <p>Find the Perfect Items for Every Need.</p>
              </div>
            </div>
            <div className="btn">
              <Button>Explore Now</Button>
            </div>
          </div>

          {generateRows()}
        </section>
      </div>
    </ReactLenis>
  );
}
