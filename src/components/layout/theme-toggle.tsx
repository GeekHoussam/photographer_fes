"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "photographer-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  themeColor?.setAttribute(
    "content",
    theme === "light" ? "#f4f3ef" : "#101112",
  );
}

export function ThemeToggle() {
  const locale = useLocale();
  const t = useTranslations("Theme");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const frame = window.requestAnimationFrame(() => setTheme(current));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(storageKey)) return;
      const next = event.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    media.addEventListener("change", followSystem);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", followSystem);
    };
  }, []);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        window.localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className="hover:border-sand hover:text-sand inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 transition-colors"
      aria-label={t(nextTheme === "light" ? "switchToLight" : "switchToDark")}
      title={t(nextTheme === "light" ? "switchToLight" : "switchToDark")}
      lang={locale}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  );
}
