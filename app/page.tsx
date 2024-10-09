import { CandyCane, CornerRightUp, Globe, Instagram, Mail, MoveRight, User } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import GlassCardWithRevealEffect from "./components/GlassCardWithRevealEffect";
import adventImage from "@/app/images/events/advent.jpg";
import groupImage from "@/app/images/group.jpg";
import irisImage from "@/app/images/iris.jpg";
import liliImage from "@/app/images/lili.jpg";
import lucaImage from "@/app/images/luca.jpg";
import nikoImage from "@/app/images/niko.jpg";
import robertImage from "@/app/images/robert.jpg";
import stellaImage from "@/app/images/stella.jpg";
import victorImage from "@/app/images/victor.jpg";

interface Member {
  name: string;
  image: StaticImageData;
  title: string;
  description: string;
  email: string;
  website?: string;
  projects?: Project[];
}

interface Project {
  name: string;
  url: string;
}

const members: Member[] = [
  {
    name: "Robert Zanona",
    image: robertImage,
    title: "Architektur",
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
    email: "robert@example.com",
    projects: [
      {
        name: "Poolbar Festival",
        url: "https://poolbar.at",
      },
      {
        name: "west68",
        url: "https://west68.at",
      },
    ],
  },
  {
    name: "Lilian Furrer",
    image: liliImage,
    title: "Restauration",
    description: "Mag. Lilian Marie Furrer ist Mitbegründerin von z57 und freiberufliche Konservatorin/Restauratorin und Industriedesignerin, die in beiden Bereichen interdisziplinär arbeitet. Mit ihrem Interesse für Materialität, kulturelles Erbe und innovatives Design arbeitet sie objekt- und forschungsbasiert für kulturelle Institutionen und Firmen. In ihrer Freizeit widmet sie sich am liebsten der Keramik im kleinen z57 Keramikstudio.",
    email: "lili@example.com",
    projects: [
      {
        name: "Restauration Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "IKEA Designweek",
        url: "asd",
      },
    ],
  },
  {
    name: "Luca Meusburger",
    image: lucaImage,
    title: "Webentwicklung",
    description: "Luca ist ein freiberuflicher Webentwickler und Designer, der mit modernen Technologien und aktuellen Standards arbeitet, um ästhetische und benutzerfreundliche digitale Lösungen zu schaffen. Sein Fokus liegt auf anspruchsvollen Projekten wie Dashboards und mobilen Apps, bei denen er sowohl die Frontend- und Backend-Entwicklung übernimmt als auch die Gestaltung von UI und UX. Viele seiner Arbeiten sind im Kultur- und Bildungsbereich angesiedelt.",
    email: "luca@example.com",
    website: "https://meusburger.io",
    projects: [
      {
        name: "Austrian Jazz Award",
        url: "https://jazzpreis.at",
      },
      {
        name: "Poolbar Festival",
        url: "https://poolbar.at",
      },
      {
        name: "Amadeus Austrian Music Award",
        url: "https://aama.at",
      },
      {
        name: "Wissenschaftsverbund",
        url: "https://wissenschaftsverbund.org",
      },
    ],
  },
  {
    name: "Stella Kucher",
    image: stellaImage,
    title: "Grafik",
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
    email: "stella@example.com",
    projects: [
      {
        name: "Grafik Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "Nailart Workshop",
        url: "https://poolbar.at",
      },
    ],
  },
  {
    name: "Niko Havranek",
    image: nikoImage,
    title: "Fotografie",
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
    email: "niko@example.com",
    website: "http://www.nikohavranek.com/",
    projects: [
      {
        name: "Fotografie Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "Nailart Workshop",
        url: "https://poolbar.at",
      },
    ],
  },
  {
    name: "Iris Prassl",
    image: irisImage,
    title: "Nailart",
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
    email: "iris@example.com",
    projects: [
      {
        name: "Nailart Workshop",
        url: "https://poolbar.at",
      },
    ],
  },
  {
    name: "Victor Dölle",
    title: "Architektur",
    image: victorImage,
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
    email: "victor@example.com",
    projects: [
      {
        name: "Architektur Workshop",
        url: "https://poolbar.at",
      },
      {
        name: "Nailart Workshop",
        url: "https://poolbar.at",
      },
    ],
  },
];

const MailButton = () => {
  return (
    <button className="bg-foreground rounded-full h-12 w-12 aspect-square flex items-center justify-center hover:bg-blue-700">
      <Mail className="text-woit w-12 h-6" />
    </button>
  );
};

const WebsiteButton = () => {
  return (
    <button className="bg-foreground rounded-full h-12 w-12 aspect-square flex items-center justify-center hover:bg-blue-700">
      <Globe className="text-woit w-12 h-6" />
    </button>
  );
};

const generateRandomPolygonPoints = () => {
  const min = 10; // Minimum value for a point
  const max = 100; // Maximum value for a point
  const points = Array.from({ length: 4 }, () => `${Math.random() * (max - min) + min},${Math.random() * (max - min) + min}`).join(" ");
  return points;
};

