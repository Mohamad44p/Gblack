"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const loadingTexts = ["Loading", "Please wait", "Almost there", "Hang tight"];

export default function Loading() {
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        const currentIndex = loadingTexts.indexOf(prevText);
        return loadingTexts[(currentIndex + 1) % loadingTexts.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <motion.div
        className="relative w-40 h-40"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute inset-0 rounded-full border-4 border-white opacity-20"
            style={{
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
        <motion.div
          className="absolute inset-4 rounded-full bg-white opacity-20"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <motion.p
        className="text-2xl font-bold mt-8 mb-4 text-white"
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {loadingText}
      </motion.p>
      <motion.div
        className="w-64 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="h-full bg-white"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <div className="mt-8 flex space-x-2">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-white"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
