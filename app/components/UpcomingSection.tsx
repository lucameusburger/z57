import { CandyCane, CornerRightUp } from "lucide-react";

import SliderCard from "./SliderCard";
import adventImage from "@/app/images/events/advent.jpg";
import adventImage2 from "@/app/images/events/advent2.jpg";

export default function UpcomingSection() {
  return (
    <div className="flex flex-col gap-8 px-8">
      <div className=" flex items-start flex-col gap-4 md:col-span-2 justify-start relative ">
        <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
          <span className="text-2xl md:text-5xl">Upcoming</span>
          <a href="#top">
            <CornerRightUp className="w-6 h-6 " />
          </a>
          {/* <div className="flex gap-2">
                  <MailButton />
                </div> */}
        </div>
        <div className="flex gap-8 w-full flex-col md:flex-row">
          <a href="mailto:info@z57.at" className="order-2 md:order-1 flex-1 border-foreground hover:bg-background hover:text-foreground transition-colors w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
            <CandyCane className=" w-12 h-12" />
            <div className="flex flex-col gap-2">
              <span className="self-end text-xl">14. - 15. Dez 2024</span>
              <hr className="border-current" />
              <span className="self-end text-xl font-bold">Open Atelier Days</span>
            </div>
          </a>
          <div className="flex-1 h-96">
            <SliderCard images={[adventImage, adventImage2]} />
          </div>
        </div>
      </div>
    </div>
  );
}
