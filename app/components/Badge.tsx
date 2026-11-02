import { MoveRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, HTMLAttributeAnchorTarget, MouseEventHandler, ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "outline" | "black" | "link";

interface BadgeProps {
  children: ReactNode;
  href?: string;
  variant?: BadgeVariant;
  className?: string;
  arrow?: boolean;
  icon?: ReactNode;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  id?: string;
  title?: string;
  tabIndex?: number;
  "aria-label"?: string;
}

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export default function Badge({
  children,
  href,
  variant = "outline",
  className,
  arrow,
  icon,
  target,
  rel,
  style,
  onClick,
  type = "button",
  ...props
}: BadgeProps) {
  const interactive = Boolean(href || onClick);
  const showArrow = arrow ?? Boolean(href);
  const resolvedRel = target === "_blank" ? rel ?? "noreferrer" : rel;

  const classes = cn(
    "inline-flex w-fit items-center gap-2 leading-tight",
    variant === "outline" && "border border-foreground px-3 py-1.5",
    variant === "black" && "border border-foreground bg-foreground px-3 py-1.5 text-background",
    interactive && variant === "link" && "transition-opacity hover:opacity-60",
    interactive && variant === "outline" && "transition-colors hover:bg-foreground hover:text-background",
    interactive && variant === "black" && "transition-colors hover:bg-lime hover:text-foreground",
    className,
  );

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {showArrow ? <MoveRight className="h-3.5 w-3.5 flex-none" aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    if (isInternalHref(href)) {
      return (
        <Link href={href} className={classes} target={target} rel={resolvedRel} style={style} {...props}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} target={target} rel={resolvedRel} style={style} {...props}>
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type={type} className={classes} style={style} onClick={onClick} {...props}>
        {content}
      </button>
    );
  }

  return (
    <span className={classes} style={style} {...props}>
      {content}
    </span>
  );
}
