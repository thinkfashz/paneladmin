// Fallback for edge runtime where node:crypto is not available
// We'll use Web Crypto API

export type DemoTokenPayload = {
  token: string;
  tokenHash: string;
  expiresAt: Date;
};

export function createRandomToken(bytes = 32) {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  // Base64Url encoding simulation
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function hashToken(token: string) {
  const secret = process.env.DEMO_TOKEN_SECRET;

  if (!secret) {
    throw new Error("DEMO_TOKEN_SECRET no esta configurado.");
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);

  const tokenData = encoder.encode(token);
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, tokenData);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return signatureHex;
}

export async function createDemoToken(
  hours = Number(process.env.NEXT_PUBLIC_DEFAULT_DEMO_HOURS ?? 72),
): Promise<DemoTokenPayload> {
  const token = createRandomToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

export function isExpired(date: Date | string) {
  const expiresAt = typeof date === "string" ? new Date(date) : date;
  return expiresAt.getTime() <= Date.now();
}
