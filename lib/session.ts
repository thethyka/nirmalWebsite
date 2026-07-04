export const SESSION_COOKIE = "nirmal_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 24 * 60 * 60; // ~60 days

export type Role = "guest" | "admin";

const encoder = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Session cookie is a signed, self-contained token: "<role>.<expiresAtMs>.<hmacSignature>".
// No server-side session store — verification just checks the HMAC and expiry.
export async function createSessionToken(
  role: Role,
  secret: string,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS,
): Promise<string> {
  const expires = Date.now() + maxAgeSeconds * 1000;
  const payload = `${role}.${expires}`;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<Role | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [role, expiresStr, signature] = parts;
  if (role !== "guest" && role !== "admin") return null;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return null;

  const key = await getKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signature).buffer as ArrayBuffer,
    encoder.encode(`${role}.${expiresStr}`),
  );

  return valid ? role : null;
}
