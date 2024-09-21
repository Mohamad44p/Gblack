/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

interface UploadedImage {
  filename: string
  url: string
}

// Custom placeholder image as a base64 encoded SVG
const placeholderImage = `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#E5E7EB"/>
    <path d="M160 140H240V260H160V140Z" fill="#9CA3AF"/>
    <path d="M200 180L240 260H160L200 180Z" fill="#6B7280"/>
  </svg>
`)}`

export default function Component() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<UploadedImage[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      const cacheKey = 'cachedImages'
      const cachedData = localStorage.getItem(cacheKey)
      const currentTime = new Date().getTime()

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        const oneWeek = 7 * 24 * 60 * 60 * 1000

        if (currentTime - timestamp < oneWeek) {
          setImages(data)
          return
        }
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/miucm/v1/images`)
        const data = await response.json()
        setImages(data)

        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: currentTime }))
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    fetchImages()
  }, [])

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
              grid: "auto",
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
        {images.map((image, i) => (
          <div key={i} className="grid-img relative w-full h-full overflow-hidden rounded-lg">
            <Image
              src={image.url}
              alt={`Image ${i + 1}`}
              fill
              blurDataURL={placeholderImage}
              placeholder="blur"
              className="object-cover w-full h-full"
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