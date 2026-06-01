export type ConsolePermissionLevel = "read_only" | "schema_manager" | "data_manager" | "owner_approval";

export type ConsolePolicy = {
  enabled: boolean;
  permissionLevel: ConsolePermissionLevel;
  confirmationText: string;
};

export const CONSOLE_CONFIRMATION_TEXT = "APPROVE_ACTION";

export const defaultConsolePolicy: ConsolePolicy = {
  enabled: false,
  permissionLevel: "read_only",
  confirmationText: CONSOLE_CONFIRMATION_TEXT,
};

export function isConfirmationValid(value?: string | null) {
  return value === CONSOLE_CONFIRMATION_TEXT;
}
