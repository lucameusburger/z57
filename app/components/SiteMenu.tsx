"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

import { CloverGlyph } from "./Shapes";

const OPEN_MENU_EVENT = "z57:open-menu";

export interface SiteMenuItem {
  href: string;
  label: string;
}

function isEditing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA")
  );
}

export function MenuButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-einblick-chrome
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))}
    >
      {children}
    </button>
  );
}

export default function SiteMenu({
  items,
  legalItems,
}: {
  items: SiteMenuItem[];
  legalItems: SiteMenuItem[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => {
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey) ||
        isEditing(event.target)
      ) {
        return;
      }

      event.preventDefault();
      if (dialogRef.current?.open) {
        dialogRef.current.close();
      } else {
        open();
      }
    };

    window.addEventListener(OPEN_MENU_EVENT, open);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(OPEN_MENU_EVENT, open);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menü"
      data-einblick-chrome
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-foreground text-background [--line:rgb(var(--background-rgb)/0.4)] backdrop:bg-transparent"
    >
      <div className="flex min-h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4 md:h-[4.4rem] md:px-7">
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2 font-medium transition-colors hover:text-lime"
          >
            <CloverGlyph className="h-4 w-4 md:h-5 md:w-5" />
            z57
          </Link>
          <button
            type="button"
            autoFocus
            onClick={close}
            className="inline-flex items-center gap-2 transition-colors hover:text-lime"
          >
            Schließen
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Hauptmenü" className="flex-1">
          <ul>
            {items.map((item) => (
              <li key={item.href} className="border-b">
                <Link
                  href={item.href}
                  onClick={close}
                  className="text-lead block px-4 py-3 transition-colors hover:bg-lime hover:text-foreground md:px-7 md:py-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-5 md:px-7">
          {legalItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                className="transition-colors hover:text-lime"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
