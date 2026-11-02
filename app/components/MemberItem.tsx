import { Globe, Instagram, Mail } from "lucide-react";

import Badge from "./Badge";
import CategoryBadge from "./CategoryBadge";
import Image from "next/image";
import {
  EditableImage,
  EditableRegion,
  EditableText,
} from "@einblick/editor/react";
import type { Member } from "@/app/types/members";

const IconLink = ({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-foreground transition-colors hover:bg-foreground hover:text-background"
    >
      {icon}
    </a>
  );
};

const MemberItem = ({ member }: { member: Member }) => {
  return (
    <EditableRegion
      as="article"
      binding={member.bindings.region}
      className="flex flex-col"
    >
      <EditableImage
        as="div"
        binding={member.bindings.image}
        placeholder="Bild hinzufügen"
        className="group relative aspect-square w-full overflow-hidden border-b"
      >
        {member.image ? (
          <Image
            src={member.image}
            alt={member.imageAlt}
            width={1080}
            height={1080}
            loading="lazy"
            sizes="(max-width: 1280px) 50vw, 25vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-lime">
            Kein Bild
          </div>
        )}
      </EditableImage>

      {/* Two columns on phones leave little room: long German words have to break. */}
      <div className="flex flex-1 flex-col gap-5 hyphens-auto break-words px-3 py-4 max-md:text-sm md:px-7 md:py-7">
        <div className="flex flex-col items-start gap-3">
          <EditableText
            editInline
            as="h3"
            binding={member.bindings.name}
            placeholder="Text ergänzen"
            className="text-sub"
          >
            {member.name}
          </EditableText>
          <CategoryBadge label={member.title}>
            <EditableText
              editInline
              as="span"
              binding={member.bindings.title}
              placeholder="Text ergänzen"
            >
              {member.title}
            </EditableText>
          </CategoryBadge>
        </div>

        <EditableText
          editInline
          as="p"
          binding={member.bindings.description}
          placeholder="Text ergänzen"
        >
          {member.description}
        </EditableText>

        <div className="mt-auto flex flex-col gap-4">
          {member.projects?.length ? (
            <EditableRegion
              as="div"
              binding={member.bindings.projects}
              className="flex flex-col gap-1"
            >
              {member.projects.map((project, index) => (
                <Badge
                  key={index}
                  href={project.url}
                  variant="link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </Badge>
              ))}
            </EditableRegion>
          ) : null}

          <div className="flex gap-1.5">
            {member.email && (
              <EditableRegion
                as="span"
                className="inline-flex"
                binding={member.bindings.email}
              >
                <IconLink
                  icon={<Mail className="h-5 w-5" />}
                  href={`mailto:${member.email}`}
                  label={`E-Mail an ${member.name}`}
                />
              </EditableRegion>
            )}
            {member.instagram && (
              <EditableRegion
                as="span"
                className="inline-flex"
                binding={member.bindings.instagram}
              >
                <IconLink
                  icon={<Instagram className="h-5 w-5" />}
                  href={member.instagram}
                  label={`${member.name} auf Instagram`}
                />
              </EditableRegion>
            )}
            {member.website && (
              <EditableRegion
                as="span"
                className="inline-flex"
                binding={member.bindings.website}
              >
                <IconLink
                  icon={<Globe className="h-5 w-5" />}
                  href={member.website}
                  label={`Website von ${member.name}`}
                />
              </EditableRegion>
            )}
          </div>
        </div>
      </div>
    </EditableRegion>
  );
};

export default MemberItem;
