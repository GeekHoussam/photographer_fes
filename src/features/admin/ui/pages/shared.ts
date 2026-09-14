import "server-only";
import { notFound } from "next/navigation";
import { z } from "zod";
import { querySchema } from "../../schema";
import { AdminError } from "../../errors";

export type SearchProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export type DetailProps = { params: Promise<{ id: string }> };
export async function readQuery(props: SearchProps) {
  const raw = await props.searchParams;
  const parsed = querySchema.safeParse({
    clientId: raw.clientId,
    q: raw.q,
    status: raw.status,
    page: raw.page,
  });
  return parsed.success ? parsed.data : querySchema.parse({});
}
export async function recordOr404<T>(load: () => Promise<T>) {
  try {
    return await load();
  } catch (error) {
    if (
      error instanceof z.ZodError ||
      (error instanceof AdminError && error.status === 404)
    )
      notFound();
    throw error;
  }
}
