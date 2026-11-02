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
  initialImageLimit?: number;
}

export default function PostGallery({
  images,
  title,
  priorityFirstImage = false,
  initialImageLimit = 12,
}: PostGalleryProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);
  const [visibleImageCount, setVisibleImageCount] = React.useState(() =>
    Math.min(images.length, initialImageLimit),
  );
  const visibleImages = images.slice(0, visibleImageCount);
  const remainingImageCount = images.length - visibleImages.length;
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

  if (images.length === 0) {
    return null;
  }

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
        <CarouselContent className="ml-0">
          {visibleImages.map((image, index) => (
            <CarouselItem
              key={`${image.src}-${index}`}
              className="basis-[72%] border-r pl-0 sm:basis-[46%] md:basis-[34%] lg:basis-1/4"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt || `${title} ${index + 1}`}
                  fill
                  priority={priorityFirstImage && index === 0}
                  loading={priorityFirstImage && index === 0 ? undefined : "lazy"}
                  sizes="(max-width: 640px) 72vw, (max-width: 768px) 46vw, (max-width: 1024px) 34vw, 25vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-stretch justify-between border-t">
        <div className="flex">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="inline-flex h-12 w-12 items-center justify-center border-r transition-colors hover:bg-foreground hover:text-background"
            aria-label="Vorherige Bilder"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="inline-flex h-12 w-12 items-center justify-center border-r transition-colors hover:bg-foreground hover:text-background"
            aria-label="Nächste Bilder"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-1.5 px-4 sm:flex md:px-7">
          {indicatorTargets.map((target, index) => (
            <button
              key={`${target}-${index}`}
              type="button"
              onClick={() => api?.scrollTo(target)}
              className={cn(
                "h-2.5 border border-foreground transition-all",
                index === activeIndicator
                  ? "w-8 bg-foreground"
                  : "w-2.5 hover:bg-foreground"
              )}
              aria-label={`Gehe zu Bildgruppe ${index + 1}`}
            />
          ))}
        </div>

        {remainingImageCount > 0 ? (
          <button
            type="button"
            onClick={() =>
              setVisibleImageCount((count) =>
                Math.min(images.length, count + initialImageLimit),
              )
            }
            className="border-l px-4 transition-colors hover:bg-foreground hover:text-background md:px-7"
          >
            Weitere Bilder laden ({remainingImageCount})
          </button>
        ) : null}
      </div>
    </div>
  );
}
