'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

export default function Component() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headerRef.current) {
      const text = headerRef.current.innerText
      const splitText = text
        .split("")
        .map((char) => `<span class="inline-block">${char}</span>`)
        .join("")
      headerRef.current.innerHTML = splitText
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline()

          tl.set(".grid-img", { opacity: 0, scale: 0, x: (i) => i % 2 === 0 ? -100 : 100 })
          tl.set("h1", { y: "-100vh", opacity: 0, scale: 0 })

          tl.to(".grid-img", {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            stagger: {
              each: 0.1,
              grid: [3, 3],
              from: "edges",
              axis: "x"
            },
            ease: "power2.out",
          })

          tl.to({}, { duration: 0.5 })

          tl.to("h1", {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power4.in",
            onComplete: () => {
              gsap.to(".grid-img", {
                x: "random(-15, 15)",
                y: "random(-15, 15)",
                rotation: "random(-8, 8)",
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                ease: "none",
              })

              gsap.to(".grid-container", {
                filter: "blur(4px)",
                duration: 0.1,
              })

              gsap.to("section", {
                backgroundColor: "white",
                duration: 0.05,
                yoyo: true,
                repeat: 3,
              })
            }
          })

          tl.to([".grid-img", "h1"], {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          }, ">=0.5")

          tl.to(".grid-container", {
            filter: "blur(1px)",
            duration: 0.3,
          }, "<")

          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero w-screen h-screen overflow-hidden relative flex items-center justify-center">
      <div
        ref={gridRef}
        className="grid-container grid grid-cols-3 gap-4 w-[120vmin] h-[80vmin] z-10"
      >
        {[...Array(9)].map((_, i) => (
          <div key={i} className="grid-img relative w-full h-full overflow-hidden rounded-lg">
            <Image
              src={`/assets/img${(i % 6) + 1}.jpeg`}
              alt={`Image ${i + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
      <div className="website-content absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <h1
          ref={headerRef}
          className="text-[12vw] font-bold text-white"
        >
          GBLACK
        </h1>
      </div>
    </section>
  )
}