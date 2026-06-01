import { hashToken, isExpired } from "./token";

export type DemoAccessInput = {
  slug?: string | null;
  token?: string | null;
};

export type DemoAccessRecord = {
  businessId: string;
  businessSlug: string;
  businessStatus: "demo" | "active" | "expired" | "blocked" | string;
  tokenHash: string;
  expiresAt: string | Date;
  isActive: boolean;
  visitCount?: number | null;
  maxVisits?: number | null;
};

export type DemoAccessResult =
  | {
      allowed: true;
      businessId: string;
      tokenHash: string;
      expiresAt: Date;
    }
  | {
      allowed: false;
      reason:
        | "missing_slug"
        | "missing_token"
        | "invalid_token"
        | "token_inactive"
        | "token_expired"
        | "business_blocked"
        | "business_expired"
        | "visit_limit_reached";
      redirectTo: string;
    };

export function validateDemoAccessInput(input: DemoAccessInput): DemoAccessResult | null {
  if (!input.slug) {
    return {
      allowed: false,
      reason: "missing_slug",
      redirectTo: "/demo-expired?reason=missing_slug",
    };
  }

  if (!input.token) {
    return {
      allowed: false,
      reason: "missing_token",
      redirectTo: "/demo-expired?reason=missing_token",
    };
  }

  return null;
}

export function validateDemoAccessRecord(input: DemoAccessInput, record: DemoAccessRecord | null): DemoAccessResult {
  const inputError = validateDemoAccessInput(input);
  if (inputError) return inputError;

  if (!record) {
    return {
      allowed: false,
      reason: "invalid_token",
      redirectTo: "/demo-expired?reason=invalid_token",
    };
  }

  const incomingHash = hashToken(input.token!);

  if (incomingHash !== record.tokenHash || record.businessSlug !== input.slug) {
    return {
      allowed: false,
      reason: "invalid_token",
      redirectTo: "/demo-expired?reason=invalid_token",
    };
  }

  if (!record.isActive) {
    return {
      allowed: false,
      reason: "token_inactive",
      redirectTo: "/demo-expired?reason=inactive",
    };
  }

  if (isExpired(record.expiresAt)) {
    return {
      allowed: false,
      reason: "token_expired",
      redirectTo: "/demo-expired?reason=expired",
    };
  }

  if (record.businessStatus === "blocked") {
    return {
      allowed: false,
      reason: "business_blocked",
      redirectTo: "/demo-expired?reason=blocked",
    };
  }

  if (record.businessStatus === "expired") {
    return {
      allowed: false,
      reason: "business_expired",
      redirectTo: "/demo-expired?reason=business_expired",
    };
  }

  if (record.maxVisits && record.visitCount && record.visitCount >= record.maxVisits) {
    return {
      allowed: false,
      reason: "visit_limit_reached",
      redirectTo: "/demo-expired?reason=visit_limit",
    };
  }

  return {
    allowed: true,
    businessId: record.businessId,
    tokenHash: record.tokenHash,
    expiresAt: new Date(record.expiresAt),
  };
}
