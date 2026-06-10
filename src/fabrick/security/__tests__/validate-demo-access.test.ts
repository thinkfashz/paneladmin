import { beforeEach, describe, expect, it, vi } from "vitest";

import * as tokenModule from "../token";
import {
  type DemoAccessInput,
  type DemoAccessRecord,
  validateDemoAccessInput,
  validateDemoAccessRecord,
} from "../validate-demo-access";

vi.mock("../token", () => ({
  hashToken: vi.fn(),
  isExpired: vi.fn(),
}));

describe("validateDemoAccessInput", () => {
  it("should return missing_slug when slug is missing", () => {
    const input: DemoAccessInput = { token: "token123" };
    const result = validateDemoAccessInput(input);
    expect(result).toEqual({
      allowed: false,
      reason: "missing_slug",
      redirectTo: "/demo-expired?reason=missing_slug",
    });
  });

  it("should return missing_slug when slug is empty or null", () => {
    const input1: DemoAccessInput = { slug: "", token: "token123" };
    expect(validateDemoAccessInput(input1)).toEqual({
      allowed: false,
      reason: "missing_slug",
      redirectTo: "/demo-expired?reason=missing_slug",
    });

    const input2: DemoAccessInput = { slug: null, token: "token123" };
    expect(validateDemoAccessInput(input2)).toEqual({
      allowed: false,
      reason: "missing_slug",
      redirectTo: "/demo-expired?reason=missing_slug",
    });
  });

  it("should return missing_token when token is missing", () => {
    const input: DemoAccessInput = { slug: "slug-123" };
    const result = validateDemoAccessInput(input);
    expect(result).toEqual({
      allowed: false,
      reason: "missing_token",
      redirectTo: "/demo-expired?reason=missing_token",
    });
  });

  it("should return missing_token when token is empty or null", () => {
    const input1: DemoAccessInput = { slug: "slug-123", token: "" };
    expect(validateDemoAccessInput(input1)).toEqual({
      allowed: false,
      reason: "missing_token",
      redirectTo: "/demo-expired?reason=missing_token",
    });

    const input2: DemoAccessInput = { slug: "slug-123", token: null };
    expect(validateDemoAccessInput(input2)).toEqual({
      allowed: false,
      reason: "missing_token",
      redirectTo: "/demo-expired?reason=missing_token",
    });
  });

  it("should return null for valid input", () => {
    const input: DemoAccessInput = { slug: "slug-123", token: "token-123" };
    const result = validateDemoAccessInput(input);
    expect(result).toBeNull();
  });
});

describe("validateDemoAccessRecord", () => {
  const validInput: DemoAccessInput = { slug: "my-business", token: "secret-token" };
  const mockDate = new Date("2025-01-01T00:00:00Z");
  let validRecord: DemoAccessRecord;

  beforeEach(() => {
    vi.resetAllMocks();
    validRecord = {
      businessId: "biz-123",
      businessSlug: "my-business",
      businessStatus: "demo",
      tokenHash: "hashed-secret",
      expiresAt: mockDate,
      isActive: true,
      visitCount: 0,
      maxVisits: 10,
    };
    (tokenModule.hashToken as ReturnType<typeof vi.fn>).mockResolvedValue("hashed-secret");
    (tokenModule.isExpired as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  it("should fail early on missing input", async () => {
    const invalidInput: DemoAccessInput = { token: "token123" };
    const result = await validateDemoAccessRecord(invalidInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "missing_slug",
      redirectTo: "/demo-expired?reason=missing_slug",
    });
  });

  it("should return invalid_token when record is null", async () => {
    const result = await validateDemoAccessRecord(validInput, null);
    expect(result).toEqual({
      allowed: false,
      reason: "invalid_token",
      redirectTo: "/demo-expired?reason=invalid_token",
    });
  });

  it("should return invalid_token when token hash does not match", async () => {
    (tokenModule.hashToken as ReturnType<typeof vi.fn>).mockResolvedValue("different-hash");
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "invalid_token",
      redirectTo: "/demo-expired?reason=invalid_token",
    });
  });

  it("should return invalid_token when business slug does not match", async () => {
    const invalidInput: DemoAccessInput = { slug: "other-business", token: "secret-token" };
    const result = await validateDemoAccessRecord(invalidInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "invalid_token",
      redirectTo: "/demo-expired?reason=invalid_token",
    });
  });

  it("should return token_inactive when record is not active", async () => {
    validRecord.isActive = false;
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "token_inactive",
      redirectTo: "/demo-expired?reason=inactive",
    });
  });

  it("should return token_expired when token is expired", async () => {
    (tokenModule.isExpired as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "token_expired",
      redirectTo: "/demo-expired?reason=expired",
    });
  });

  it("should return business_blocked when business status is blocked", async () => {
    validRecord.businessStatus = "blocked";
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "business_blocked",
      redirectTo: "/demo-expired?reason=blocked",
    });
  });

  it("should return business_expired when business status is expired", async () => {
    validRecord.businessStatus = "expired";
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "business_expired",
      redirectTo: "/demo-expired?reason=business_expired",
    });
  });

  it("should return visit_limit_reached when visitCount is equal to or greater than maxVisits", async () => {
    validRecord.visitCount = 10;
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: false,
      reason: "visit_limit_reached",
      redirectTo: "/demo-expired?reason=visit_limit",
    });

    validRecord.visitCount = 11;
    const result2 = await validateDemoAccessRecord(validInput, validRecord);
    expect(result2).toEqual({
      allowed: false,
      reason: "visit_limit_reached",
      redirectTo: "/demo-expired?reason=visit_limit",
    });
  });

  it("should return success and valid payload on happy path", async () => {
    const result = await validateDemoAccessRecord(validInput, validRecord);
    expect(result).toEqual({
      allowed: true,
      businessId: "biz-123",
      tokenHash: "hashed-secret",
      expiresAt: mockDate,
    });
  });
});
