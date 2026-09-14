"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Bell,
  Camera,
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Mail,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { brandTitles, type Locale } from "@/config/site";
import { LanguageSelector, MutationButton } from "./controls";

const sections = [
  ["dashboard", "", LayoutDashboard],
  ["clients", "/clients", Users],
  ["estimates", "/estimates", FileText],
  ["invoices", "/invoices", Receipt],
  ["messages", "/messages", Mail],
  ["notifications", "/notifications", Bell],
  ["settings", "/settings", Settings],
] as const;
export function AdminFrame({
  children,
  name,
  unread,
}: {
  children: React.ReactNode;
  name: string;
  unread: number;
}) {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Simple polling refreshes server counts only while the private workspace is visible.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 60000);
    return () => window.clearInterval(timer);
  }, [router]);
  return (
    <div className="admin-app">
      <a href="#admin-content" className="admin-skip">
        {t("skip")}
      </a>
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <Link
          href="/admin"
          className="admin-brand"
          onClick={() => setOpen(false)}
        >
          <Camera size={30} aria-hidden="true" />
          <span>
            {brandTitles[locale]}
            <small>{t("private")}</small>
          </span>
        </Link>
        <nav id="admin-navigation" aria-label={t("menu")}>
          {sections.map(([key, suffix, Icon]) => {
            const href = `/admin${suffix}`;
            const active = suffix
              ? pathname.startsWith(href)
              : pathname === href;
            return (
              <Link
                href={href}
                key={key}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={19} aria-hidden="true" />
                {t(`nav.${key}`)}
                {key === "notifications" && unread > 0 && (
                  <span className="admin-count">{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <Link href={`/${locale}`} className="admin-back">
          {t("backToSite")}
        </Link>
      </aside>
      <div className="admin-body">
        <header className="admin-topbar">
          <button
            className="admin-mobile-toggle"
            aria-label={t("menu")}
            aria-expanded={open}
            aria-controls="admin-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <p>{t("brand")}</p>
          <div className="admin-topbar-actions">
            <LanguageSelector />
            <Link
              href="/admin/notifications"
              className="admin-bell"
              aria-label={`${t("nav.notifications")} (${unread})`}
            >
              <Bell size={21} aria-hidden="true" />
              {unread > 0 && <span className="admin-count">{unread}</span>}
            </Link>
            <span className="admin-profile">{name}</span>
            <MutationButton
              path="auth/logout"
              method="POST"
              redirectTo="/admin/login"
            >
              {t("logout")}
            </MutationButton>
          </div>
        </header>
        <main id="admin-content" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