const MemberSection = ({ member, switched }: { member: Member; switched: number }) => {
  const randomPolygonPoints = generateRandomPolygonPoints();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8">
      {switched % 2 !== 0 ? (
        <>
          <div className="member-content flex items-start flex-col gap-4 md:col-span-2 justify-start relative">
            <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
              <span className="text-2xl md:text-5xl">{member.name}</span>
              <div className="flex gap-2">
                <MailButton />
                {member.website && <WebsiteButton />}
              </div>
            </div>
            <div className="border-foreground border overflow-hidden relative rounded-3xl w-full p-4">
              <span className="text-xl rounded-full text-background bg-blue-700 py-1 px-2">{member.title}</span>
              <span className="text-xl py-1 px-2">{member.description}</span>
              <svg className="absolute -z-10 bottom-0 right-0 w-96 h-96 text-blue-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="15" fill="currentColor" />
                <polygon points={randomPolygonPoints} fill="currentColor" />
              </svg>
            </div>
            <div className="flex gap-2 flex-wrap">
              {member.projects?.map((project, index) => (
                <a key={index} className="hover:bg-background hover:text-foreground border border-foreground text-base rounded-full text-background bg-foreground py-0.5 px-2 whitespace-nowrap flex gap-1 items-center" href={project.url}>
                  <span>{project.name}</span>
                  <MoveRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
          <div className="member-image justify-between w-full aspect-square items-start p-0 flex">
            <div className="relative w-full h-full rounded-3xl overflow-hidden group">
              <Image src={member.image} alt={member.name} width={200} height={200} className="w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="member-image justify-between w-full aspect-square items-start p-0 flex">
            <div className="relative w-full h-full rounded-3xl overflow-hidden group">
              <Image src={member.image} alt={member.name} width={200} height={200} className="w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
            </div>
          </div>
          <div className="member-content flex items-start flex-col gap-4 md:col-span-2 justify-start relative">
            <div className="flex justify-between items-center w-full border-t border-foreground pt-4">
              <span className="text-2xl md:text-5xl">{member.name}</span>
              <div className="flex gap-2">
                <MailButton />
                {member.website && <WebsiteButton />}
              </div>
            </div>
            <div className="border-foreground border overflow-hidden relative rounded-3xl w-full p-4">
              <span className="text-xl rounded-full text-background bg-blue-700 py-1 px-2">{member.title}</span>
              <span className="text-xl py-1 px-2">{member.description}</span>
              <svg className="absolute -z-10 bottom-0 right-0 w-96 h-96 text-blue-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="15" fill="currentColor" />
                <polygon points={randomPolygonPoints} fill="currentColor" />
              </svg>
            </div>
            <div className="flex gap-2 flex-wrap">
              {member.projects?.map((project, index) => (
                <a key={index} className="hover:bg-background hover:text-foreground border border-foreground text-base rounded-full text-background bg-foreground py-0.5 px-2 whitespace-nowrap flex gap-1 items-center" href={project.url}>
                  <span>{project.name}</span>
                  <MoveRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

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
      <div className="items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col w-full">
          {/* FRONT */}
          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 h-screen p-8">
            <div className="flex items-end justify-end flex-col text-4xl md:text-5xl flex-1">
              <span>Grafik</span>

              <span>Nailart</span>

              <span>Architektur</span>

              <span>Webentwicklung</span>

              <span>Fotografie</span>

              <span>Design</span>
            </div>
            <div className=" md:col-span-2 w-full items-end justify-end relative ">
              <span className="text-woit z-50 absolute bottom-8 right-8 font-black text-8xl tracking-tight pointer-events-none">Z57</span>
              <GlassCardWithRevealEffect />
              {/* <div className="relative overflow-hidden rounded-3xl glassCard w-full h-full items-end justify-end p-8 flex ">
                <Image src={groupGlassImage} alt={"Gruppenfoto"} width={800} height={1920} className=" z-10 absolute left-0 right-0 bottom-0 top-0 w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
                <Image src={groupImage} alt={"Gruppenfoto"} width={800} height={1920} className=" absolute left-0 right-0 bottom-0 top-0 w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
                
              </div> */}
            </div>
          </div>

          {/* UPCOMING */}
          <div className="flex flex-col gap-8 p-8">
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
                <a href="mailto:info@z57.at" className="order-2 md:order-1  border-foreground hover:bg-background hover:text-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
                  <CandyCane className=" w-12 h-12" />
                  <div className="flex flex-col gap-2">
                    <span className="self-end text-xl">20.Dez 2024</span>
                    <hr className="border-current" />
                    <span className="self-end text-xl font-bold">Adventmarkt am Dach</span>
                  </div>
                </a>
                <Image src={adventImage} alt={"Grupenfoto"} width={800} height={400} className="w-full order-1 md:order-2 h-64 rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
              </div>
              {/* <div className="border-foreground border overflow-hidden relative rounded-3xl w-full p-4">
                <span className="text-xl py-1 px-2">Hallo</span>
              </div> */}
            </div>
          </div>

          {/* MEMBERS */}
          <div className="flex flex-col gap-8 p-8">
            {shuffledMembers.map((member, index) => (
              <>
                <MemberSection key={member.name} member={member} switched={index} />
                {/* {index !== members.length - 1 && <hr className="border-foreground" />} */}
              </>
            ))}
          </div>

          {/* KONTAKT */}
          <div className="flex flex-col gap-8 p-8">
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
                <a href="mailto:info@z57.at" className="border-foreground hover:bg-background hover:text-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
                  <Mail className=" w-12 h-12" />
                  <div className="flex flex-col gap-2">
                    <hr className="border-current" />
                    <span className="self-end text-xl">info@z57.at</span>
                  </div>
                </a>
                <a href="https://www.instagram.com/z57.at/" className="border-foreground hover:bg-background hover:text-foreground w-full flex flex-col gap-4 justify-between text-woit bg-foreground border overflow-hidden relative rounded-3xl p-4">
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
        <footer className="px-8">
          <hr className="border-foreground" />
          <div className="py-8 justify-between gap-4 flex flex-col md:flex-row">
            <div className="flex gap-2 flex-col md:flex-row">
              <div>
                <span className="text-xl rounded-full text-background bg-blue-700 py-1 px-2">Copyright z57 © 2024</span>
              </div>
              <div>
                <span className="text-xl rounded-full text-background bg-foreground py-1 px-2">Website by Luca Meusburger</span>
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
