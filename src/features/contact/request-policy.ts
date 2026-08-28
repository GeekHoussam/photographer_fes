import "server-only";

export const MAX_CONTACT_BODY_BYTES = 16 * 1024;
const BODY_TIMEOUT_MS = 10_000;

export class ContactRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(code);
  }
}

export function validateContactRequest(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl && process.env.NODE_ENV === "production") {
    throw new ContactRequestError(503, "unavailable");
  }

  let expectedOrigin: string;
  try {
    expectedOrigin = new URL(configuredUrl || request.url).origin;
  } catch {
    throw new ContactRequestError(503, "unavailable");
  }
  if (
    request.headers.get("origin") !== expectedOrigin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new ContactRequestError(403, "forbidden");
  }
  if (
    request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !==
    "application/json"
  ) {
    throw new ContactRequestError(415, "unsupported_media_type");
  }
  const length = request.headers.get("content-length");
  if (length !== null) {
    if (!/^\d+$/.test(length)) {
      throw new ContactRequestError(400, "invalid_length");
    }
    if (Number(length) > MAX_CONTACT_BODY_BYTES) {
      throw new ContactRequestError(413, "payload_too_large");
    }
  }
}

export async function readContactJson(request: Request): Promise<unknown> {
  if (!request.body) throw new ContactRequestError(400, "invalid_json");
  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new ContactRequestError(408, "request_timeout")),
      BODY_TIMEOUT_MS,
    );
  });
  let complete = false;

  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) {
        complete = true;
        break;
      }
      size += value.byteLength;
      if (size > MAX_CONTACT_BODY_BYTES) {
        throw new ContactRequestError(413, "payload_too_large");
      }
      chunks.push(value);
    }
    return JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(
        Buffer.concat(chunks, size),
      ),
    );
  } catch (error) {
    if (error instanceof ContactRequestError) throw error;
    throw new ContactRequestError(400, "invalid_json");
  } finally {
    clearTimeout(timer);
    if (!complete) void reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
