import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ className = "", children }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] ${className}`}
    >
      {children}
    </div>
  );
}
