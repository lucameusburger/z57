import type { ReactNode } from "react";

/** A section opener: display heading with an optional side note. */
export default function SectionHead({
  title,
  aside,
}: {
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="grid gap-6 border-b px-4 pb-6 pt-14 md:grid-cols-4 md:gap-7 md:px-7 md:pb-8 md:pt-[7vw]">
      <div className="md:col-span-3">{title}</div>
      {aside ? <div className="max-w-sm md:self-end">{aside}</div> : null}
    </header>
  );
}
