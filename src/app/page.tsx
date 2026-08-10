import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { LocalClock } from "@/components/local-clock";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader active="home" />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Local-first timezone planning
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            See when your people are awake.
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            OURTZ helps you plan calls and meetups across time zones. Everything
            stays on your device — no accounts, no backend.
          </p>

          <Link
            href="/friends"
            className="mt-8 inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Open Friends
          </Link>
        </div>

        <div className="mt-10 max-w-sm">
          <LocalClock />
        </div>
      </main>
    </div>
  );
}
