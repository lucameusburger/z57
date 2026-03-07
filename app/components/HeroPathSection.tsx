"use client";

import { useEffect, useId, useRef, useState } from "react";

const HERO_PATH_TEXT =
  "z57 atelier and studio space vienna . grafik . nailart . architektur . webentwicklung . fotografie . design . exhibitions . workshops . co-working . ";

function buildRoundedRectPath(width: number, height: number, padding: number, radius: number) {
  const left = padding;
  const top = padding;
  const right = width - padding;
  const bottom = height - padding;
  const safeRadius = Math.min(radius, (right - left) / 2, (bottom - top) / 2);

  return [
    `M ${left + safeRadius} ${top}`,
    `H ${right - safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${right} ${top + safeRadius}`,
    `V ${bottom - safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${right - safeRadius} ${bottom}`,
    `H ${left + safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${left} ${bottom - safeRadius}`,
    `V ${top + safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${left + safeRadius} ${top}`,
    "Z",
  ].join(" ");
}

export default function HeroPathSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathId = useId().replace(/:/g, "");
  const [size, setSize] = useState({ width: 1200, height: 900 });

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.max(entry.contentRect.width, 1),
        height: Math.max(entry.contentRect.height, 1),
      });
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const padding = Math.max(24, Math.min(size.width, size.height) * 0.045);
  const radius = Math.max(34, Math.min(size.width, size.height) * 0.08);
  const fontSize = Math.max(
    18,
    Math.min(size.width, size.height) * (size.width >= 768 ? 0.034 : 0.027)
  );
  const pathDefinition = buildRoundedRectPath(size.width, size.height, padding, radius);

  return (
    <section
      ref={containerRef}
      className="hero-screen-block relative isolate overflow-hidden rounded-[2.5rem] text-foreground"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${size.width} ${size.height}`}
      >
        <path id={pathId} d={pathDefinition} fill="none" />
        <text
          className="hero-path-text"
          style={{
            fontSize: `${fontSize}px`,
          }}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {HERO_PATH_TEXT}
            <animate
              attributeName="startOffset"
              dur="28s"
              from="0%"
              repeatCount="indefinite"
              to="100%"
            />
          </textPath>
          <textPath href={`#${pathId}`} startOffset="-100%">
            {HERO_PATH_TEXT}
            <animate
              attributeName="startOffset"
              dur="28s"
              from="-100%"
              repeatCount="indefinite"
              to="0%"
            />
          </textPath>
        </text>
      </svg>

      <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[clamp(4.5rem,16vw,19rem)] font-black leading-none tracking-[-0.08em]">
        z57
      </span>
    </section>
  );
}
