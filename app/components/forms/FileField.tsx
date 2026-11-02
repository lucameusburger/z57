"use client";

import { Check, RotateCw, Upload, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import {
  describeAcceptedTypes,
  formatFileSize,
  getMaxFileSize,
  isAcceptedFileType,
  type FormQuestion,
  type UploadedFile,
} from "@/app/lib/forms/logic";
import { cn } from "@/lib/utils";

import { prepareUpload, putFile } from "./upload";

type ItemStatus = "queued" | "uploading" | "done" | "error";

interface Item {
  id: string;
  file: File;
  status: ItemStatus;
  progress: number;
  ticket?: string;
  expiresAt?: number | null;
  error?: string;
}

/** Holds every file of one question, and tells the form what can be submitted. */
export default function FileField({
  id,
  slug,
  question,
  invalid,
  describedBy,
  onFilesChange,
  onBusyChange,
  announce,
}: {
  id: string;
  slug: string;
  question: FormQuestion;
  invalid: boolean;
  describedBy?: string;
  onFilesChange: (files: UploadedFile[]) => void;
  onBusyChange: (busy: boolean) => void;
  announce: (message: string) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [notices, setNotices] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const itemsRef = useRef<Item[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const running = useRef(false);
  const nextId = useRef(0);

  const limit = question.maxFileCount ?? 1;
  const maxSize = getMaxFileSize(question);
  const accept = question.acceptedFileTypes?.join(",");
  const noticeId = `${id}-notice`;
  const hintId = `${id}-hint`;

  const commit = (update: (current: Item[]) => Item[]) => {
    const next = update(itemsRef.current);
    itemsRef.current = next;
    setItems(next);
    onFilesChange(
      next.flatMap((item) =>
        item.status === "done" && item.ticket
          ? [{ ticket: item.ticket, expiresAt: item.expiresAt ?? null }]
          : [],
      ),
    );
    onBusyChange(
      next.some((item) => item.status === "queued" || item.status === "uploading"),
    );
  };

  const patchItem = (itemId: string, patch: Partial<Item>) =>
    commit((current) =>
      current.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );

  const takenSlots = () =>
    itemsRef.current.filter((item) => item.status !== "error").length;

  // One at a time: a phone on a slow line should not fight itself, and the row
  // that is moving is the one a person watches.
  const runQueue = async () => {
    if (running.current) return;
    running.current = true;
    try {
      for (;;) {
        const item = itemsRef.current.find((entry) => entry.status === "queued");
        if (!item) return;

        const controller = new AbortController();
        controllers.current.set(item.id, controller);
        patchItem(item.id, { status: "uploading", progress: 0, error: undefined });
        try {
          const prepared = await prepareUpload(
            slug,
            question.id,
            item.file,
            controller.signal,
          );
          await putFile(
            prepared.uploadUrl,
            item.file,
            (progress) => patchItem(item.id, { progress }),
            controller.signal,
          );
          patchItem(item.id, {
            status: "done",
            progress: 1,
            ticket: prepared.ticket,
            expiresAt: prepared.expiresAt,
          });
          announce(`„${item.file.name}“ wurde hochgeladen.`);
        } catch (error) {
          // Removing a file aborts its upload; the row is gone already.
          if (controller.signal.aborted) continue;
          const message =
            error instanceof Error ? error.message : "Der Upload ist fehlgeschlagen.";
          patchItem(item.id, { status: "error", error: message });
          announce(`„${item.file.name}“: ${message}`);
        } finally {
          controllers.current.delete(item.id);
        }
      }
    } finally {
      running.current = false;
    }
  };

  const addFiles = (selected: File[]) => {
    if (selected.length === 0) return;

    const nextNotices: string[] = [];
    const accepted: File[] = [];
    const overLimit: string[] = [];

    for (const file of selected) {
      if (file.size === 0) {
        nextNotices.push(`„${file.name}“ ist leer und wurde nicht hinzugefügt.`);
      } else if (!isAcceptedFileType(question.acceptedFileTypes, file)) {
        nextNotices.push(`„${file.name}“ hat einen nicht erlaubten Dateityp.`);
      } else if (file.size > maxSize) {
        nextNotices.push(
          `„${file.name}“ ist größer als ${formatFileSize(maxSize)} und wurde nicht hinzugefügt.`,
        );
      } else if (takenSlots() + accepted.length >= limit) {
        overLimit.push(`„${file.name}“`);
      } else {
        accepted.push(file);
      }
    }
    if (overLimit.length > 0) {
      nextNotices.push(
        `Du kannst höchstens ${limit} ${limit === 1 ? "Datei" : "Dateien"} hochladen. Nicht hinzugefügt: ${overLimit.join(", ")}.`,
      );
    }

    setNotices(nextNotices);
    if (nextNotices.length > 0) announce(nextNotices.join(" "));
    if (accepted.length === 0) return;

    commit((current) => [
      ...current,
      ...accepted.map((file) => ({
        id: `${id}-file-${nextId.current++}`,
        file,
        status: "queued" as const,
        progress: 0,
      })),
    ]);
    void runQueue();
  };

  const removeItem = (item: Item) => {
    controllers.current.get(item.id)?.abort();
    setNotices([]);
    commit((current) => current.filter((entry) => entry.id !== item.id));
    announce(`„${item.file.name}“ wurde entfernt.`);
  };

  const retryItem = (item: Item) => {
    if (takenSlots() >= limit) {
      setNotices([`Du kannst höchstens ${limit} ${limit === 1 ? "Datei" : "Dateien"} hochladen.`]);
      return;
    }
    patchItem(item.id, { status: "queued", progress: 0, error: undefined });
    void runQueue();
  };

  const full = takenSlots() >= limit;
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        id={id}
        type="file"
        className="peer sr-only"
        accept={accept}
        multiple={limit > 1}
        disabled={full}
        aria-invalid={invalid || notices.length > 0 || undefined}
        aria-required={question.required || undefined}
        aria-describedby={
          [hintId, notices.length > 0 ? noticeId : null, describedBy]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onChange={(event) => {
          addFiles(Array.from(event.currentTarget.files ?? []));
          // Picking the same file again after removing it must fire again.
          event.currentTarget.value = "";
        }}
      />
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-foreground px-4 py-5 text-center transition-colors hover:bg-lime/40 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground",
          dragging && "bg-lime",
          invalid && "border-2 border-error",
          full && "cursor-not-allowed opacity-50 hover:bg-transparent",
        )}
      >
        <Upload className="h-5 w-5" aria-hidden="true" />
        <span className="underline underline-offset-4">
          {limit > 1 ? "Dateien auswählen" : "Datei auswählen"}
        </span>
      </label>

      <p id={hintId} className="text-sm">
        {limit > 1 ? `Bis zu ${limit} Dateien, je` : "Eine Datei,"} höchstens{" "}
        {formatFileSize(maxSize)}
        {question.acceptedFileTypes?.length
          ? `. Erlaubt: ${describeAcceptedTypes(question.acceptedFileTypes)}`
          : ""}
        .
      </p>

      {notices.length > 0 ? (
        <div id={noticeId} className="flex flex-col gap-1 text-sm text-error">
          {notices.map((notice) => (
            <p key={notice}>{notice}</p>
          ))}
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="flex flex-col border border-b-0 border-foreground">
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              onRemove={() => removeItem(item)}
              onRetry={() => retryItem(item)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FileRow({
  item,
  onRemove,
  onRetry,
}: {
  item: Item;
  onRemove: () => void;
  onRetry: () => void;
}) {
  const percent = Math.round(item.progress * 100);
  const active = item.status === "queued" || item.status === "uploading";

  return (
    <li className="flex items-center gap-2 border-b border-foreground pl-3">
      <div className="min-w-0 flex-1 py-2">
        <p className="truncate">{item.file.name}</p>
        <p className={cn("text-sm", item.status === "error" && "text-error")}>
          {item.status === "queued" ? "Wartet …" : null}
          {item.status === "uploading" ? `Wird hochgeladen … ${percent} %` : null}
          {item.status === "done" ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Hochgeladen, {formatFileSize(item.file.size)}
            </span>
          ) : null}
          {item.status === "error" ? item.error : null}
        </p>
        {active ? (
          <div
            role="progressbar"
            aria-label={`Fortschritt für ${item.file.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="mt-1.5 h-1.5 w-full border border-foreground"
          >
            <div
              className="h-full bg-foreground transition-[width] motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}
      </div>
      {item.status === "error" ? (
        <button
          type="button"
          onClick={onRetry}
          aria-label={`„${item.file.name}“ erneut hochladen`}
          className="form-focus flex min-h-11 w-11 flex-none items-center justify-center self-stretch border-l border-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`„${item.file.name}“ entfernen`}
        className="form-focus flex min-h-11 w-11 flex-none items-center justify-center self-stretch border-l border-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
