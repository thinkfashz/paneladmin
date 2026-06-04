"use server";

import { cookies } from "next/headers";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";

import { getAuthProvider } from "../provider";

export async function loginAction(email: string, _password: string) {
  // En un entorno real, aquí se llamaría al SDK del proveedor de auth
  // para verificar las credenciales y obtener un JWT/session.

  const provider = getAuthProvider();

  // Simulated validation for demonstration based on the requirement
  // "Registrar intentos de login con writeActivityRecord()."
  // "Conecta usuario real, rol real y 'business_id' real."

  const activityMetadata = {
    email_attempted: email,
    provider,
  };

  // Modo desarrollo / Superadmin
  if (process.env.DEV_SUPERADMIN_MODE === "true" && email === "dev@fabrick.local") {
    await writeActivityRecord({
      eventType: "login_success",
      path: "/auth/v1/login",
      method: "POST",
      userEmail: email,
      metadata: activityMetadata,
    });

    const cookieStore = await cookies();
    cookieStore.set("fabrick_session", "dev-superadmin-token", { secure: process.env.NODE_ENV === "production" });

    return {
      ok: true,
      message: "Inicio de sesión exitoso (Dev Superadmin).",
    };
  }

  // Lógica de validación con Base de Datos
  // Simularemos la llamada que se conectará con InsForge o el proveedor que tengas
  let ok = false;
  let sessionToken = "";

  if (provider === "insforge") {
    const { getInsforgeConfig } = await import("@/fabrick/integrations/insforge/client");
    const config = getInsforgeConfig();

    if (config.baseUrl && config.anonKey) {
      try {
        // En una app real de Supabase/Insforge esto sería auth.signInWithPassword()
        // Aquí para este sistema custom, se asume que buscamos el perfil si no tenemos modulo auth
        // O usamos un wrapper. Para la etapa en la que estamos hacemos un mock que devuelve sesión si el mail existe.
        const url = new URL(
          `/rest/v1/profiles?select=id,role,business_id&email=eq.${encodeURIComponent(email)}`,
          config.baseUrl,
        );
        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${config.anonKey}`,
            "x-project-id": config.projectId as string,
          },
        });

        if (res.ok) {
          const profiles = await res.json();
          if (profiles && profiles.length > 0) {
            // Check password correctly utilizing the stored password_hash using bcrypt.
            // Assuming the actual profile payload contains "password_hash" as usually expected.
            const profile = profiles[0];
            const { compare } = await import("bcryptjs");

            // To prevent crashing with missing fields when creating manual demos,
            // fallback gracefully ensuring only authenticated ones match.
            const isValidPassword = profile.password_hash ? await compare(_password, profile.password_hash) : false;

            if (isValidPassword) {
              ok = true;

              // Simulamos la creación de un JWT firmado usando nuestra utilidad HMAC
              const { hmacSha256 } = await import("@/fabrick/security/hash");
              const secret = process.env.ACCESS_LOG_SECRET || "dev_secret";

              const payloadData = JSON.stringify({
                id: profile.id,
                role: profile.role,
                businessId: profile.business_id,
                email: email,
              });

              const base64Payload = btoa(payloadData);
              const signature = await hmacSha256(base64Payload, secret);

              sessionToken = `${base64Payload}.${signature}`;
            }
          }
        }
      } catch (err) {
        console.error("Login call failed", err);
      }
    }
  }

  if (!ok) {
    await writeActivityRecord({
      eventType: "login_failed",
      path: "/auth/v1/login",
      method: "POST",
      userEmail: email,
      metadata: activityMetadata,
    });

    return {
      ok: false,
      message: "Credenciales inválidas o proveedor no configurado correctamente.",
    };
  }

  await writeActivityRecord({
    eventType: "login_success",
    path: "/auth/v1/login",
    method: "POST",
    userEmail: email,
    metadata: activityMetadata,
  });

  const cookieStore = await cookies();
  cookieStore.set("fabrick_session", sessionToken, { secure: process.env.NODE_ENV === "production", path: "/" });

  return {
    ok: true,
    message: "Inicio de sesión exitoso.",
  };
}
