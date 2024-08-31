'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './style.module.css';

interface Category {
  name: string;
  description: string;
  src: string;
}

interface DoubleProps {
  categories: [Category, Category];
  reversed: boolean;
}

export default function Double({ categories, reversed }: DoubleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    containerRef.current.style.setProperty('--mouse-x', `${percentage}%`);
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`${styles.double} ${reversed ? styles.reversed : ''}`}
    >
      {categories.map((category, index) => (
        <div
          key={category.name}
          className={`${styles.imageContainer} ${activeIndex === index ? styles.active : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.stretchyWrapper}>
            <Image
              src={`/images/${category.src}`}
              fill
              alt={category.name}
              className={styles.image}
            />
          </div>
          <div className={styles.body}>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}