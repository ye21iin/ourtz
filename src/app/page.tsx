import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { LocalClock } from "@/components/local-clock";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader active="home" />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Local-first timezone planning
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Plan across time zones.
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Convert event times and see when your people are awake. Everything
            stays on your device — no accounts, no backend.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-3xl">
          <HomeLink
            href="/events"
            title="Events"
            description="Save a time in one city and see it in yours."
            action="Open Events"
            primary
          />
          <HomeLink
            href="/friends"
            title="Friends"
            description="Keep a live view of people across time zones."
            action="Open Friends"
          />
        </div>

        <div className="mt-10 max-w-sm">
          <LocalClock />
        </div>
      </main>
    </div>
  );
}

function HomeLink({
  href,
  title,
  description,
  action,
  primary = false,
}: {
  href: string;
  title: string;
  description: string;
  action: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      <span
        className={
          primary
            ? "mt-6 inline-flex w-fit rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "mt-6 inline-flex w-fit rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        }
      >
        {action}
      </span>
    </Link>
  );
}
