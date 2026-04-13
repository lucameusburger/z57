"use client";

import * as React from "react";

import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PostGalleryProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  title: string;
  priorityFirstImage?: boolean;
}

export default function PostGallery({
  images,
  title,
  priorityFirstImage = false,
}: PostGalleryProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);
  const indicatorCount = Math.min(snapCount, 8);
  const indicatorTargets = React.useMemo(() => {
    if (indicatorCount === 0) {
      return [];
    }

    if (indicatorCount === 1) {
      return [0];
    }

    return Array.from({ length: indicatorCount }, (_, index) =>
      Math.round((index * Math.max(snapCount - 1, 0)) / (indicatorCount - 1))
    );
  }, [indicatorCount, snapCount]);
  const activeIndicator = React.useMemo(() => {
    if (indicatorTargets.length === 0) {
      return 0;
    }

    return indicatorTargets.reduce((closestIndex, target, index) => {
      const currentDistance = Math.abs(target - selectedIndex);
      const closestDistance = Math.abs(indicatorTargets[closestIndex] - selectedIndex);

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);
  }, [indicatorTargets, selectedIndex]);

  if (images.length === 0) {
    return null;
  }

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    const handleInit = () => {
      setSnapCount(api.scrollSnapList().length);
      handleSelect();
    };

    handleInit();
    api.on("reInit", handleInit);
    api.on("select", handleSelect);

    return () => {
      api.off("reInit", handleInit);
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="w-full">
      <Carousel
        className="w-full"
        plugins={[autoplay.current]}
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {images.map((image, index) => (
            <CarouselItem
              key={`${image.src}-${index}`}
              className="pl-2 md:pl-3 basis-[72%] sm:basis-[46%] md:basis-[34%] lg:basis-[26%] xl:basis-[21%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-foreground bg-background">
                <Image
                  src={image.src}
                  alt={image.alt || `${title} ${index + 1}`}
                  fill
                  priority={priorityFirstImage && index === 0}
                  sizes="(max-width: 640px) 72vw, (max-width: 768px) 46vw, (max-width: 1024px) 34vw, (max-width: 1280px) 26vw, 21vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground bg-background transition-colors hover:bg-foreground hover:text-background"
            aria-label="Vorherige Bilder"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground bg-background transition-colors hover:bg-foreground hover:text-background"
            aria-label="Nächste Bilder"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 justify-end gap-2">
          {indicatorTargets.map((target, index) => (
            <button
              key={`${target}-${index}`}
              type="button"
              onClick={() => api?.scrollTo(target)}
              className={cn(
                "h-2.5 rounded-full border border-foreground transition-all",
                index === activeIndicator
                  ? "w-8 bg-foreground"
                  : "w-2.5 bg-background hover:bg-foreground/20"
              )}
              aria-label={`Gehe zu Bildgruppe ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
