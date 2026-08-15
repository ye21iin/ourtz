import type { ButtonHTMLAttributes, ReactNode } from "react";

type CardIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  tone?: "neutral" | "danger";
};

export function CardIconButton({
  label,
  children,
  tone = "neutral",
  className = "",
  type = "button",
  ...props
}: CardIconButtonProps) {
  const toneClass =
    tone === "danger"
      ? "hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-300"
      : "hover:bg-zinc-50 dark:hover:bg-zinc-800";

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors dark:border-zinc-700 dark:text-zinc-400 ${toneClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
