"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

export function HeroMedia({
  posterSrc,
  posterAlt,
  videoSrc,
}: {
  posterSrc: string;
  posterAlt: string;
  videoSrc?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallViewport = window.matchMedia("(max-width: 767px)");

    const updateVideoPreference = () => {
      const connection = (navigator as NavigatorWithConnection).connection;
      const slowConnection =
        connection?.saveData ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g";

      setVideoAllowed(
        Boolean(videoSrc) &&
          !reducedMotion.matches &&
          !smallViewport.matches &&
          !slowConnection,
      );
    };

    updateVideoPreference();
    reducedMotion.addEventListener("change", updateVideoPreference);
    smallViewport.addEventListener("change", updateVideoPreference);

    return () => {
      reducedMotion.removeEventListener("change", updateVideoPreference);
      smallViewport.removeEventListener("change", updateVideoPreference);
    };
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoAllowed) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoAllowed]);

  return (
    <div className="absolute inset-0">
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        quality={88}
        className="hero-media-image object-cover"
      />
      {videoAllowed && videoSrc ? (
        <video
          ref={videoRef}
          aria-hidden="true"
          className="hero-media-video absolute inset-0 h-full w-full object-cover"
          data-ready={videoReady}
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          onCanPlay={() => setVideoReady(true)}
          onError={() => {
            setVideoAllowed(false);
            setVideoReady(false);
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
