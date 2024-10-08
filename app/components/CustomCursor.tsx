"use client";

import React, { useEffect, useRef, useState } from "react";
// Define cursor colors
const CURSOR_COLORS = {
  h1: "green-400",
  button: "orange-500",
  default: "sky-500",
};
// Main CustomCursor component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Event listener for mouse movement
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // useEffect runs only once on mount

  return (
    <>
      <div style={{ top: position.y, left: position.x }} ref={cursorRef} className={`fixed pointer-events-none transition-all -translate-x-1/2 -translate-y-1/2 z-50 ease-in duration-300 rounded-full w-3 h-3 bg-foreground`} />
    </>
  );
};

export default CustomCursor;
