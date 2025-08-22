import { Globe, Instagram, Mail, MoveRight } from "lucide-react";

import Image from "next/image";
import { Member } from "../members";
import groupGlassImage from "@/app/images/group-glass.jpg";

const RoundButton = ({ icon, href }: { icon: React.ReactNode; href: string }) => {
  return (
    <a target="_blank" href={href} className="bg-foreground rounded-full h-12 w-12 aspect-square flex items-center justify-center hover:bg-glass bg-cover">
      {icon}
    </a>
  );
};

const MemberItem = ({ member, switched }: { member: Member; switched: number }) => {
  // const randomPolygonPoints = generateRandomPolygonPoints();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4 md:gap-8">
      {switched % 2 !== 0 ? (
        <>
          <div className="member-content flex items-start flex-col gap-4 md:col-span-2 justify-start relative order-3 md:order-1">
            <div className="flex justify-between items-center w-full md:border-t md:border-foreground md:pt-4">
              <span className="text-2xl md:text-5xl">{member.name}</span>
              <div className="flex gap-2">
                {member.email && <RoundButton icon={<Mail className="text-woit w-12 h-6" />} href={`mailto:${member.email}`} />}
                {member.instagram && <RoundButton icon={<Instagram className="text-woit w-12 h-6" />} href={member.instagram} />}
                {member.website && <RoundButton icon={<Globe className="text-woit w-12 h-6" />} href={member.website} />}
              </div>
            </div>
            <div className="border-foreground border overflow-hidden relative rounded-3xl w-full p-4">
              <span
                style={{
                  backgroundImage: `url(${groupGlassImage.src})`,
                  backgroundSize: "cover",
                }}
                className="text-xl rounded-full text-background bg-foreground py-1 px-2"
              >
                {member.title}
              </span>
              <span className="text-xl py-1 px-2">{member.description}</span>
              {/* <svg className="absolute -z-10 bottom-0 right-0 w-96 h-96 text-blue-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="15" fill="currentColor" />
                <polygon points={randomPolygonPoints} fill="currentColor" />
              </svg> */}
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
          <div className="member-image justify-between w-full aspect-square items-start p-0 flex order-1 md:order-3">
            <div className="relative w-full h-full rounded-3xl overflow-hidden group">
              <Image src={member.image} alt={member.name} width={1080} height={1080} className="w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="member-image justify-between w-full aspect-square items-start p-0 flex">
            <div className="relative w-full h-full rounded-3xl overflow-hidden group">
              <Image src={member.image} alt={member.name} width={1080} height={1080} className="w-full h-full rounded-3xl object-cover filter grayscalesss contrast-2 group-hover:scale-110 transition-all transform" />
            </div>
          </div>
          <div className="member-content flex items-start flex-col gap-4 md:col-span-2 justify-start relative">
            <div className="flex justify-between items-center w-full md:border-t md:border-foreground md:pt-4">
              <span className="text-2xl md:text-5xl">{member.name}</span>
              <div className="flex gap-2">
                {member.email && <RoundButton icon={<Mail className="text-woit w-12 h-6" />} href={`mailto:${member.email}`} />}
                {member.instagram && <RoundButton icon={<Instagram className="text-woit w-12 h-6" />} href={member.instagram} />}
                {member.website && <RoundButton icon={<Globe className="text-woit w-12 h-6" />} href={member.website} />}
              </div>
            </div>
            <div className="border-foreground border overflow-hidden relative rounded-3xl w-full p-4">
              <span
                style={{
                  backgroundImage: `url(${groupGlassImage.src})`,
                  backgroundSize: "cover",
                }}
                className="text-xl rounded-full text-background bg-foreground py-1 px-2"
              >
                {member.title}
              </span>
              <span className="text-xl py-1 px-2">{member.description}</span>
              {/* <svg className="absolute -z-10 bottom-0 right-0 w-96 h-96 text-blue-700" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="15" fill="currentColor" />
                <polygon points={randomPolygonPoints} fill="currentColor" />
              </svg> */}
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

export default MemberItem;
