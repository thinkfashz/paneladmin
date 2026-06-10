import { describe, expect, it } from "vitest";

import { requirePermission } from "./guards";
import { AUTH_PERMISSIONS } from "./permissions";
import { AUTH_ROLES } from "./roles";
import { createEmptySession, createSessionState } from "./session";

describe("requirePermission", () => {
  it("should deny access if the user is not authenticated", () => {
    const session = createEmptySession();
    const result = requirePermission(session, AUTH_PERMISSIONS.MANAGE_BUSINESS);

    expect(result).toEqual({
      allowed: false,
      reason: "Usuario no autenticado.",
      redirectTo: "/login",
    });
  });

  it("should deny access if the user has insufficient permission", () => {
    const session = createSessionState({
      id: "user-id",
      role: AUTH_ROLES.STAFF,
      businessId: "business-id",
    });
    const result = requirePermission(session, AUTH_PERMISSIONS.MANAGE_BUSINESS);

    expect(result).toEqual({
      allowed: false,
      reason: "Permiso insuficiente.",
      redirectTo: "/unauthorized",
    });
  });

  it("should allow access if the user has the correct permission", () => {
    const session = createSessionState({
      id: "user-id",
      role: AUTH_ROLES.BUSINESS_OWNER,
      businessId: "business-id",
    });
    const result = requirePermission(session, AUTH_PERMISSIONS.MANAGE_BUSINESS);

    expect(result).toEqual({ allowed: true });
  });

  it("should allow access for superadmin to everything", () => {
    const session = createSessionState({
      id: "user-id",
      role: AUTH_ROLES.SUPERADMIN,
    });
    const result = requirePermission(session, AUTH_PERMISSIONS.MANAGE_PLATFORM);

    expect(result).toEqual({ allowed: true });
  });
});
