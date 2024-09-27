'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const backgrounds = Array.from({ length: 9 }, (_, i) => `/img/${i}.png`)

export default function Banner() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="banner">
            {backgrounds.map((bg, index) => (
                <div
                    key={index}
                    className={`bg bg-${index + 1}`}
                    style={{
                        transform: `translateY(${index === 0
                                ? scrollY / 3
                                : index === 8
                                    ? 0
                                    : (scrollY * index) / 2
                            }px)`,
                    }}
                >
                    <Image src={bg} alt={`Background ${index + 1}`} fill className='object-cover'  />
                </div>
            ))}
            <h1 style={{ transform: `translateY(${(scrollY * 4) / 2}px)` }}>GBLACK!</h1>
        </div>
    )
}