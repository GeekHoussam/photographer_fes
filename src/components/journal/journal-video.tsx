"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Locale } from "@/config/site";
import {
  getVideoEmbedUrl,
  getVideoThumbnailUrl,
} from "@/features/portfolio/videos";
import type { JournalVideo as JournalVideoData } from "@/types/content";

export function JournalVideo({
  video,
  locale,
}: {
  video: JournalVideoData;
  locale: Locale;
}) {
  const [isActive, setIsActive] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
  );
  const [thumbnailUnavailable, setThumbnailUnavailable] = useState(false);
  const fallbackThumbnailUrl = getVideoThumbnailUrl(video.videoId);
  const title = video.label[locale];
  const portrait = video.aspect === "portrait";
  const copy = {
    fr: {
      play: "Lire la vidéo",
      unavailable:
        "Miniature indisponible. La vidéo reste accessible sur YouTube.",
      youtube: "Voir sur YouTube",
    },
    en: {
      play: "Play video",
      unavailable:
        "Thumbnail unavailable. The video remains available on YouTube.",
      youtube: "Watch on YouTube",
    },
    ar: {
      play: "تشغيل الفيديو",
      unavailable: "الصورة المصغرة غير متاحة. يبقى الفيديو متاحًا على YouTube.",
      youtube: "المشاهدة على YouTube",
    },
  }[locale];

  function handleThumbnailError() {
    if (thumbnailUrl !== fallbackThumbnailUrl) {
      setThumbnailUrl(fallbackThumbnailUrl);
      return;
    }

    setThumbnailUnavailable(true);
  }

  return (
    <figure
      className={portrait ? "journal-video-portrait" : undefined}
      data-journal-video={video.videoId}
      data-video-aspect={video.aspect}
    >
      <div
        className={`bg-surface-elevated relative isolate overflow-hidden border border-current/12 ${
          portrait ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        {isActive ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`${getVideoEmbedUrl(video.videoId)}?autoplay=1&rel=0`}
            title={title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            data-journal-video-player
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-start"
            onClick={() => setIsActive(true)}
            aria-label={`${copy.play}: ${title}`}
            data-journal-video-play
          >
            {thumbnailUnavailable ? (
              <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-current/55">
                {copy.unavailable}
              </span>
            ) : (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes={
                  portrait
                    ? "(min-width: 768px) 30vw, 82vw"
                    : "(min-width: 1024px) 68vw, 100vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                onError={handleThumbnailError}
              />
            )}
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/8 to-black/10"
              aria-hidden="true"
            />
            <span className="theme-lock-dark absolute inset-0 flex items-center justify-center">
              <span
                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/75 bg-black/35 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
                data-video-play-control
              >
                <Play
                  className="ms-1 h-7 w-7 fill-current"
                  aria-hidden="true"
                />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-5">
        <span className="block text-sm leading-7 text-current/60">{title}</span>
        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link-arrow mt-3"
          aria-label={`${copy.youtube}: ${title}`}
        >
          {copy.youtube} <span aria-hidden="true">↗</span>
        </a>
      </figcaption>
    </figure>
  );
}
