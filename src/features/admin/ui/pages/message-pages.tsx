import Link from "next/link";
import { requireAdmin } from "../../server/auth";
import { getMessage, getReplies, listMessages } from "../../server/messages";
import { listNotifications } from "../../server/notifications";
import { getSettings } from "../../server/settings";
import { adminI18n } from "../../server/locale";
import { replyEmailConfigured } from "@/lib/email/send-admin-reply";
import { messageStatuses } from "../../schema";
import {
  PageHeading,
  Filters,
  Pagination,
  Details,
  DateValue,
  StatusBadge,
  EmptyState,
} from "../primitives";
import { MessageList } from "../tables";
import { MutationButton, MarkMessageRead } from "../controls";
import { ReplyForm } from "../message-forms";
import { SettingsForm } from "../basic-forms";
import {
  readQuery,
  recordOr404,
  type SearchProps,
  type DetailProps,
} from "./shared";

export async function MessagesPage(props: SearchProps) {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const query = await readQuery(props);
  const data = await listMessages(actor, query);
  return (
    <>
      <PageHeading title={t("nav.messages")} />
      <Filters
        path="/admin/messages"
        query={query}
        statuses={["UNREAD", ...messageStatuses]}
      />
      <section className="admin-panel">
        <MessageList items={data.items} />
        <Pagination {...data} path="/admin/messages" query={query} />
      </section>
    </>
  );
}
export async function MessageDetailPage({ params }: DetailProps) {
  const actor = await requireAdmin();
  const { id } = await params;
  const { t } = await adminI18n();
  const message = await recordOr404(() => getMessage(actor, id));
  const replies = await getReplies(actor, id);
  return (
    <>
      <MarkMessageRead key={id} id={id} isRead={message.isRead} />
      <PageHeading
        title={message.name}
        intro={t("messageDetails")}
        action={
          <div className="admin-actions">
            <MutationButton
              path={`messages/${id}`}
              data={{ isRead: !message.isRead }}
            >
              {t(message.isRead ? "actions.markUnread" : "actions.markRead")}
            </MutationButton>
            {message.status !== "ARCHIVED" && (
              <MutationButton
                path={`messages/${id}`}
                data={{ status: "ARCHIVED" }}
                confirmation={t("confirm.archiveMessage")}
              >
                {t("actions.archive")}
              </MutationButton>
            )}
          </div>
        }
      />
      <section className="admin-panel">
        <StatusBadge status={message.status} />
        <Details
          entries={[
            [t("fields.email"), <bdi key="email">{message.email}</bdi>],
            [t("fields.phone"), <bdi key="phone">{message.phone}</bdi>],
            [
              t("fields.receivedAt"),
              <DateValue key="date" value={message.createdAt} withTime />,
            ],
            [t("fields.projectType"), t(`projectTypes.${message.projectType}`)],
            [t("fields.preferredDate"), message.preferredDate],
            [t("fields.location"), message.location],
            [t("fields.budget"), message.budget],
          ]}
        />
        <p className="admin-message-content">{message.message}</p>
        <p className="admin-muted">
          {t("emailNotice", { status: t(`statuses.${message.emailStatus}`) })}
        </p>
      </section>
      <ReplyForm messageId={id} configured={replyEmailConfigured()} />
      <section className="admin-panel">
        <h2>{t("replyHistory")}</h2>
        {replies.length === 0 ? (
          <EmptyState />
        ) : (
          replies.map((reply) => (
            <article className="admin-reply" key={reply.id}>
              <div>
                <DateValue value={reply.sentAt ?? reply.createdAt} withTime />{" "}
                <StatusBadge status={reply.status} />
              </div>
              <p className="admin-preserve">{reply.content}</p>
              {reply.status !== "SENT" && replyEmailConfigured() && (
                <MutationButton
                  path={`messages/${id}/reply`}
                  method="POST"
                  data={{ requestId: reply.id, content: reply.content }}
                >
                  {t("actions.retry")}
                </MutationButton>
              )}
            </article>
          ))
        )}
        {replies.length >= 50 && (
          <p className="admin-muted">{t("historyLimit")}</p>
        )}
      </section>
    </>
  );
}
export async function NotificationsPage(props: SearchProps) {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const query = await readQuery(props);
  const data = await listNotifications(actor, query);
  return (
    <>
      <PageHeading
        title={t("nav.notifications")}
        intro={t("notificationHelp")}
        action={
          <MutationButton path="notifications/all">
            {t("actions.markAllRead")}
          </MutationButton>
        }
      />
      <section className="admin-panel">
        {data.items.length ? (
          data.items.map((item) => (
            <article
              className={`admin-notification ${!item.isRead ? "is-unread" : ""}`}
              key={item.id}
            >
              <div>
                <h2>
                  <Link href={`/admin/messages/${item.messageId}`}>
                    {t("notificationTitle")}
                  </Link>
                </h2>
                <p>{t("notificationText", { name: item.name })}</p>
                <DateValue value={item.createdAt} withTime />
              </div>
              {!item.isRead && (
                <MutationButton path={`notifications/${item.id}`}>
                  {t("actions.markRead")}
                </MutationButton>
              )}
            </article>
          ))
        ) : (
          <EmptyState />
        )}
        <Pagination {...data} path="/admin/notifications" />
      </section>
    </>
  );
}
export async function SettingsPage() {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const settings = await getSettings(actor);
  return (
    <>
      <PageHeading title={t("nav.settings")} intro={t("settingsHint")} />
      <SettingsForm settings={settings} />
      <section className="admin-panel">
        <h2>{t("profile")}</h2>
        <p>
          {actor.name} · <bdi>{actor.email}</bdi>
        </p>
        <p className="admin-muted">{t("sessionsHint")}</p>
      </section>
    </>
  );
}
