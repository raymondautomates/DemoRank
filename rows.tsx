import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Thumb } from "@/components/media";
import { recordClick } from "@/lib/demorank/api";
import {
  categoryLabel,
  formatMoney,
  safeHttpsUrl,
  voteLabel,
  type Card,
  type Slot,
} from "@/lib/demorank/shared";

export function rankText(rank: number): string {
  return String(rank).padStart(2, "0");
}

export function VisitLink({ slug, href, label = "Visit" }: { slug: string; href: string; label?: string }) {
  const url = safeHttpsUrl(href);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      onClick={() => {
        void recordClick({ data: { slug } }).catch(() => undefined);
      }}
      className="inline-flex h-11 items-center gap-1 text-sm font-medium"
    >
      {label}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </a>
  );
}

export function DemoRow({
  demo,
  rank,
  onVote,
  voting,
  signedIn,
}: {
  demo: Card;
  rank: number;
  onVote: (slug: string) => void;
  voting: boolean;
  signedIn: boolean;
}) {
  return (
    <article className="grid grid-cols-[2.75rem_1fr] gap-x-3 border-b border-line py-4 sm:grid-cols-[3rem_7.5rem_1fr_auto] sm:items-center sm:gap-4">
      <p className={`font-serif text-2xl tabular-nums sm:text-3xl ${rank <= 3 ? "text-stamp" : "text-ink"}`}>
        {rankText(rank)}
      </p>
      <Link to="/demo/$slug" params={{ slug: demo.slug }} className="col-start-2 row-span-2 hidden sm:block">
        <Thumb category={demo.category} title={demo.title} videoKind={demo.videoKind} videoId={demo.videoId} />
      </Link>
      <div className="min-w-0 sm:col-start-3">
        <p className="text-xs tracking-wide text-muted uppercase">
          {categoryLabel(demo.category)}
          {demo.company !== demo.title ? ` · ${demo.company}` : ""}
        </p>
        <h2 className="mt-1 font-serif text-2xl leading-tight">
          <Link to="/demo/$slug" params={{ slug: demo.slug }} className="hover:text-stamp">
            {demo.title}
          </Link>
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{demo.pitch}</p>
      </div>
      <div className="col-start-2 mt-3 flex items-center gap-3 sm:col-start-4 sm:mt-0 sm:flex-col sm:items-end">
        {demo.owned ? (
          <Link to="/bid/$slug" params={{ slug: demo.slug }} className="inline-flex h-11 items-center text-sm">
            Your demo
          </Link>
        ) : signedIn ? (
          <button
            type="button"
            disabled={voting}
            aria-pressed={demo.voted}
            onClick={() => onVote(demo.slug)}
            className={
              demo.voted
                ? "inline-flex h-11 items-center bg-stamp px-3 text-sm font-medium text-paper disabled:opacity-50"
                : "inline-flex h-11 items-center border border-line bg-surface px-3 text-sm font-medium disabled:opacity-50"
            }
          >
            {demo.voted ? "Voted" : "Vote"}
          </button>
        ) : (
          <Link
            to="/login"
            className="inline-flex h-11 items-center border border-line bg-surface px-3 text-sm font-medium"
          >
            Vote
          </Link>
        )}
        <p className="text-sm text-muted tabular-nums">{voteLabel(demo.votes)}</p>
        <VisitLink slug={demo.slug} href={demo.productUrl} />
      </div>
    </article>
  );
}

export function SlotRow({ slot, index }: { slot: Slot; index: number }) {
  if (slot.open) {
    return (
      <article className="grid grid-cols-[2.75rem_1fr] gap-3 border-b border-line py-4">
        <p className="font-serif text-2xl text-muted tabular-nums">{rankText(index + 1)}</p>
        <div>
          <p className="text-xs tracking-widest text-muted uppercase">Open</p>
          <p className="mt-1 font-serif text-xl">No bid on this slot</p>
        </div>
      </article>
    );
  }
  const { demo } = slot;
  return (
    <article className="grid grid-cols-[2.75rem_1fr] gap-x-3 border-b border-line py-4 sm:grid-cols-[3rem_7.5rem_1fr_auto] sm:items-center sm:gap-4">
      <p className="font-serif text-2xl text-stamp tabular-nums">{rankText(index + 1)}</p>
      <Link to="/demo/$slug" params={{ slug: demo.slug }} className="hidden sm:block">
        <Thumb category={demo.category} title={demo.title} videoKind={demo.videoKind} videoId={demo.videoId} />
      </Link>
      <div className="min-w-0">
        <p className="text-xs tracking-widest text-stamp uppercase">Paid · {formatMoney(slot.amountCents)}</p>
        <h2 className="mt-1 font-serif text-2xl leading-tight">
          <Link to="/demo/$slug" params={{ slug: demo.slug }}>
            {demo.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-muted">{demo.company}</p>
      </div>
      <div className="col-start-2 sm:col-start-4">
        <VisitLink slug={demo.slug} href={demo.productUrl} label="Visit product" />
      </div>
    </article>
  );
}
