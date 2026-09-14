import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera } from "lucide-react";
import { currentActor } from "@/features/admin/server/auth";
import { databaseConfigured } from "@/features/admin/server/database";
import { adminI18n } from "@/features/admin/server/locale";
import { LoginForm } from "@/features/admin/ui/basic-forms";
import { LanguageSelector } from "@/features/admin/ui/controls";

export default async function LoginPage() {
  const actor = await currentActor();
  if (actor?.role === "ADMIN") redirect("/admin");
  const { t, locale } = await adminI18n();
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-section-heading">
          <Camera size={34} aria-hidden="true" />
          <LanguageSelector />
        </div>
        <p className="admin-eyebrow">{t("private")}</p>
        <h1>{t("login")}</h1>
        <p className="admin-muted">{t("loginIntro")}</p>
        {!databaseConfigured() && (
          <p className="admin-alert">{t("setupRequired")}</p>
        )}
        <LoginForm />
        <Link className="admin-back" href={`/${locale}`}>
          {t("backToSite")}
        </Link>
      </div>
    </main>
  );
}
