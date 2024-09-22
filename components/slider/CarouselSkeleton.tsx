export default function CarouselSkeleton() {
    return (
      <div className="relative h-[50vh] md:h-[70vh] lg:h-[85vh] w-full overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute top-[10%] md:top-[20%] left-5 w-full max-w-xs md:max-w-md lg:max-w-2xl p-4">
          <div className="h-8 md:h-12 lg:h-16 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 md:h-6 lg:h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-20 md:h-24 lg:h-32 bg-gray-300 rounded mb-4"></div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="h-10 md:h-12 w-full md:w-1/2 bg-gray-300 rounded"></div>
            <div className="h-10 md:h-12 w-full md:w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }