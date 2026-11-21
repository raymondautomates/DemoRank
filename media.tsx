import { useState } from "react";
import { categoryLabel, playback, thumbUrl, type Category, type VideoKind } from "@/lib/demorank/shared";

export function Poster({ category, title }: { category: Category; title: string }) {
  return (
    <div className="grid h-full w-full place-items-end bg-ink p-2 text-paper">
      <span className="font-serif text-xs">{categoryLabel(category)}</span>
      <span className="sr-only">{title}</span>
    </div>
  );
}

export function Thumb({
  category,
  title,
  videoKind,
  videoId,
}: {
  category: Category;
  title: string;
  videoKind: VideoKind;
  videoId: string;
}) {
  const src = thumbUrl(videoKind, videoId);
  const [broken, setBroken] = useState(false);
  return (
    <div className="aspect-video w-full overflow-hidden bg-ink outline outline-1 -outline-offset-1 outline-ink/15">
      {src && !broken ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Poster category={category} title={title} />
      )}
    </div>
  );
}

export function Player({
  title,
  videoKind,
  videoId,
}: {
  title: string;
  videoKind: VideoKind;
  videoId: string;
}) {
  const media = playback(videoKind, videoId);
  if (!media) {
    return (
      <div className="grid aspect-video place-items-center bg-ink px-6 text-center text-sm text-paper">
        This video link cannot be played here.
      </div>
    );
  }
  if (media.mode === "file") {
    return (
      <video className="aspect-video w-full bg-ink" controls preload="metadata" src={media.src} />
    );
  }
  return (
    <iframe
      className="aspect-video w-full bg-ink"
      src={media.src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
