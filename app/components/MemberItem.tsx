import { Globe, Instagram, Mail } from "lucide-react";

import Image from "next/image";
import type { Member } from "@/app/types/members";
import Badge from "./Badge";

const RoundButton = ({ icon, href }: { icon: React.ReactNode; href: string }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      className="flex h-12 w-12 aspect-square items-center justify-center rounded-full border border-foreground transition-colors hover:bg-foreground hover:text-background"
    >
      {icon}
    </a>
  );
};

const MemberItem = ({ member, switched }: { member: Member; switched: number }) => {
  const isSwitched = switched % 2 !== 0;

  return (
    <article className="grid w-full grid-cols-1 gap-5 rounded-3xl border border-foreground bg-background p-4 md:grid-cols-3 md:gap-8 md:p-6">
      <div className={`member-image flex w-full aspect-square items-start ${isSwitched ? "order-1 md:order-2" : "order-1 md:order-1"}`}>
        <div className="group relative h-full w-full overflow-hidden rounded-3xl border border-foreground">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              width={1080}
              height={1080}
              className="h-full w-full object-cover filter grayscalesss contrast-2 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-foreground/5 text-sm uppercase tracking-[0.16em] text-foreground/40">
              Kein Bild
            </div>
          )}
        </div>
      </div>

      <div className={`member-content relative flex flex-col justify-between gap-5 md:col-span-2 ${isSwitched ? "order-2 md:order-1" : "order-2 md:order-2"}`}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <Badge>{member.title}</Badge>
              <h2 className="text-2xl md:text-5xl">{member.name}</h2>
            </div>

            <div className="flex gap-2">
              {member.email && <RoundButton icon={<Mail className="h-6 w-6" />} href={`mailto:${member.email}`} />}
              {member.instagram && <RoundButton icon={<Instagram className="h-6 w-6" />} href={member.instagram} />}
              {member.website && <RoundButton icon={<Globe className="h-6 w-6" />} href={member.website} />}
            </div>
          </div>

          <p className="text-lg leading-relaxed md:text-xl">{member.description}</p>
        </div>

        {member.projects?.length ? (
          <div className="flex flex-wrap gap-2">
            {member.projects.map((project, index) => (
              <Badge
                key={index}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap"
              >
                {project.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default MemberItem;
