import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

interface ShapeProps {
  className?: string;
}

function Svg({
  viewBox,
  className,
  children,
}: ShapeProps & { viewBox: string; children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      fill="currentColor"
      className={cn("block", className)}
    >
      {children}
    </svg>
  );
}

/* Large shapes, drawn on a 300 unit square tile. */

const LARGE_SHAPES = {
  sideBySidePills: (
    <>
      <rect x="25" y="25" width="128" height="250" rx="64" />
      <rect x="147" y="25" width="128" height="250" rx="64" />
    </>
  ),
  stackedPills: (
    <>
      <rect x="25" y="25" width="250" height="128" rx="64" />
      <rect x="25" y="147" width="250" height="128" rx="64" />
    </>
  ),
  clover: (
    <>
      <circle cx="92.5" cy="92.5" r="67.5" />
      <circle cx="207.5" cy="92.5" r="67.5" />
      <circle cx="92.5" cy="207.5" r="67.5" />
      <circle cx="207.5" cy="207.5" r="67.5" />
      <rect x="92.5" y="92.5" width="115" height="115" />
    </>
  ),
  cup: (
    <path d="M25 60a35 35 0 0 1 35-35h180a35 35 0 0 1 35 35v90a125 125 0 0 1-250 0z" />
  ),
};

type LargeShapeName = keyof typeof LARGE_SHAPES;

export function LargeShape({
  name,
  className,
}: ShapeProps & { name: LargeShapeName }) {
  return (
    <Svg viewBox="0 0 300 300" className={className}>
      {LARGE_SHAPES[name]}
    </Svg>
  );
}

/** Cuts its children to a large shape, scaled to the size of the element. */
export function ShapeMask({
  name,
  className,
  children,
}: ShapeProps & { name: LargeShapeName; children: React.ReactNode }) {
  const clipId = `shape-mask-${name}`;

  return (
    <>
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <clipPath
          id={clipId}
          clipPathUnits="objectBoundingBox"
          transform={`scale(${1 / 300})`}
        >
          {LARGE_SHAPES[name]}
        </clipPath>
      </svg>
      <div className={className} style={{ clipPath: `url(#${clipId})` }}>
        {children}
      </div>
    </>
  );
}

/* Small glyphs, drawn on a 100 unit square. */

export function QuarterGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M100 12v76a12 12 0 0 1-12 12H4a4 4 0 0 1-4-4C0 44 40 0 88 0a12 12 0 0 1 12 12z" />
    </Svg>
  );
}

export function PillsGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <rect x="0" y="0" width="52" height="100" rx="26" />
      <rect x="48" y="0" width="52" height="100" rx="26" />
    </Svg>
  );
}

export function CloverGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <circle cx="27" cy="27" r="27" />
      <circle cx="73" cy="27" r="27" />
      <circle cx="27" cy="73" r="27" />
      <circle cx="73" cy="73" r="27" />
      <rect x="27" y="27" width="46" height="46" />
    </Svg>
  );
}

export function DartsGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 3a47 47 0 0 1 0 94z" />
      <path d="M50 3a47 47 0 0 1 0 94z" />
    </Svg>
  );
}

function BarsGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <rect x="0" y="0" width="100" height="52" rx="26" />
      <rect x="0" y="48" width="100" height="52" rx="26" />
    </Svg>
  );
}

function ArchGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 100V50a50 50 0 0 1 100 0v50z" />
    </Svg>
  );
}

function RingGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path
        fillRule="evenodd"
        d="M50 0a50 50 0 1 1 0 100A50 50 0 0 1 50 0zm0 30a20 20 0 1 0 0 40 20 20 0 0 0 0-40z"
      />
    </Svg>
  );
}

function HourglassGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 0h100a50 50 0 0 1-100 0z" />
      <path d="M0 100a50 50 0 0 1 100 0z" />
    </Svg>
  );
}

function LeafGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 0h55a45 45 0 0 1 45 45v55H45A45 45 0 0 1 0 55z" />
    </Svg>
  );
}

function PinwheelGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 0h48v48A48 48 0 0 1 0 0z" />
      <path d="M100 0v48H52A48 48 0 0 1 100 0z" />
      <path d="M100 100H52V52a48 48 0 0 1 48 48z" />
      <path d="M0 100V52h48a48 48 0 0 1-48 48z" />
    </Svg>
  );
}

function CupGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 12A12 12 0 0 1 12 0h76a12 12 0 0 1 12 12v38A50 50 0 0 1 0 50z" />
    </Svg>
  );
}

function DropGlyph({ className }: ShapeProps) {
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <path d="M0 50A50 50 0 0 1 50 0h50v50A50 50 0 0 1 0 50z" />
    </Svg>
  );
}

/** One distinct glyph per entry; the list only repeats past its length. */
export const GLYPHS: ComponentType<ShapeProps>[] = [
  QuarterGlyph,
  PillsGlyph,
  CloverGlyph,
  DartsGlyph,
  ArchGlyph,
  BarsGlyph,
  RingGlyph,
  HourglassGlyph,
  PinwheelGlyph,
  LeafGlyph,
  CupGlyph,
  DropGlyph,
];
