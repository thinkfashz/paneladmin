"use server";

import { cookies } from "next/headers";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";

import { SESSION_COOKIE_NAME } from "../token";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  await writeActivityRecord({
    eventType: "logout",
    path: "/auth/v1/login",
    method: "POST",
  });

  return { ok: true, message: "Sesión cerrada." };
}
