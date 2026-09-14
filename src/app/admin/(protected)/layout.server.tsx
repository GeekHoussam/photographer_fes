import { requireAdmin } from "@/features/admin/server/auth";
import { unreadNotifications } from "@/features/admin/server/notifications";
import { AdminFrame } from "@/features/admin/ui/admin-frame";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireAdmin();
  const unread = await unreadNotifications(actor);
  return (
    <AdminFrame name={actor.name} unread={unread}>
      {children}
    </AdminFrame>
  );
}
