"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";


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

function showMenu(dialog: HTMLDialogElement) {
  if (!dialog.open) {
    dialog.showModal();
    // Commits the hidden state, so setting `visible` runs the transition.
    dialog.getBoundingClientRect();
  }
  dialog.dataset.visible = "";
}

/** Closes once the transition ends; right away if motion is reduced. */
async function hideMenu(dialog: HTMLDialogElement) {
  delete dialog.dataset.visible;
  await Promise.allSettled(
    dialog.getAnimations().map((animation) => animation.finished),
  );
  // Reopened while the transition was running.
  if (!("visible" in dialog.dataset)) dialog.close();
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
      if (dialogRef.current) showMenu(dialogRef.current);
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
      if (dialogRef.current && "visible" in dialogRef.current.dataset) {
        void hideMenu(dialogRef.current);
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

  const close = () => {
    if (dialogRef.current) void hideMenu(dialogRef.current);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menü"
      data-einblick-chrome
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={(event) => delete event.currentTarget.dataset.visible}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-foreground text-background transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] [--line:rgb(var(--background-rgb)/0.4)] [clip-path:inset(0_0_100%_0)] backdrop:bg-transparent data-[visible]:[clip-path:inset(0)] motion-reduce:transition-none"
    >
      <div className="flex min-h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4 md:h-[4.4rem] md:px-7">
          <Link
            href="/"
            onClick={close}
            className="flex items-center font-medium transition-colors hover:text-lime"
          >
            Z57
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
