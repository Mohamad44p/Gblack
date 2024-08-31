'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './Carousel.module.css'

interface CarouselItem {
    imgSrc: string
    videoSrc: string
    author: string
    title: string
    topic: string
    description: string
}

const carouselItems: CarouselItem[] = [
    {
        imgSrc: "/slider/img1.jpg",
        videoSrc: "/slider/video1.mp4",
        author: "LUNDEV",
        title: "DESIGN SLIDER",
        topic: "ANIMAL",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?",
    },
    {
        imgSrc: "/slider/img2.jpg",
        videoSrc: "/slider/video2.mp4",
        author: "LUNDEV",
        title: "NATURE BEAUTY",
        topic: "LANDSCAPE",
        description: "Discover the breathtaking beauty of nature through our lens. From majestic mountains to serene lakes, our collection showcases the diverse landscapes that make our planet truly remarkable. Join us on a visual journey that will inspire your wanderlust and deepen your appreciation for the natural world.",
    },
    {
        imgSrc: "/slider/img3.jpg",
        videoSrc: "/slider/video3.mp4",
        author: "LUNDEV",
        title: "URBAN EXPLORER",
        topic: "CITY",
        description: "Embark on an urban adventure with our city-focused photography. Capture the essence of bustling metropolises, from iconic skylines to hidden street corners. Our images reveal the energy, diversity, and architectural marvels that define modern urban landscapes. Let the city's pulse inspire your next journey.",
    },
    {
        imgSrc: "/slider/img4.jpg",
        videoSrc: "/slider/video4.mp4",
        author: "LUNDEV",
        title: "WILDLIFE WONDERS",
        topic: "FAUNA",
        description: "Immerse yourself in the fascinating world of wildlife. Our stunning photographs bring you face-to-face with exotic creatures in their natural habitats. From elusive big cats to colorful tropical birds, experience the diversity and beauty of Earth's fauna. Let these images spark your passion for wildlife conservation.",
    },
]

export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null)
    const carouselRef = useRef<HTMLDivElement>(null)
    const timeRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

    const showSlider = (type: 'next' | 'prev') => {
        setDirection(type)
        setCurrentIndex((prevIndex) => {
            const newIndex = type === 'next'
                ? (prevIndex + 1) % carouselItems.length
                : (prevIndex - 1 + carouselItems.length) % carouselItems.length

            // Pause the current video
            if (videoRefs.current[prevIndex]) {
                videoRefs.current[prevIndex]!.pause()
            }

            // Play the new video
            if (videoRefs.current[newIndex]) {
                videoRefs.current[newIndex]!.currentTime = 0
                videoRefs.current[newIndex]!.play()
            }

            return newIndex
        })

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setDirection(null)
        }, 500)
    }

    useEffect(() => {
        const autoNext = setInterval(() => {
            showSlider('next')
        }, 7000)

        return () => {
            clearInterval(autoNext)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        // Play the initial video
        if (videoRefs.current[currentIndex]) {
            videoRefs.current[currentIndex]!.play()
        }
    }, [currentIndex])

    return (
        <div className={`${styles.carousel} ${direction ? styles[direction] : ''}`} ref={carouselRef}>
            <div className={styles.list}>
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.item} ${index === currentIndex ? styles.active : ''}`}
                        style={{
                            zIndex: index === currentIndex ? 1 : 0,
                            opacity: index === currentIndex ? 1 : 0,
                        }}
                    >
                        <video
                            ref={(el) => { videoRefs.current[index] = el }} src={item.videoSrc}
                            loop
                            muted
                            playsInline
                            className={styles.video}
                        />
                        <div className={styles.content}>
                            <div className={styles.author}>{item.author}</div>
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.topic}>{item.topic}</div>
                            <div className={styles.des}>{item.description}</div>
                            <div className={styles.buttons}>
                                <button>SEE MORE</button>
                                <button>SUBSCRIBE</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.thumbnail}>
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.item} ${index === currentIndex ? styles.active : ''}`}
                        onClick={() => showSlider(index > currentIndex ? 'next' : 'prev')}
                    >
                        <Image src={item.imgSrc} alt={item.title} width={150} height={220} objectFit="cover" />
                        <div className={styles.content}>
                            <div className={styles.title}>Name Slider</div>
                            <div className={styles.description}>Description</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.arrows}>
                <button onClick={() => showSlider('prev')}>&lt;</button>
                <button onClick={() => showSlider('next')}>&gt;</button>
            </div>
            <div className={styles.time} ref={timeRef}></div>
        </div>
    )
}