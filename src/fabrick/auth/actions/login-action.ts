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

  const ok = email.includes("@"); // Simulación simple

  const activityMetadata = {
    email_attempted: email,
    provider,
  };

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
      message: "Credenciales inválidas.",
    };
  }

  // Si login es correcto (simulado)
  await writeActivityRecord({
    eventType: "login_success",
    path: "/auth/v1/login",
    method: "POST",
    userEmail: email,
    metadata: activityMetadata,
  });

  // Simulamos setear la cookie de sesión según el entorno dev para el superadmin o un usuario local
  if (process.env.DEV_SUPERADMIN_MODE === "true" && email === "dev@fabrick.local") {
    const cookieStore = await cookies();
    cookieStore.set("fabrick_session", "dev-superadmin-token", { secure: process.env.NODE_ENV === "production" });
  }

  return {
    ok: true,
    message: "Inicio de sesión exitoso.",
  };
}
