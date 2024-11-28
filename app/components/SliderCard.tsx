"use client";

import { AnimatePresence, motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";

interface Props {
  images: StaticImageData[];
}

export default function SliderCard({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="h-full overflow-hidden rounded-2xl group cursor-pointer relative"
      onClick={() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      }}
    >
      <div className="relative h-full w-full">
        <AnimatePresence initial={false}>
          <motion.div key={currentIndex} className="absolute h-full w-full" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5 }}>
            <Image src={images[currentIndex]} alt="Gruppenfoto" width={800} height={400} className="w-full h-full rounded-none object-cover contrast-2 scale-100 group-hover:scale-110 transition-all transform object-center" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
