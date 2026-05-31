"use server";

import { cookies } from "next/headers";

export async function getSidebarState(): Promise<boolean> {
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");

  if (!sidebarCookie) {
    return true;
  }

  return sidebarCookie.value === "true";
}
