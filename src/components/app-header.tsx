import Link from "next/link";

type AppHeaderProps = {
  active?: "home" | "friends";
};

export function AppHeader({ active }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          OURTZ
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className={
              active === "home"
                ? "text-zinc-900"
                : "text-zinc-500 transition-colors hover:text-zinc-900"
            }
          >
            Home
          </Link>
          <Link
            href="/friends"
            className={
              active === "friends"
                ? "text-zinc-900"
                : "text-zinc-500 transition-colors hover:text-zinc-900"
            }
          >
            Friends
          </Link>
        </nav>
      </div>
    </header>
  );
}
