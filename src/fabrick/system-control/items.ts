export const systemControlItems = [
  { id: "system.health", label: "Estado del sistema", level: "read_only" },
  { id: "db.status", label: "Estado de base", level: "read_only" },
  { id: "db.create_core_tables", label: "Crear tablas principales", level: "schema_manager" },
  { id: "db.create_access_logs", label: "Crear registros de acceso", level: "schema_manager" },
  { id: "db.list_tables", label: "Listar tablas", level: "read_only" },
  { id: "app.files_overview", label: "Resumen de archivos", level: "read_only" },
  { id: "app.module_map", label: "Mapa modular", level: "read_only" },
] as const;
