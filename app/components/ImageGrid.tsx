"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/app/components/ui/carousel";
import Image, { StaticImageData } from "next/image";

import Autoplay from "embla-carousel-autoplay";
// Images from 20241126
import img7534 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7534.jpg";
import img7535 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7535.jpg";
import img7536 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7536.jpg";
import img7539 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7539.jpg";
import img7542 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7542.jpg";
import img7548 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7548.jpg";
import img7550 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7550.jpg";
import img7553 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7553.jpg";
import img7558 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7558.jpg";
import img7559 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7559.jpg";
import img7560 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7560.jpg";
import img7568 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7568.jpg";
import img7571 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7571.jpg";
import img7573 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7573.jpg";
import img7575 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7575.jpg";
import img7578 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7578.jpg";
import img7581 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7581.jpg";
import img7582 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7582.jpg";
import img7584 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7584.jpg";
import img7586 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7586.jpg";
import img7590 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7590.jpg";
import img7592 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7592.jpg";
import img7597 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7597.jpg";
import img7601 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7601.jpg";
import img7606 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7606.jpg";
import img7608 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7608.jpg";
import img7611 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7611.jpg";
import img7617 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7617.jpg";
import img7619 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7619.jpg";
import img7623 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7623.jpg";
import img7626 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7626.jpg";
import img7628 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7628.jpg";
import img7647 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7647.jpg";
import img7651 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7651.jpg";
import img7659 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7659.jpg";
import img7667 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7667.jpg";
import img7670 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7670.jpg";
import img7675 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7675.jpg";
import img7686 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7686.jpg";
import img7691 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7691.jpg";
import img7694 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7694.jpg";
import img7704 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7704.jpg";
import img7712 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7712.jpg";
import img7715 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7715.jpg";
import img7724 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7724.jpg";
import img7728 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7728.jpg";
import img7731 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7731.jpg";
import img7735 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7735.jpg";
import img7736 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7736.jpg";
import img7737 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7737.jpg";
import img7740 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7740.jpg";
import img7742 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7742.jpg";
import img7752 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7752.jpg";
import img7758 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7758.jpg";
import img7799 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7799.jpg";
import img7800 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7800.jpg";
import img7810 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7810.jpg";
import img7815 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7815.jpg";
import img7820 from "@/app/images/house/20241126_Z57_NikoHavranek_web-7820.jpg";
// Images from 20241114
import img8282 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8282.jpg";
import img8283 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8283.jpg";
import img8284 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8284.jpg";
import img8286 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8286.jpg";
import img8289 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8289.jpg";
import img8290 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8290.jpg";
import img8293 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8293.jpg";
import img8884 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8884.jpg";
import img8888 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8888.jpg";
import img8891 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8891.jpg";
import img8893 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8893.jpg";
import img8895 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8895.jpg";
import img8899 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8899.jpg";
import img8901 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8901.jpg";
import img8903 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8903.jpg";
import img8905 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8905.jpg";
import img8907 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8907.jpg";
import img8908 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8908.jpg";
import img8912 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8912.jpg";
import img8913 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8913.jpg";
import img8914 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8914.jpg";
import img8915 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8915.jpg";
import img8919 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8919.jpg";
import img8921 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8921.jpg";
import img8923 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8923.jpg";
import img8930 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8930.jpg";
import img8934 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8934.jpg";
import img8935 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8935.jpg";
import img8937 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8937.jpg";
import img8939 from "@/app/images/house/20241114_Z57_NikoHavranek_web-8939.jpg";
import { useMemo } from "react";

export default function ImageGrid() {
  // Combine all images into one array
  const allImages = useMemo<StaticImageData[]>(
    () => [
      img7534,
      img7535,
      img7536,
      img7539,
      img7542,
      img7548,
      img7550,
      img7553,
      img7558,
      img7559,
      img7560,
      img7568,
      img7571,
      img7573,
      img7575,
      img7578,
      img7581,
      img7582,
      img7584,
      img7586,
      img7590,
      img7592,
      img7597,
      img7601,
      img7606,
      img7608,
      img7611,
      img7617,
      img7619,
      img7623,
      img7626,
      img7628,
      img7647,
      img7651,
      img7659,
      img7667,
      img7670,
      img7675,
      img7686,
      img7691,
      img7694,
      img7704,
      img7712,
      img7715,
      img7724,
      img7728,
      img7731,
      img7735,
      img7736,
      img7737,
      img7740,
      img7742,
      img7752,
      img7758,
      img7799,
      img7800,
      img7810,
      img7815,
      img7820,
      img8282,
      img8283,
      img8284,
      img8286,
      img8289,
      img8290,
      img8293,
      img8884,
      img8888,
      img8891,
      img8893,
      img8895,
      img8899,
      img8901,
      img8903,
      img8905,
      img8907,
      img8908,
      img8912,
      img8913,
      img8914,
      img8915,
      img8919,
      img8921,
      img8923,
      img8930,
      img8934,
      img8935,
      img8937,
      img8939,
    ],
    []
  );

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {allImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Image
                src={image}
                alt={`House image ${index + 1}`}
                className="w-full object-cover rounded-2xl h-[40vh]"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
