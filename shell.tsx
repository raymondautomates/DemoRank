import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const NAV = [
  { to: "/", label: "Board" },
  { to: "/submit", label: "Submit" },
  { to: "/me", label: "Yours" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-h-11 items-center gap-2">
            <span className="grid size-7 place-items-center bg-stamp font-serif text-sm text-paper">D</span>
            <span className="font-serif text-lg leading-none">DemoRank</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ))}
            <AuthSlot />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6">{children}</main>
    </div>
  );
}

function NavLink({ to, label }: { to: "/" | "/submit" | "/me"; label: string }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-11 items-center px-2 ${active ? "text-ink" : "text-muted"} ${to === "/" ? "max-sm:hidden" : ""}`}
    >
      <span className={active ? "border-b border-stamp pb-0.5" : ""}>{label}</span>
    </Link>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <span className="ml-1 inline-block h-8 w-16 animate-pulse bg-line" />;
  if (!user) {
    return (
      <Link to="/login" className="ml-1 inline-flex h-11 items-center px-2.5 text-sm">
        Sign in
      </Link>
    );
  }
  return (
    <div className="ml-1 hidden max-w-40 items-center sm:flex">
      <UserButton />
    </div>
  );
}

export function PageIntro({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: string }) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="text-xs tracking-widest text-stamp uppercase">{eyebrow}</p> : null}
      <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
      {lede ? <p className="mt-3 max-w-xl text-muted">{lede}</p> : null}
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="border border-stamp/40 bg-stamp/5 px-3 py-2 text-sm text-ink">
      {children}
    </p>
  );
}

export const fieldClass =
  "h-11 w-full border border-line bg-surface px-3 text-base text-ink outline-none placeholder:text-muted focus-visible:border-stamp";

export const buttonClass = {
  stamp: "inline-flex h-11 items-center justify-center bg-stamp px-4 text-sm font-medium text-paper hover:bg-stamp/90 disabled:opacity-50",
  line: "inline-flex h-11 items-center justify-center border border-line bg-surface px-4 text-sm font-medium text-ink hover:border-ink disabled:opacity-50",
  text: "inline-flex h-11 items-center justify-center px-2 text-sm text-ink underline-offset-4 hover:underline disabled:opacity-50",
} as const;
