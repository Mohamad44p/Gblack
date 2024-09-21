export default function CarouselSkeleton() {
    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-gray-200 animate-pulse">
            <div className="absolute top-[20%] left-5 w-full max-w-2xl p-4 md:left-10 lg:left-20">
                <div className="h-10 w-3/4 bg-gray-300 mb-4"></div>
                <div className="h-6 w-1/2 bg-gray-300 mb-6"></div>
                <div className="h-20 w-full bg-gray-300 mb-8"></div>
                <div className="flex gap-4">
                    <div className="h-10 w-32 bg-gray-300"></div>
                    <div className="h-10 w-32 bg-gray-300"></div>
                </div>
            </div>
            <div className="absolute bottom-4 right-4 z-10 flex gap-2 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-24 w-16 bg-gray-300 rounded-lg md:h-32 md:w-24 lg:h-40 lg:w-28"></div>
                ))}
            </div>
        </div>
    );
}