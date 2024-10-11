"use client";

import React, { useRef } from "react";

import gsap from "gsap";
import { horizontalLoop } from "../helpers/horizontalLoop";
import { useGSAP } from "@gsap/react";

export default function Marquee({ elements, className, direction = "rtl", speed = 1 }: { elements: string[] | React.ReactNode[]; className?: string; direction?: "ltr" | "rtl"; speed?: number }) {
  const boxesContainer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray(".box");
      horizontalLoop(boxes, { repeat: -1, direction, speed: speed });
    },
    {
      scope: boxesContainer,
    }
  );

  return (
    <div className="w-full overflow-hidden">
      <div className={"wrapper py-2 flex items-center relative overflow-hidden w-full shrink-0 " + className} ref={boxesContainer}>
        {elements.map((el) => (
          <div key={`box-${el}`} className="box text-3xl px-8 flex items-center ">
            {el}
          </div>
        ))}
      </div>
    </div>
  );
}
