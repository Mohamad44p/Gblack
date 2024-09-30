import { Suspense } from "react";
import ImagesShow from "./ImagesShow";
import SkeletonLoader from "./SkeletonLoader";

export interface WordPressData {
  title: string;
  description: string;
  images: string[];
  logo: string;
}

async function getWordPressData(): Promise<WordPressData> {
  try {
    const res = await fetch(
      "https://lightpink-oryx-206000.hostingersite.com/wp-json/feacter-products/v1/section",
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching WordPress data:", error);
    throw error;
  }
}

export default async function ServerImages() {
  try {
    const data = await getWordPressData();
    return (
      <Suspense fallback={<SkeletonLoader />}>
        <ImagesShow data={data} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in Page component:", error);
    return <div>Error: Failed to load data. Please try again later.</div>;
  }
}