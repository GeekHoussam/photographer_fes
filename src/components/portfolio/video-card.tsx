"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Locale } from "@/config/site";
import {
  getVideoEmbedUrl,
  getVideoThumbnailUrl,
  type PortfolioVideo,
  videoCategoryLabel,
} from "@/features/portfolio/videos";

type VideoCardLabels = {
  play: string;
  watchOnYouTube: string;
  short: string;
  longForm: string;
  thumbnailUnavailable: string;
};

export function VideoCard({
  video,
  locale,
  labels,
  className = "",
}: {
  video: PortfolioVideo;
  locale: Locale;
  labels: VideoCardLabels;
  className?: string;
}) {
  const [isActive, setIsActive] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnailUrl);
  const [thumbnailUnavailable, setThumbnailUnavailable] = useState(false);
  const fallbackThumbnailUrl = getVideoThumbnailUrl(video.videoId);
  const aspectClass =
    video.contentType === "short" ? "aspect-[9/16]" : "aspect-video";

  function handleThumbnailError() {
    if (thumbnailUrl !== fallbackThumbnailUrl) {
      setThumbnailUrl(fallbackThumbnailUrl);
      return;
    }

    setThumbnailUnavailable(true);
  }

  return (
    <article
      className={className}
      data-video-id={video.videoId}
      data-video-category={video.category}
      data-video-type={video.contentType}
    >
      <div
        className={`bg-surface-elevated relative isolate overflow-hidden border border-white/10 ${aspectClass}`}
      >
        {isActive ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`${getVideoEmbedUrl(video.videoId)}?autoplay=1&rel=0`}
            title={video.title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            data-video-player
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden text-left"
            onClick={() => setIsActive(true)}
            aria-label={`${labels.play}: ${video.title}`}
            data-video-play
          >
            {thumbnailUnavailable ? (
              <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-current/55">
                {labels.thumbnailUnavailable}
              </span>
            ) : (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes={
                  video.contentType === "short"
                    ? "(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw"
                    : "(min-width: 1024px) 58vw, 100vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                onError={handleThumbnailError}
              />
            )}
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/8 to-black/10"
              aria-hidden="true"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/75 bg-black/35 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105">
                <Play
                  className="ml-1 h-7 w-7 fill-current"
                  aria-hidden="true"
                />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="flex items-start justify-between gap-5 pt-5">
        <div className="max-w-[46rem] min-w-0">
          <p className="eyebrow text-sand">
            {videoCategoryLabel(video.category, locale)}
          </p>
          <h2
            className="font-display mt-3 text-[clamp(1.75rem,3vw,3.25rem)] leading-[1.02] tracking-[-0.03em] [overflow-wrap:anywhere]"
            dir="auto"
          >
            {video.title}
          </h2>
        </div>
        <p className="shrink-0 pt-1 text-right text-[0.68rem] tracking-[0.1em] text-current/40 uppercase">
          {video.contentType === "short" ? labels.short : labels.longForm}
        </p>
      </div>
      <a
        href={video.youtubeUrl}
        target="_blank"
        rel="noreferrer"
        className="text-link-arrow mt-5"
        aria-label={`${labels.watchOnYouTube}: ${video.title}`}
      >
        {labels.watchOnYouTube} <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
