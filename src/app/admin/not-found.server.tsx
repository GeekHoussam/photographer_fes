import Link from "next/link";
import { adminI18n } from "@/features/admin/server/locale";
export default async function AdminNotFound() {
  const { t } = await adminI18n();
  return (
    <section className="admin-panel">
      <h1>{t("notFound")}</h1>
      <Link href="/admin">{t("nav.dashboard")}</Link>
    </section>
  );
}
