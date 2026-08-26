"use client";

import { useServerInsertedHTML } from "next/navigation";

export function ThemeInitializer({ script }: { script: string }) {
  useServerInsertedHTML(() => (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  ));

  return null;
}
