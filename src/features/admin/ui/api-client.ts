"use client";
export async function adminRequest(
  path: string,
  method: string,
  data: unknown = {},
) {
  const response = await fetch(`/api/admin/${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "GET" ? undefined : JSON.stringify(data),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      typeof result.error === "string" ? result.error : "unavailable",
    );
  return result as { id?: string; ok?: boolean; count?: number };
}
