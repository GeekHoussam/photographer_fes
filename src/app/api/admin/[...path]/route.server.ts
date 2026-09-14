import type { NextRequest } from "next/server";
import { handleAdminRequest } from "@/features/admin/server/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return handleAdminRequest(request, (await context.params).path);
}
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
