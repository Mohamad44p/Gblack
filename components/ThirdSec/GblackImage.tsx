'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

export default function ImageAnimation() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headerRef.current) {
      const text = headerRef.current.innerText
      const splitText = text
        .split("")
        .map((char) => `<span class="inline-block relative top-[400px]">${char}</span>`)
        .join("")
      headerRef.current.innerHTML = splitText
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline()

          // Initial animation (slower)
          tl.set(".hero-img", { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" })
          tl.to(".hero-img", {
            clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)",
            duration: 1.5,
            ease: "power2.inOut",
            stagger: 0.2,
          })

          tl.to(".hero", {
            scale: 1.1,
            duration: 2,
            ease: "power2.inOut",
          }, "-=1")

          // Faster transition to final state
          tl.to(".hero-img", {
            opacity: 0,
            duration: 0.2,
            ease: "power2.inOut",
          }, "+=0.2")

          tl.set(".hero-imgs", { display: "none" })
          tl.set(".grid-container", { display: "grid" })

          tl.fromTo(".grid-img", 
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              stagger: {
                amount: 0.2,
                grid: [6, 6],
                from: "center",
              },
              ease: "back.out(1.2)",
            },
            "-=0.1"
          )

          tl.to(".grid-container", {
            filter: "blur(5px) brightness(0.7)",
            duration: 0.2,
          }, "-=0.1")

          tl.to("h1 span", {
            top: "0px",
            stagger: 0.03,
            duration: 0.4,
            ease: "back.out(1.7)",
          }, "-=0.3")

          tl.to("h1", {
            scale: 1.2,
            duration: 0.3,
            ease: "power2.inOut",
          }, "-=0.2")

          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero w-screen h-screen bg-black overflow-hidden relative">
      <div className="hero-imgs relative w-full h-full overflow-hidden z-0">
        <Image src="/images/Rotated/img-1.jpg" alt="" layout="fill" objectFit="cover" className="hero-img absolute" />
        <Image src="/images/Rotated/img-2.jpg" alt="" layout="fill" objectFit="cover" className="hero-img absolute" />
        <Image src="/images/Rotated/img-3.jpg" alt="" layout="fill" objectFit="cover" className="hero-img absolute" />
        <Image src="/images/Rotated/img-4.jpg" alt="" layout="fill" objectFit="cover" className="hero-img absolute" />
        <Image src="/images/Rotated/img-5.jpg" alt="" layout="fill" objectFit="cover" className="hero-img absolute" />
        <Image src="/images/Rotated/img-6.jpg" alt="" layout="fill" objectFit="cover" className="hero-img absolute" />
      </div>
      <div 
        ref={gridRef}
        className="grid-container hidden grid-cols-6 gap-1 absolute inset-0 z-10"
      >
        {[...Array(36)].map((_, i) => (
          <div key={i} className="grid-img relative w-full h-full overflow-hidden">
            <Image 
              src={`/images/Rotated/img-${(i % 6) + 1}.jpg`} 
              alt="" 
              layout="fill" 
              objectFit="cover"
            />
          </div>
        ))}
      </div>
      <div className="website-content absolute top-0 left-0 w-full h-full z-20 flex items-center justify-center">
        <h1
          ref={headerRef}
          className="text-[10vw] font-bold text-white"
        >
          GBLACK
        </h1>
      </div>
    </section>
  )
}