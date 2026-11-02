"use client";

import { Bold, Italic, Link2, List, type LucideIcon } from "lucide-react";
import { useRef, type ComponentProps } from "react";

import { Textarea } from "@/app/components/ui/textarea";
import { applyMarkdownFormat, type MarkdownFormat } from "@/app/lib/forms/logic";

const ACTIONS: Array<{ format: MarkdownFormat; label: string; icon: LucideIcon }> = [
  { format: "bold", label: "Fett", icon: Bold },
  { format: "italic", label: "Kursiv", icon: Italic },
  { format: "list", label: "Liste", icon: List },
  { format: "link", label: "Link", icon: Link2 },
];

/**
 * A long text answered in Markdown. Einblick stores it as plain text, so this is
 * a textarea with buttons that write the marks: what a person sees is what is
 * sent, on any device, with nothing extra to load.
 */
export default function MarkdownTextarea({
  value,
  onValueChange,
  className,
  ...props
}: Omit<ComponentProps<"textarea">, "value" | "onChange"> & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const format = (markdown: MarkdownFormat) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const next = applyMarkdownFormat(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      markdown,
    );
    onValueChange(next.value);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  };

  return (
    <div className="flex flex-col">
      <div
        role="group"
        aria-label="Textformatierung"
        className="flex border border-b-0 border-foreground"
      >
        {ACTIONS.map(({ format: markdown, label, icon: Icon }) => (
          <button
            key={markdown}
            type="button"
            aria-label={label}
            title={label}
            disabled={props.disabled}
            onClick={() => format(markdown)}
            className="form-focus flex h-11 w-11 items-center justify-center border-r border-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={className}
        {...props}
      />
    </div>
  );
}
