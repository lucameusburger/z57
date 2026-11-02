"use client";

import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupTile,
} from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import {
  textLength,
  type Draft,
  type FormQuestion,
  type UploadedFile,
} from "@/app/lib/forms/logic";
import { cn } from "@/lib/utils";

import FileField from "./FileField";
import MarkdownTextarea from "./MarkdownTextarea";

const OPTION_CLASSES =
  "flex min-h-11 cursor-pointer items-center gap-3 border border-foreground px-3 py-2 transition-colors hover:bg-lime/40 has-[[data-state=checked]]:bg-lime";

export interface ControlIds {
  control: string;
  label: string;
  describedBy?: string;
}

/** The input a question calls for, labelled and described by its row. */
export default function QuestionControl({
  slug,
  question,
  ids,
  draft,
  invalid,
  onChange,
  onFilesChange,
  onBusyChange,
  announce,
}: {
  slug: string;
  question: FormQuestion;
  ids: ControlIds;
  draft: Draft | undefined;
  invalid: boolean;
  onChange: (draft: Draft) => void;
  onFilesChange: (files: UploadedFile[]) => void;
  onBusyChange: (busy: boolean) => void;
  announce: (message: string) => void;
}) {
  const text = typeof draft === "string" ? draft : "";
  const aria = {
    "aria-invalid": invalid || undefined,
    "aria-required": question.required || undefined,
    "aria-describedby": ids.describedBy,
  };
  const groupAria = {
    "aria-labelledby": ids.label,
    "aria-describedby": ids.describedBy,
  };
  const radioGroupAria = {
    ...groupAria,
    "aria-required": question.required || undefined,
  };
  const placeholder = question.placeholder ?? undefined;
  const isDate =
    question.type === "date" || question.type === "time" || question.type === "datetime";

  switch (question.type) {
    case "short_text":
    case "email":
    case "phone":
    case "date":
    case "time":
    case "datetime":
      return (
        <>
          <Input
            id={ids.control}
            type={
              question.type === "email"
                ? "email"
                : question.type === "phone"
                  ? "tel"
                  : question.type === "date" || question.type === "time"
                    ? question.type
                    : question.type === "datetime"
                      ? "datetime-local"
                      : "text"
            }
            autoComplete={
              question.type === "email"
                ? "email"
                : question.type === "phone"
                  ? "tel"
                  : undefined
            }
            min={isDate ? (question.dateMin ?? undefined) : undefined}
            max={isDate ? (question.dateMax ?? undefined) : undefined}
            placeholder={placeholder}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            {...aria}
          />
          {question.type === "short_text" ? (
            <CharacterCount text={text} max={question.maxLength} />
          ) : null}
        </>
      );

    case "long_text":
      return (
        <>
          {question.richText ? (
            <MarkdownTextarea
              id={ids.control}
              placeholder={placeholder}
              value={text}
              onValueChange={onChange}
              {...aria}
            />
          ) : (
            <Textarea
              id={ids.control}
              placeholder={placeholder}
              value={text}
              onChange={(event) => onChange(event.target.value)}
              {...aria}
            />
          )}
          <CharacterCount text={text} max={question.maxLength} />
        </>
      );

    case "number":
      // Text with a decimal keypad: a number input would blank "1,5" and spin
      // on scroll. The rules check what was typed.
      return (
        <Input
          id={ids.control}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          {...aria}
        />
      );

    case "single_choice":
      return (
        <RadioGroup
          value={text}
          onValueChange={onChange}
          aria-invalid={invalid || undefined}
          {...radioGroupAria}
        >
          {question.options.map((option) => (
            <label key={option.id} className={OPTION_CLASSES}>
              <RadioGroupItem value={option.value} aria-invalid={invalid || undefined} />
              <span>{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      );

    case "multiple_choice": {
      const selected = Array.isArray(draft) ? (draft as string[]) : [];
      return (
        <div role="group" className="flex flex-col gap-2" {...groupAria}>
          {question.options.map((option) => (
            <label key={option.id} className={OPTION_CLASSES}>
              <Checkbox
                checked={selected.includes(option.value)}
                aria-invalid={invalid || undefined}
                onCheckedChange={(checked) =>
                  onChange(
                    checked === true
                      ? [...selected, option.value]
                      : selected.filter((value) => value !== option.value),
                  )
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      );
    }

    case "dropdown":
      return (
        <Select value={text} onValueChange={onChange}>
          <SelectTrigger
            id={ids.control}
            aria-labelledby={ids.label}
            aria-invalid={invalid || undefined}
            aria-describedby={ids.describedBy}
            aria-required={question.required || undefined}
          >
            <SelectValue placeholder={placeholder ?? "Bitte auswählen"} />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "rating": {
      const max = Math.max(1, question.ratingMax ?? 5);
      return (
        <ScaleGroup
          values={Array.from({ length: max }, (_, index) => index + 1)}
          value={typeof draft === "number" ? draft : null}
          onChange={onChange}
          invalid={invalid}
          labelFor={(value) => `${value} von ${max}`}
          groupAria={radioGroupAria}
        />
      );
    }

    case "linear_scale": {
      const min = question.scaleMin ?? 1;
      const max = question.scaleMax ?? 5;
      const length = Math.min(Math.max(0, max - min + 1), 101);
      return (
        <div className="flex flex-col gap-2">
          <ScaleGroup
            values={Array.from({ length }, (_, index) => min + index)}
            value={typeof draft === "number" ? draft : null}
            onChange={onChange}
            invalid={invalid}
            labelFor={(value) =>
              [
                String(value),
                value === min ? question.scaleMinLabel : null,
                value === max ? question.scaleMaxLabel : null,
              ]
                .filter(Boolean)
                .join(", ")
            }
            groupAria={radioGroupAria}
          />
          {question.scaleMinLabel || question.scaleMaxLabel ? (
            <p aria-hidden="true" className="flex justify-between gap-4 text-sm">
              <span>{question.scaleMinLabel}</span>
              <span>{question.scaleMaxLabel}</span>
            </p>
          ) : null}
        </div>
      );
    }

    case "boolean":
      return (
        <div className="flex min-h-11 items-center gap-3">
          <Switch
            id={ids.control}
            checked={draft === true}
            aria-labelledby={ids.label}
            aria-invalid={invalid || undefined}
            aria-describedby={ids.describedBy}
            onCheckedChange={onChange}
          />
          <span aria-hidden="true">{draft === true ? "Ja" : "Nein"}</span>
        </div>
      );

    case "consent":
      return (
        <label className={cn(OPTION_CLASSES, "items-start")}>
          <Checkbox
            id={ids.control}
            checked={draft === true}
            aria-labelledby={`${ids.label} ${ids.control}-text`}
            onCheckedChange={(checked) => onChange(checked === true)}
            {...aria}
          />
          <span id={`${ids.control}-text`}>
            {question.placeholder ?? "Ich stimme zu."}
          </span>
        </label>
      );

    case "file_upload":
      return (
        <FileField
          id={ids.control}
          slug={slug}
          question={question}
          invalid={invalid}
          describedBy={ids.describedBy}
          onFilesChange={onFilesChange}
          onBusyChange={onBusyChange}
          announce={announce}
        />
      );

    case "statement":
    case "divider":
      return null;
  }
}

function ScaleGroup({
  values,
  value,
  onChange,
  invalid,
  labelFor,
  groupAria,
}: {
  values: number[];
  value: number | null;
  onChange: (value: number) => void;
  invalid: boolean;
  labelFor: (value: number) => string;
  groupAria: {
    "aria-labelledby": string;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
  };
}) {
  return (
    <RadioGroup
      value={value === null ? "" : String(value)}
      onValueChange={(next) => onChange(Number(next))}
      orientation="horizontal"
      aria-invalid={invalid || undefined}
      className="flex-row flex-wrap"
      {...groupAria}
    >
      {values.map((entry) => (
        <RadioGroupTile
          key={entry}
          value={String(entry)}
          aria-label={labelFor(entry)}
          aria-invalid={invalid || undefined}
        >
          {entry}
        </RadioGroupTile>
      ))}
    </RadioGroup>
  );
}

/**
 * Typing past the limit is allowed and flagged: a native `maxLength` would cut
 * off a pasted answer without a word.
 */
function CharacterCount({ text, max }: { text: string; max: number | null }) {
  if (max === null) return null;
  const length = textLength(text);
  return (
    <p className={cn("mt-1.5 text-right text-sm tabular-nums", length > max && "text-error")}>
      {length}/{max} Zeichen
    </p>
  );
}
