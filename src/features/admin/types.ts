import type {
  ClientInput,
  SettingsInput,
  DocumentInput,
  DocumentKind,
} from "./schema";
import type { calculateDocument } from "./money";

export type ClientRecord = ClientInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
export type FinancialDocument = Omit<DocumentInput, "discount" | "items"> &
  Omit<ReturnType<typeof calculateDocument>, "items"> & {
    id: string;
    number: string;
    kind: DocumentKind;
    status: string;
    amountPaid: number;
    sourceEstimateId: string | null;
    client: ClientInput;
    issuer: SettingsInput;
    revision: number;
    createdAt: string;
    updatedAt: string;
    items: ReturnType<typeof calculateDocument>["items"];
  };
export type DocumentSummary = Pick<
  FinancialDocument,
  | "id"
  | "number"
  | "status"
  | "currency"
  | "total"
  | "amountPaid"
  | "issueDate"
  | "dueDate"
  | "createdAt"
> & { clientName: string };
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  preferredDate: string;
  location: string;
  budget: string;
  message: string;
  status: string;
  isRead: boolean;
  emailStatus: string;
  createdAt: string;
  updatedAt: string;
  repliedAt: string | null;
};
export type MessageReply = {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
};
export type Notification = {
  id: string;
  messageId: string;
  name: string;
  isRead: boolean;
  createdAt: string;
};
export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
