import type { ReactNode } from "react";

import Badge from "@/app/components/Badge";
import { getCategoryGlyph } from "@/app/lib/categories";

/** `label` picks the symbol; `children` is the (editable) text shown. */
export default async function CategoryBadge({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const Glyph = await getCategoryGlyph(label);

  return (
    <Badge icon={<Glyph className="h-3.5 w-3.5 flex-none" />}>{children}</Badge>
  );
}
