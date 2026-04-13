import "server-only";

import { cache } from "react";

import { getEinblickAssetUrl } from "@/app/lib/assets";
import { getCmsMembers, type CmsMemberFields } from "@/app/lib/cms";
import {
  createEditableBinding,
  type EinblickEditableBinding,
} from "@einblick/sdk/react";

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
  bindings: {
    region?: EinblickEditableBinding;
    name?: EinblickEditableBinding<string>;
    image?: EinblickEditableBinding<CmsMemberFields["image"]>;
    title?: EinblickEditableBinding<string>;
    description?: EinblickEditableBinding<string>;
    email?: EinblickEditableBinding<string>;
    website?: EinblickEditableBinding<string>;
    instagram?: EinblickEditableBinding<string>;
    projects?: EinblickEditableBinding<CmsMemberFields["projects"]>;
  };
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
    image: getEinblickAssetUrl(cmsRecord.fields.image) ?? undefined,
    title: cmsRecord.fields.title,
    description: cmsRecord.fields.description,
    email: cmsRecord.fields.email,
    website: cmsRecord.fields.website ?? undefined,
    instagram: cmsRecord.fields.instagram ?? undefined,
    projects: parseProjects(cmsRecord.fields.projects),
    bindings: {
      region: createEditableBinding({
        resourceSlug: "members",
        recordId: cmsRecord.id,
        label: cmsRecord.fields.name,
        displayMode: "drawer",
      }),
      name: createEditableBinding({
        resourceSlug: "members",
        recordId: cmsRecord.id,
        fieldKey: "name",
        fieldType: "string",
        label: "Name",
        value: cmsRecord.fields.name,
      }),
      image: cmsRecord.fields.image
        ? createEditableBinding({
            resourceSlug: "members",
            recordId: cmsRecord.id,
            fieldKey: "image",
            fieldType: "image",
            label: "Member image",
            displayMode: "drawer",
          })
        : undefined,
      title: createEditableBinding({
        resourceSlug: "members",
        recordId: cmsRecord.id,
        fieldKey: "title",
        fieldType: "string",
        label: "Title",
        value: cmsRecord.fields.title,
      }),
      description: createEditableBinding({
        resourceSlug: "members",
        recordId: cmsRecord.id,
        fieldKey: "description",
        fieldType: "text",
        label: "Description",
        value: cmsRecord.fields.description,
      }),
      email: createEditableBinding({
        resourceSlug: "members",
        recordId: cmsRecord.id,
        fieldKey: "email",
        fieldType: "string",
        label: "Email",
        value: cmsRecord.fields.email,
      }),
      website: cmsRecord.fields.website
        ? createEditableBinding({
            resourceSlug: "members",
            recordId: cmsRecord.id,
            fieldKey: "website",
            fieldType: "string",
            label: "Website",
            value: cmsRecord.fields.website,
          })
        : undefined,
      instagram: cmsRecord.fields.instagram
        ? createEditableBinding({
            resourceSlug: "members",
            recordId: cmsRecord.id,
            fieldKey: "instagram",
            fieldType: "string",
            label: "Instagram",
            value: cmsRecord.fields.instagram,
          })
        : undefined,
      projects: createEditableBinding({
        resourceSlug: "members",
        recordId: cmsRecord.id,
        fieldKey: "projects",
        fieldType: "json",
        label: "Projects",
        displayMode: "drawer",
      }),
    },
  };
}

export const getMembers = cache(async (): Promise<Member[]> => {
  const cmsData = await getCmsMembers();
  if (!cmsData) {
    return [];
  }

  return cmsData.records.map(cmsRecordToMember);
});
