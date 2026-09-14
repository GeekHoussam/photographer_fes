import { adminI18n } from "@/features/admin/server/locale";
export default async function AdminLoading() {
  const { t } = await adminI18n();
  return (
    <div className="admin-loading" role="status">
      <p>{t("loading")}</p>
      <div className="admin-skeleton" />
      <div className="admin-skeleton" />
    </div>
  );
}
