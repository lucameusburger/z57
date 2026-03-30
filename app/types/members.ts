import "server-only";

import { cache } from "react";

import { getCmsMembers, type CmsMemberFields } from "@/app/lib/cms";

export interface Project {
  name: string;
  url: string;
}

export interface Member {
  name: string;
  image?: string;
  title: string;
  description: string;
  email: string;
  website?: string;
  instagram?: string;
  projects: Project[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const candidate = entry as Record<string, unknown>;
    if (!isNonEmptyString(candidate.name) || !isNonEmptyString(candidate.url)) {
      return [];
    }

    return [
      {
        name: candidate.name,
        url: candidate.url,
      },
    ];
  });
}

function cmsRecordToMember(cmsRecord: {
  id: string;
  fields: CmsMemberFields;
}): Member {
  return {
    name: cmsRecord.fields.name,
    image: cmsRecord.fields.image?.url ?? undefined,
    title: cmsRecord.fields.title,
    description: cmsRecord.fields.description,
    email: cmsRecord.fields.email,
    website: cmsRecord.fields.website ?? undefined,
    instagram: cmsRecord.fields.instagram ?? undefined,
    projects: parseProjects(cmsRecord.fields.projects),
  };
}

export const getMembers = cache(async (): Promise<Member[]> => {
  const cmsData = await getCmsMembers();
  if (!cmsData) {
    return [];
  }

  return cmsData.records.map(cmsRecordToMember);
});
