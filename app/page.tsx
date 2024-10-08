import { Globe, Mail, MoveRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import CustomCursor from "./components/CustomCursor";
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
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
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
    description: "Robert is a passionate Music lover and a big fan of the classical music. He is also a big fan of the new music and is always looking for new music to listen to. He is a huge fan of the new technology and is always looking for new technologies to learn. Robert is also a big fan of the new fashion and is always looking for new fashion to wear. Robert is also a big fan of the new food and is always looking for new food to eat.",
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
              <Image src={member.image} alt={member.name} width={200} height={200} className="w-full h-full rounded-3xl object-cover filter grayscale contrast-2 group-hover:scale-110 transition-all transform" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="member-image justify-between w-full aspect-square items-start p-0 flex">
            <div className="relative w-full h-full rounded-3xl overflow-hidden group">
              <Image src={member.image} alt={member.name} width={200} height={200} className="w-full h-full rounded-3xl object-cover filter grayscale contrast-2 group-hover:scale-110 transition-all transform" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 h-screen p-8">
            <div className="flex items-end justify-end flex-col text-4xl md:text-5xl flex-1">
              <span>Grafik</span>
              <span>Architektur</span>
              <span>Webentwicklung</span>
              <span>Keramik</span>
              <span>Nailart</span>
              <span>Fotografie</span>
            </div>
            <div className=" md:col-span-2 w-full items-end justify-end ">
              <div className="bg-blue-700 rounded-3xl w-full h-full items-end justify-end p-8 flex">
                <span className="text-woit font-black text-8xl tracking-tight">Z57</span>
              </div>
            </div>
          </div>

          {/* <hr className="col-span-2 border-foreground mx-8" /> */}

          <div className="flex flex-col gap-8 p-8">
            {shuffledMembers.map((member, index) => (
              <>
                <MemberSection key={member.name} member={member} switched={index} />
                {/* {index !== members.length - 1 && <hr className="border-foreground" />} */}
              </>
            ))}
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
              <span className="text-xl text-foreground py-1 px-2">contact</span>
            </div>
          </div>
        </footer>
        <CustomCursor />
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
