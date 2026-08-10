import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

type AppHeaderProps = {
  active?: "home" | "friends";
};

export function AppHeader({ active }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          OURTZ
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/"
              className={
                active === "home"
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }
            >
              Home
            </Link>
            <Link
              href="/friends"
              className={
                active === "friends"
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }
            >
              Friends
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
