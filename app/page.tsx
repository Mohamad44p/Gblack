import SecSection from "@/components/Sec/SecSection";
import Carousel from "@/components/slider/Carousel";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen">
       <Carousel />
       <SecSection/>
    </main>
  );
}
