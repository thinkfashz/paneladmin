import type { ConsolePermissionLevel } from "./policy";

export type AdminConsoleCommandId =
  | "system.health"
  | "db.status"
  | "db.create_core_tables"
  | "db.create_access_logs"
  | "db.list_tables"
  | "app.files_overview"
  | "app.module_map";

export type AdminConsoleCommand = {
  id: AdminConsoleCommandId;
  label: string;
  description: string;
  permissionLevel: ConsolePermissionLevel;
  requiresConfirmation: boolean;
  providerMode: "any" | "insforge" | "supabase" | "pocketbase";
};

export const adminConsoleCommands: AdminConsoleCommand[] = [
  {
    id: "system.health",
    label: "Revisar salud del sistema",
    description: "Muestra estado general de variables, proveedores y modulos internos.",
    permissionLevel: "read_only",
    requiresConfirmation: false,
    providerMode: "any",
  },
  {
    id: "db.status",
    label: "Revisar conexion de base",
    description: "Prueba InsForge, Supabase y PocketBase segun variables configuradas.",
    permissionLevel: "read_only",
    requiresConfirmation: false,
    providerMode: "any",
  },
  {
    id: "db.create_core_tables",
    label: "Crear tablas principales",
    description: "Prepara el schema base: businesses, profiles, settings, demos, store, CRM, agenda y quotes.",
    permissionLevel: "schema_manager",
    requiresConfirmation: true,
    providerMode: "any",
  },
  {
    id: "db.create_access_logs",
    label: "Crear tabla de auditoria de accesos",
    description: "Prepara la coleccion/tabla access_logs para registrar entradas, IP en hash, dispositivo y usuario.",
    permissionLevel: "schema_manager",
    requiresConfirmation: true,
    providerMode: "any",
  },
  {
    id: "db.list_tables",
    label: "Listar tablas o colecciones",
    description: "Lista tablas/colecciones disponibles si el proveedor lo permite.",
    permissionLevel: "read_only",
    requiresConfirmation: false,
    providerMode: "any",
  },
  {
    id: "app.files_overview",
    label: "Resumen de archivos del modulo",
    description: "Muestra rutas principales del sistema para diagnostico interno.",
    permissionLevel: "read_only",
    requiresConfirmation: false,
    providerMode: "any",
  },
  {
    id: "app.module_map",
    label: "Mapa modular",
    description: "Muestra como estan organizados los modulos Fabrick.",
    permissionLevel: "read_only",
    requiresConfirmation: false,
    providerMode: "any",
  },
];

export function getAdminConsoleCommand(id: AdminConsoleCommandId) {
  return adminConsoleCommands.find((command) => command.id === id);
}

export function canRunCommand(command: AdminConsoleCommand, level: ConsolePermissionLevel) {
  const order: ConsolePermissionLevel[] = ["read_only", "schema_manager", "data_manager", "owner_approval"];
  return order.indexOf(level) >= order.indexOf(command.permissionLevel);
}
