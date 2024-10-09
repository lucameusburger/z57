"use client";

import React, { useEffect, useState } from "react";

const AnimatedText = () => {
  const [boldIndex, setBoldIndex] = useState(0);
  const words = ["Grafik", "Nailart", "Architektur", "Webentwicklung", "Fotografie", "Design"];
  const totalLength = words.join("").length;

  useEffect(() => {
    const interval = setInterval(() => {
      setBoldIndex((prev) => (prev + 1) % totalLength);
    }, 100); // Adjust the speed here as needed
    return () => clearInterval(interval);
  }, []);

  const renderText = (words: string[]) => {
    let currentLength = 0;
    return words.map((word, index) => {
      return (
        <span key={index} style={{ display: "flex" }}>
          {[...word].map((char, charIndex) => {
            const isBold = currentLength + charIndex === boldIndex;
            return (
              <span
                key={charIndex}
                style={{
                  fontWeight: isBold ? "900" : "normal",
                  transition: "all 0.3s",
                  display: "inline-block",
                  position: "relative",
                  // Slight transformation to mask shifts
                  transform: isBold ? "scale(1.1)" : "none",
                }}
              >
                {char}
              </span>
            );
          })}
          <span className="hidden">{(currentLength += word.length)}</span>
        </span>
      );
    });
  };

  return <div className="flex items-end justify-end flex-col text-4xl md:text-5xl flex-1">{renderText(words)}</div>;
};

export default AnimatedText;
