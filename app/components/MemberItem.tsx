import { Globe, Instagram, Mail } from "lucide-react";

import Badge from "./Badge";
import Image from "next/image";
import {
  EditableImage,
  EditableRegion,
  EditableText,
} from "@einblick/sdk/react";
import type { Member } from "@/app/types/members";

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
    <EditableRegion
      as="article"
      binding={member.bindings.region}
      className="grid w-full grid-cols-1 gap-5 rounded-3xl border border-foreground bg-background p-4 md:grid-cols-3 md:gap-8 md:p-6"
    >
      <div className={`member-image flex w-full aspect-square items-start ${isSwitched ? "order-1 md:order-2" : "order-1 md:order-1"}`}>
        <EditableImage
          as="div"
          binding={member.bindings.image}
          className="group relative h-full w-full overflow-hidden rounded-3xl border border-foreground"
        >
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              width={1080}
              height={1080}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-full w-full object-cover filter grayscalesss contrast-2 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-foreground/5 text-sm uppercase tracking-[0.16em] text-foreground/40">
              Kein Bild
            </div>
          )}
        </EditableImage>
      </div>

      <div className={`member-content relative flex flex-col justify-between gap-5 md:col-span-2 ${isSwitched ? "order-2 md:order-1" : "order-2 md:order-2"}`}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <Badge>
                <EditableText as="span" binding={member.bindings.title}>
                  {member.title}
                </EditableText>
              </Badge>
              <EditableText
                as="h2"
                binding={member.bindings.name}
                className="text-2xl md:text-5xl"
              >
                {member.name}
              </EditableText>
            </div>

            <div className="flex gap-2">
              {member.email && (
                <EditableRegion as="span" binding={member.bindings.email}>
                  <RoundButton icon={<Mail className="h-6 w-6" />} href={`mailto:${member.email}`} />
                </EditableRegion>
              )}
              {member.instagram && (
                <EditableRegion as="span" binding={member.bindings.instagram}>
                  <RoundButton icon={<Instagram className="h-6 w-6" />} href={member.instagram} />
                </EditableRegion>
              )}
              {member.website && (
                <EditableRegion as="span" binding={member.bindings.website}>
                  <RoundButton icon={<Globe className="h-6 w-6" />} href={member.website} />
                </EditableRegion>
              )}
            </div>
          </div>

          <EditableText
            as="p"
            binding={member.bindings.description}
            className="text-lg leading-relaxed md:text-xl"
          >
            {member.description}
          </EditableText>
        </div>

        {member.projects?.length ? (
          <EditableRegion
            as="div"
            binding={member.bindings.projects}
            className="flex flex-wrap gap-2"
          >
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
          </EditableRegion>
        ) : null}
      </div>
    </EditableRegion>
  );
};

export default MemberItem;
