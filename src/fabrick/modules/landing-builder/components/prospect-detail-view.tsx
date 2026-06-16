"use client";

import { ProspectCrmPanel } from "./prospect-crm-panel";
import type { CrmProspect } from "../types-prospect";

export function ProspectDetailView({ prospect }: { prospect: CrmProspect }) {
  return <ProspectCrmPanel prospects={[prospect]} selectedProspectId={prospect.id} />;
}
