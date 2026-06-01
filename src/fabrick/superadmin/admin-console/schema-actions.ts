import type { AdminConsoleCommandId } from "./commands";

export type DatabaseProviderRuntime = "insforge" | "supabase" | "pocketbase" | "none";

export type SchemaActionResult = {
  ok: boolean;
  provider: DatabaseProviderRuntime;
  commandId: AdminConsoleCommandId;
  message: string;
  nextSteps: string[];
};

export function detectRuntimeProvider(): DatabaseProviderRuntime {
  if (process.env.INSFORGE_BASE_URL && process.env.INSFORGE_PROJECT_ID) return "insforge";
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.POCKETBASE_URL) return "pocketbase";
  return "none";
}

export async function runSchemaAction(commandId: AdminConsoleCommandId): Promise<SchemaActionResult> {
  const provider = detectRuntimeProvider();

  if (provider === "none") {
    return {
      ok: false,
      provider,
      commandId,
      message: "No hay proveedor de base conectado. Configura InsForge, Supabase o PocketBase.",
      nextSteps: [
        "Configurar variables de entorno.",
        "Revisar /superadmin/system/database.",
        "Probar conexion antes de crear tablas.",
      ],
    };
  }

  if (commandId === "db.create_core_tables") {
    return {
      ok: true,
      provider,
      commandId,
      message: `Accion preparada para crear tablas principales en ${provider}.`,
      nextSteps: [
        "Ejecutar adaptador real del proveedor seleccionado.",
        "Verificar tablas businesses, profiles, settings, demos, store, crm, agenda y quotes.",
        "Registrar la ejecucion en access_logs.",
      ],
    };
  }

  if (commandId === "db.create_access_logs") {
    return {
      ok: true,
      provider,
      commandId,
      message: `Accion preparada para crear auditoria de accesos en ${provider}.`,
      nextSteps: [
        "Crear tabla o coleccion access_logs.",
        "Guardar event_type, usuario, dispositivo, IP hash, ruta y fecha.",
        "Restringir lectura a superadmin.",
      ],
    };
  }

  return {
    ok: true,
    provider,
    commandId,
    message: `Comando ${commandId} preparado para ${provider}.`,
    nextSteps: ["Conectar implementacion especifica del proveedor."],
  };
}
