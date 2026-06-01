import crypto from "node:crypto";

export type DemoTokenPayload = {
  token: string;
  tokenHash: string;
  expiresAt: Date;
};

export function createRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
  const secret = process.env.DEMO_TOKEN_SECRET;

  if (!secret) {
    throw new Error("DEMO_TOKEN_SECRET no esta configurado.");
  }

  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}

export function createDemoToken(hours = Number(process.env.NEXT_PUBLIC_DEFAULT_DEMO_HOURS ?? 72)): DemoTokenPayload {
  const token = createRandomToken();
  const tokenHash = hashToken(token);
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
