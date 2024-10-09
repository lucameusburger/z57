"use client";

import React, { CSSProperties, useRef } from "react";

import Image from "next/image";
import groupGlassImage from "@/app/images/group-glass.png";
import groupImage from "@/app/images/group.jpg";

const GlassCardWithRevealEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--mouse-x", `-9999px`);
      containerRef.current.style.setProperty("--mouse-y", `-9999px`);
    }
  };

  return (
    <div ref={containerRef} className="container w-full h-full rounded-3xl overflow-hidden bg-foreground cursor-none" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ "--mouse-x": "-9999px", "--mouse-y": "-9999px" } as CSSProperties}>
      <Image src={groupImage} alt="Group Image" className="revealed-image" layout="fill" objectFit="cover" />
      <Image src={groupGlassImage} alt="Group Glass Image" className="masked-image" layout="fill" objectFit="cover" />
    </div>
  );
};

export default GlassCardWithRevealEffect;
