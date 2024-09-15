'use client';

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Suspense, useState } from "react";

interface ImageGalleryProps {
    images: Array<{
        id: number;
        src: string;
        alt: string;
    }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [bigImage, setBigImage] = useState(images[0]);

    const handleSmallImageClick = (image: typeof images[0]) => {
        setBigImage(image);
    }

    return (
        <div className="grid gap-4 lg:grid-cols-5">
            <div className="order-last flex gap-4 lg:order-none lg:flex-col">
                <Suspense
                    fallback={
                        <>
                            {images.map((image) => (
                                <div className="flex flex-col space-y-3" key={image.id}>
                                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </>
                    }
                >
                    {images.map((image) => (
                        <div key={image.id} className="overflow-hidden rounded-lg bg-gray-100 shadow-2xl shadow-gray-300">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                className="h-full w-full object-cover object-center cursor-pointer"
                                width={200}
                                height={200}
                                onClick={() => handleSmallImageClick(image)}
                            />
                        </div>
                    ))}
                </Suspense>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4 dark:shadow-2xl dark:shadow-gray-300">
                <Image
                    src={bigImage.src}
                    alt={bigImage.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                    width={500}
                    height={500}
                />

                <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm tracking-wider text-white">SALE</span>
            </div>
        </div>
    );
}