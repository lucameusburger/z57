import { CornerRightUp, Instagram, Mail, User } from "lucide-react";
import { Member, members } from "./members";

import GlassCardWithRevealEffect from "./components/GlassCardWithRevealEffect";
import Image from "next/image";
import ImageGrid from "./components/ImageGrid";
import Marquee from "./components/Marquee";
import MemberItem from "./components/MemberItem";
import Model3D from "./components/Model3D";
import UpcomingSection from "./components/UpcomingSection";
import groupGlassImage from "@/app/images/group-glass.jpg";
import groupImage from "@/app/images/group.jpg";

// const generateRandomPolygonPoints = () => {
//   const min = 10; // Minimum value for a point
//   const max = 100; // Maximum value for a point
//   const points = Array.from({ length: 4 }, () => `${Math.random() * (max - min) + min},${Math.random() * (max - min) + min}`).join(" ");
//   return points;
// };

export default function Home() {
  function shuffleArray(array: Member[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledMembers = shuffleArray([...members]);

  return (
    <>
      <div className="items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col w-full">
          {/* FRONT */}
          <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-3 w-full gap-8  p-4 md:p-8 min-full-viewport-height">
            {/* full-viewport-height */}
            <div className="flex items-end justify-end flex-col text-4xl md:text-5xl flex-1">
              <span>Grafik</span>

              <span>Nailart</span>

              <span>Architektur</span>

              <span>Webentwicklung</span>

              <span>Fotografie</span>

              <span>Design</span>
            </div>
            {/* <AnimatedText /> */}
            <div className=" md:col-span-2 aspect-square md:aspect-auto w-full justify-items-end flex items-end justify-end relative ">
              <span className="text-woit z-50 absolute bottom-8 right-8 font-black text-8xl tracking-tight pointer-events-none">Z57</span>
              <GlassCardWithRevealEffect />
              {/* <div className="relative overflow-hidden rounded-3xl glassCard w-full h-full items-end justify-end p-8 flex ">
                <Image src={groupGlassImage} alt={"Gruppenfoto"} width={800} height={1920} className=" z-10 absolute left-0 right-0 bottom-0 top-0 w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
                <Image src={groupImage} alt={"Gruppenfoto"} width={800} height={1920} className=" absolute left-0 right-0 bottom-0 top-0 w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
                
              </div> */}
            </div>
          </div>

          {/* UPCOMING */}
          <UpcomingSection />

          <div className="h-8" />
          <div className="px-4 md:px-8">
            <Marquee
              className="bg-foreground text-background"
              elements={["co-working",
                "workshops",
                "exhibitions",
                "events",
                "design",
                "architecture",
                "photography",
                "nailart",
                "software development",
                "UI/UX",
                "restauration",
                "conservation"]}
            />
          </div>

          <div className="h-8" />

          <div className="px-4 md:px-8">
            <div className="flex pb-8 justify-between items-center w-full border-t border-foreground pt-4">
              <span className="text-2xl md:text-5xl">Das Atelier</span>
              <a href="#top">
                <CornerRightUp className="w-6 h-6 " />
              </a>
              {/* <div className="flex gap-2">
                  <MailButton />
                </div> */}
            </div>

            <div className="flex md:flex-row flex-col gap-8  pb-8">
              {/* <div className="flex-none max-w-1/3 md:w-96  border-foreground border overflow-hidden relative rounded-3xl h-full bg-white flex items-center justify-center">
                <SliderCard images={[rissImg1, rissImg2]} />
              </div> */}
              <p className=" text-2xl">
                Das Atelier Z57 befindet sich im Herzen des 7. Bezirks an der Zieglergasse 57. Über den Dächern Wiens erstrecken sich die Räumlichkeiten über drei Dachgeschosse, wo sie einst als Architekturbüro in den 70er Jahren angelegt und für 40 Jahre eben diesem Zweck entsprechend genutzt wurden. Wer sich längere Zeit im geräumigen und doch verwinkelten Atelier aufhält, erkennt die verschiedenen Bauphasen, die der ausgebaute Dachboden über den langen Zeitraum der Entstehung erfahren hat und
                welche ganz eigenen und unverwechselbaren Details er mit sich bringt. Herzstück bildet ein 200 qm großes Flachdach mit Dachgarten, das anstelle der zweiten Dachhälfte hofseitig angelegt wurde.
              </p>
            </div>
            <ImageGrid />
          </div>

          <div className="h-8" />

          {/* ABOUT */}
          {/* <div className="flex flex-col gap-8 px-4 md:px-8 pt-8">
            <div className=" flex items-start flex-col gap-4 md:col-span-2 justify-start relative ">
              <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
                <span className="text-2xl md:text-5xl">Über uns</span>
                <a href="#top">
                  <CornerRightUp className="w-6 h-6 " />
                </a>
              </div>
              <div className="flex gap-8 w-full flex-col md:flex-row">
                <div className="flex flex-col gap-8">
                  <div className=" rounded-3xl contrast-2 group-hover:scale-110 transition-all transform border-foreground border ">
                    <div className="p-4">
                      <span className="text-xl rounded-full text-background bg-foreground py-1 px-2 ">Hello</span>
                      <span className=" text-xl py-1 px-2">Wir sind gerne auf unserem Dach und freuen uns über neue Ideen und Projekte.</span>
                    </div>

                    <Marquee speed={2} direction="ltr" className="bg-background text-foreground" elements={[<BeanOff key={1} />, <Bean key={2} />, <BeanOff key={4} />, <Bean key={5} />, <BeanOff key={6} />, <Bean key={7} />, <BeanOff key={8} />, <Bean key={9} />, <BeanOff key={10} />, <Bean key={11} />, <BeanOff key={12} />, <Bean key={13} />, <BeanOff key={14} />]} />
                    <div className="p-4">
                      <span className=" text-xl py-1 px-2">Wir arbeiten einzeln, zusammen und in Teams. Wir sind eine Gruppe aus Menschen mit unterschiedlichen Hintergründen und Interessen. Wir arbeiten an Projekten, die sich an der Zukunft und unserer Zukunft orientieren. Wir sind ein Team von Menschen, die sich für Innovation und Entwicklung einsetzen.</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl contrast-2 border-foreground border ">
                    <span className="text-xl rounded-full text-background bg-foreground py-1 px-2 ">Hello</span>
                    <span className=" text-xl py-1 px-2">Wir sind gerne auf unserem Dach und freuen uns über neue Ideen und Projekte.</span>
                  </div>
                </div>
                <div className="  border-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
                  <div className="flex justify-between ">
                    <Cctv className=" w-12 h-12" />
                    <div className="h-3 w-3 bg-current rounded-full  relative">
                      <div className="h-3 w-3 bg-current rounded-full absolute animate-ping" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="self-end text-xl">{new Date().toDateString()}</span>
                    <hr className="border-current" />
                    <span className="self-end text-xl font-bold">Zieglergasse Dach</span>
                  </div>
                  <div className=" h-[50vh] w-full relative">
                    <video className=" pointer-events-none h-full w-full object-cover rounded-2xl" autoPlay loop muted>
                      <source src="outside.mp4" type="video/mp4" />
                    </video>
                    <span className="absolute bottom-4 right-4 text-3xl text-woit">
                      <Clock />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* MEMBERS */}
          <div className="flex flex-col gap-8 py-8 px-4 md:px-8">
            <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
              <span className="text-2xl md:text-5xl">Wer wir sind</span>
              <a href="#top">
                <CornerRightUp className="w-6 h-6 " />
              </a>
              {/* <div className="flex gap-2">
                  <MailButton />
                </div> */}
            </div>
            {shuffledMembers.map((member, index) => (
              <>
                <MemberItem key={member.name} member={member} switched={index} />
                {/* {index !== members.length - 1 && <hr className="border-foreground" />} */}
              </>
            ))}
          </div>

          <div className="px-4 md:px-8">
            <div className="flex pb-8 justify-between items-center w-full border-t border-foreground pt-4">
              <span className="text-2xl md:text-5xl">In drei Dimensionen</span>
              <a href="#top">
                <CornerRightUp className="w-6 h-6 " />
              </a>
              {/* <div className="flex gap-2">
                  <MailButton />
                </div> */}
            </div>
            <Model3D />
          </div>

          {/* KONTAKT */}
          <div className="flex flex-col gap-8 py-8 px-4 md:px-8">
            <div className="member-content flex items-start flex-col gap-4 md:col-span-2 justify-start relative">
              <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
                <span className="text-2xl md:text-5xl">Get in touch</span>
                <a href="#top">
                  <CornerRightUp className="w-6 h-6 " />
                </a>
                {/* <div className="flex gap-2">
                  <MailButton />
                </div> */}
              </div>
              <div className="flex gap-8 w-full flex-col md:flex-row">
                <a href="mailto:atelier@z57.at" className="border-foreground hover:bg-background transition-colors hover:text-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
                  <Mail className=" w-12 h-12" />
                  <div className="flex flex-col gap-2">
                    <hr className="border-current" />
                    <span className="self-end text-xl">atelier@z57.at</span>
                  </div>
                </a>
                <a href="https://www.instagram.com/z57.at/" className="border-foreground hover:bg-background transition-colors hover:text-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
                  <Instagram className=" w-12 h-12" />
                  <div className="flex flex-col gap-2">
                    <hr className="border-current" />
                    <span className="self-end text-xl">z57.at</span>
                  </div>
                </a>
                <div className="border-foreground w-full flex flex-col gap-4 justify-between border overflow-hidden relative rounded-3xl p-4">
                  <User className=" w-12 h-12" />
                  <div className="flex flex-col gap-2">
                    <span className="text-xl">Schreib uns!</span>
                  </div>
                </div>
                <Image src={groupImage} alt={"Grupenfoto"} width={200} height={200} className="w-full h-64 rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
              </div>
              {/* <div className="border-foreground border overflow-hidden relative rounded-3xl w-full p-4">
                <span className="text-xl py-1 px-2">Hallo</span>
              </div> */}
            </div>
          </div>
        </main>
        <footer className="px-4 md:px-8 w-full">
          <hr className="border-foreground" />
          <div className="py-8 justify-between gap-4 flex flex-col md:flex-row">
            <div className="flex gap-2 flex-col md:flex-row">
              <div className="flex flex-col gap-2">
                <span className="text-xl rounded-full text-background bg-foreground py-1 px-2">Copyright z57 © 2025</span>
                <span className="text-xl rounded-full text-background bg-foreground py-1 px-2">ZVR 1169564571</span>
              </div>
              <div>
                <span
                  style={{
                    backgroundImage: `url(${groupGlassImage.src})`,
                    backgroundSize: "cover",
                  }}
                  className="text-xl rounded-full text-background bg-foreground py-1 px-2"
                >
                  Website by Luca Meusburger
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-xl text-foreground py-1 px-2">info</span>
              <span className="text-xl text-foreground py-1 px-2">cookies</span>
              <span className="text-xl text-foreground py-1 px-2">contact</span>
            </div>
          </div>
        </footer>

        {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="https://nextjs.org/icons/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="https://nextjs.org/icons/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="https://nextjs.org/icons/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer> */}
      </div>
    </>
  );
}
