import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { passwordSchema } from "../schema";

const options = { N: 131072, r: 8, p: 1, maxmem: 192 * 1024 * 1024 };
function derive(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, options, (error, result) =>
      error ? reject(error) : resolve(result),
    );
  });
}
export async function hashPassword(password: string) {
  passwordSchema.parse(password);
  const salt = randomBytes(32).toString("hex");
  return `scrypt$${salt}$${(await derive(password, salt)).toString("hex")}`;
}

// Unknown users perform the same expensive derivation as known users.
const dummyHash = `scrypt$${"0".repeat(64)}$${"0".repeat(128)}`;
export async function verifyPassword(password: string, encoded = dummyHash) {
  const [algorithm, salt, key] = encoded.split("$");
  if (
    algorithm !== "scrypt" ||
    !/^[a-f0-9]{64}$/.test(salt ?? "") ||
    !/^[a-f0-9]{128}$/.test(key ?? "")
  )
    return false;
  const actual = await derive(password, salt);
  return timingSafeEqual(actual, Buffer.from(key, "hex"));
}
