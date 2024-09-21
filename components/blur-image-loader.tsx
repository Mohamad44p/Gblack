"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface BlurImageLoaderProps {
    src: string
    alt: string
    width: number
    height: number
    className?: string
}

export function BlurImageLoader({ src, alt, width, height , className }: BlurImageLoaderProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadImage = async () => {
            setIsLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1000))
            setImageSrc(src)
            setIsLoading(false)
        }

        loadImage()
    }, [src])

    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            {imageSrc && (
                <Image
                    src={imageSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${btoa(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
              <filter id="b" color-interpolation-filters="sRGB">
                <feGaussianBlur stdDeviation="20" />
              </filter>
              <image preserveAspectRatio="none" filter="url(#b)" x="0" y="0" height="100%" width="100%" 
               href="${imageSrc}" />
            </svg>`
                    )}`}
                />
            )}
        </div>
    )
}