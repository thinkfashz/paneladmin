"use client";

import { useEffect, useMemo, useState } from "react";

import { CheckCircle2, Copy, Database, KeyRound, Lock, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  completeSetupAction,
  getSetupEnvStatusAction,
  testConnectionAction,
  verifyMigrationAction,
} from "@/fabrick/setup/actions";

type DatabaseProvider = "supabase" | "insforge";

type EnvStatus = {
  provider: DatabaseProvider;
  label: string;
  detected: boolean;
  variables: { name: string; detected: boolean }[];
};

type SetupWizardProps = {
  migrationSql: string;
};

const STEPS = [
  { id: 0, label: "Bienvenida" },
  { id: 1, label: "Conexion" },
  { id: 2, label: "Migracion" },
  { id: 3, label: "Tu cuenta" },
  { id: 4, label: "Listo" },
] as const;

export function SetupWizard({ migrationSql }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const [provider, setProvider] = useState<DatabaseProvider>("supabase");
  const [envStatuses, setEnvStatuses] = useState<EnvStatus[]>([]);

  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState("");
  const [insforgeBaseUrl, setInsforgeBaseUrl] = useState("");
  const [insforgeApiKey, setInsforgeApiKey] = useState("");
  const [connectionOk, setConnectionOk] = useState(false);
  const [migrationOk, setMigrationOk] = useState(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);

  const [adminFullName, setAdminFullName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("");

  const [envBlock, setEnvBlock] = useState("");

  const selectedEnvStatus = useMemo(
    () => envStatuses.find((status) => status.provider === provider),
    [envStatuses, provider],
  );
  const providerEnvDetected = Boolean(selectedEnvStatus?.detected);
  const credentials = {
    provider,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    insforgeBaseUrl,
    insforgeApiKey,
  };
  const manualCredentialsComplete =
    provider === "supabase"
      ? Boolean(supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey)
      : Boolean(insforgeBaseUrl && insforgeApiKey);
  const canTestConnection = providerEnvDetected || manualCredentialsComplete;

  useEffect(() => {
    void getSetupEnvStatusAction().then((result) => {
      if (result.envStatuses) setEnvStatuses(result.envStatuses);
      if (result.envProvider) setProvider(result.envProvider);
    });
  }, []);

  const handleTestConnection = async () => {
    setBusy(true);
    try {
      const result = await testConnectionAction(credentials);
      setConnectionOk(result.ok);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyMigration = async () => {
    setBusy(true);
    try {
      const result = await verifyMigrationAction(credentials);
      setMigrationOk(result.ok);
      setMissingTables(result.missingTables ?? []);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleComplete = async () => {
    if (adminPassword !== adminPasswordConfirm) {
      toast.error("Las contrasenas no coinciden.");
      return;
    }

    setBusy(true);
    try {
      const result = await completeSetupAction({
        ...credentials,
        adminFullName,
        adminEmail,
        adminPassword,
      });

      if (result.ok) {
        setEnvBlock(result.envBlock ?? "");
        setStep(4);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copiado al portapapeles.`);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="mb-2 flex flex-wrap gap-2">
          {STEPS.map((s) => (
            <Badge key={s.id} variant={s.id === step ? "default" : s.id < step ? "secondary" : "outline"}>
              {s.id < step ? "✓ " : ""}
              {s.label}
            </Badge>
          ))}
        </div>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5" />
          Configuracion inicial del panel
        </CardTitle>
        <CardDescription>
          Este asistente corre una sola vez. Al finalizar queda bloqueado y nadie mas puede acceder a el.
        </CardDescription>
      </CardHeader>

      {step === 0 && (
        <>
          <CardContent className="space-y-4 text-sm">
            <Alert>
              <Lock className="size-4" />
              <AlertTitle>Como se protege tu informacion</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>
                    Tus credenciales se guardan <strong>cifradas (AES-256-GCM)</strong> en el servidor, nunca en el
                    navegador ni en el repositorio.
                  </li>
                  <li>
                    Tu contrasena de administrador se guarda <strong>hasheada con bcrypt</strong> en tu propia base de
                    datos.
                  </li>
                  <li>
                    Si defines las variables de entorno en tus secretos (Vercel, .env.local), esas{" "}
                    <strong>siempre tienen prioridad</strong> sobre lo guardado aqui.
                  </li>
                  <li>
                    Al terminar se activa un <strong>candado</strong>: este asistente solo se puede reabrir con{" "}
                    <code>FABRICK_SETUP_FORCE=true</code> en tu entorno.
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
            <p>
              Puedes conectar Supabase o InsForge. Si ya definiste las variables en Vercel, el asistente las detecta
              automaticamente y te permite probar la conexion sin volver a pegar claves. Si faltan secretos, podras
              ingresarlos manualmente en el siguiente paso.
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => setStep(1)}>Comenzar</Button>
          </CardFooter>
        </>
      )}

      {step === 1 && (
        <>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 font-medium text-sm">
              <Database className="size-4" /> Conecta tu base de datos
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["supabase", "insforge"] as const).map((item) => {
                const status = envStatuses.find((envStatus) => envStatus.provider === item);
                return (
                  <button
                    type="button"
                    key={item}
                    className={`rounded-lg border p-3 text-left text-sm transition ${
                      provider === item ? "border-primary bg-primary/5" : "hover:bg-muted/60"
                    }`}
                    onClick={() => {
                      setProvider(item);
                      setConnectionOk(false);
                      setMigrationOk(false);
                    }}
                  >
                    <div className="font-medium">{item === "supabase" ? "Supabase" : "InsForge"}</div>
                    <div className="mt-1 text-muted-foreground text-xs">
                      {status?.detected ? "Claves detectadas en Vercel/entorno." : "Faltan claves en Vercel/entorno."}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedEnvStatus && (
              <Alert>
                <AlertTitle>{providerEnvDetected ? "Claves detectadas" : "Claves incompletas"}</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEnvStatus.variables.map((variable) => (
                      <Badge key={variable.name} variant={variable.detected ? "secondary" : "outline"}>
                        {variable.detected ? "✓" : "—"} {variable.name}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {!providerEnvDetected && provider === "supabase" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="setup-url">URL del proyecto</Label>
                  <Input
                    id="setup-url"
                    placeholder="https://xxxxx.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => {
                      setSupabaseUrl(e.target.value);
                      setConnectionOk(false);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="setup-anon">Anon key (publica)</Label>
                  <Input
                    id="setup-anon"
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="setup-service">Service role key (secreta, solo servidor)</Label>
                  <Input
                    id="setup-service"
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={supabaseServiceRoleKey}
                    onChange={(e) => {
                      setSupabaseServiceRoleKey(e.target.value);
                      setConnectionOk(false);
                    }}
                  />
                </div>
              </>
            )}
            {!providerEnvDetected && provider === "insforge" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="setup-insforge-url">URL base de InsForge</Label>
                  <Input
                    id="setup-insforge-url"
                    placeholder="https://api.insforge.app"
                    value={insforgeBaseUrl}
                    onChange={(e) => {
                      setInsforgeBaseUrl(e.target.value);
                      setConnectionOk(false);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="setup-insforge-api-key">API key</Label>
                  <Input
                    id="setup-insforge-api-key"
                    type="password"
                    placeholder="ik_..."
                    value={insforgeApiKey}
                    onChange={(e) => {
                      setInsforgeApiKey(e.target.value);
                      setConnectionOk(false);
                    }}
                  />
                </div>
              </>
            )}
            {connectionOk && (
              <p className="flex items-center gap-1.5 text-emerald-600 text-sm">
                <CheckCircle2 className="size-4" /> Conexion verificada.
              </p>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Atras
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" disabled={busy || !canTestConnection} onClick={handleTestConnection}>
                {busy ? "Probando..." : "Probar conexion"}
              </Button>
              <Button disabled={!connectionOk} onClick={() => setStep(2)}>
                Continuar
              </Button>
            </div>
          </CardFooter>
        </>
      )}

      {step === 2 && (
        <>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <p className="font-medium">Ejecuta la migracion inicial</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted-foreground">
                <li>Copia el SQL de abajo.</li>
                <li>
                  En Supabase, abre el <strong>SQL Editor</strong> y pega el SQL. En InsForge, puedes aplicar esta
                  migracion directamente desde el boton de abajo usando tu API key.
                </li>
                <li>Presiona Run y vuelve aqui para verificar.</li>
              </ol>
            </div>
            <div className="relative">
              <textarea
                readOnly
                value={migrationSql}
                rows={12}
                className="w-full resize-none rounded-md border bg-muted/50 p-3 font-mono text-xs"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(migrationSql, "SQL de migracion")}
              >
                <Copy className="size-3.5" /> Copiar
              </Button>
            </div>
            {missingTables.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Tablas faltantes</AlertTitle>
                <AlertDescription>{missingTables.join(", ")}</AlertDescription>
              </Alert>
            )}
            {migrationOk && (
              <p className="flex items-center gap-1.5 text-emerald-600 text-sm">
                <CheckCircle2 className="size-4" /> Todas las tablas existen.
              </p>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Atras
            </Button>
            <div className="flex gap-2">
<Button variant="outline" disabled={busy} onClick={handleVerifyMigration}>
                {busy ? "Verificando..." : "Verificar migracion"}
              </Button>
              <Button disabled={!migrationOk} onClick={() => setStep(3)}>
                Continuar
              </Button>
            </div>
          </CardFooter>
        </>
      )}

      {step === 3 && (
        <>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 font-medium text-sm">
              <UserRound className="size-4" /> Crea tu cuenta de administrador (superadmin)
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="setup-name">Nombre completo</Label>
              <Input id="setup-name" value={adminFullName} onChange={(e) => setAdminFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="setup-email">Email</Label>
              <Input
                id="setup-email"
                type="email"
                autoComplete="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="setup-password">Contrasena (minimo 10 caracteres, letras y numeros)</Label>
              <Input
                id="setup-password"
                type="password"
                autoComplete="new-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="setup-password-confirm">Confirmar contrasena</Label>
              <Input
                id="setup-password-confirm"
                type="password"
                autoComplete="new-password"
                value={adminPasswordConfirm}
                onChange={(e) => setAdminPasswordConfirm(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Atras
            </Button>
            <Button
              disabled={busy || !adminFullName || !adminEmail || !adminPassword || !adminPasswordConfirm}
              onClick={handleComplete}
            >
              {busy ? "Finalizando..." : "Finalizar configuracion"}
            </Button>
          </CardFooter>
        </>
      )}

      {step === 4 && (
        <>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 className="size-4" />
              <AlertTitle>Panel configurado y bloqueado</AlertTitle>
              <AlertDescription>
                Tu cuenta de administrador fue creada y el asistente quedo cerrado con candado.
              </AlertDescription>
            </Alert>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <KeyRound className="size-4" /> Guarda estas variables en tus secretos
              </p>
              <p className="text-muted-foreground">
                Copialas ahora a tu gestor de secretos (Vercel, .env.local de tu computador). No se volveran a mostrar.
                Si las defines en el entorno, tendran prioridad sobre lo guardado en el servidor.
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={envBlock}
                  rows={7}
                  className="w-full resize-none rounded-md border bg-muted/50 p-3 font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(envBlock, "Variables de entorno")}
                >
                  <Copy className="size-3.5" /> Copiar
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => (window.location.href = "/auth/v1/login")}>Ir al inicio de sesion</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
