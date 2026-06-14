import type { LucideIcon } from "lucide-react";

import { moduleNav as app_shellNav } from "./app-shell/nav";
import { moduleNav as admin_hubNav } from "./admin-hub/nav";
import { moduleNav as database_statusNav } from "./database-status/nav";
import { moduleNav as dashboard_defaultNav } from "./dashboard-default/nav";
import { moduleNav as dashboard_crmNav } from "./dashboard-crm/nav";
import { moduleNav as dashboard_financeNav } from "./dashboard-finance/nav";
import { moduleNav as dashboard_analyticsNav } from "./dashboard-analytics/nav";
import { moduleNav as dashboard_productivityNav } from "./dashboard-productivity/nav";
import { moduleNav as dashboard_ecommerceNav } from "./dashboard-ecommerce/nav";
import { moduleNav as dashboard_academyNav } from "./dashboard-academy/nav";
import { moduleNav as dashboard_logisticsNav } from "./dashboard-logistics/nav";
import { moduleNav as emailNav } from "./email/nav";
import { moduleNav as chatNav } from "./chat/nav";
import { moduleNav as calendarNav } from "./calendar/nav";
import { moduleNav as kanbanNav } from "./kanban/nav";
import { moduleNav as invoiceNav } from "./invoice/nav";
import { moduleNav as usersNav } from "./users/nav";
import { moduleNav as rolesNav } from "./roles/nav";
import { moduleNav as authenticationNav } from "./authentication/nav";
import { moduleNav as crmNav } from "./crm/nav";
import { moduleNav as customersNav } from "./customers/nav";
import { moduleNav as accounting_f29Nav } from "./accounting-f29/nav";
import { moduleNav as designNav } from "./design/nav";
import { moduleNav as analyticsNav } from "./analytics/nav";
import { moduleNav as quotesNav } from "./quotes/nav";
import { moduleNav as landing_builderNav } from "./landing-builder/nav";
import { moduleNav as templatesNav } from "./templates/nav";
import { moduleNav as generated_pagesNav } from "./generated-pages/nav";
import { moduleNav as public_token_pagesNav } from "./public-token-pages/nav";
import { moduleNav as page_analyticsNav } from "./page-analytics/nav";
import { moduleNav as business_settingsNav } from "./business-settings/nav";
import { moduleNav as integrationsNav } from "./integrations/nav";
import { moduleNav as ecommerceNav } from "./ecommerce/nav";
import { moduleNav as checkoutNav } from "./checkout/nav";
import { moduleNav as othersNav } from "./others/nav";

export type FabrickModuleNav = {
  id: string;
  title: string;
  href: string | null;
  description: string;
  group: string;
  status: string;
  icon: LucideIcon;
};

export const fabrickModules: FabrickModuleNav[] = [
  app_shellNav,
  admin_hubNav,
  database_statusNav,
  dashboard_defaultNav,
  dashboard_crmNav,
  dashboard_financeNav,
  dashboard_analyticsNav,
  dashboard_productivityNav,
  dashboard_ecommerceNav,
  dashboard_academyNav,
  dashboard_logisticsNav,
  emailNav,
  chatNav,
  calendarNav,
  kanbanNav,
  invoiceNav,
  usersNav,
  rolesNav,
  authenticationNav,
  crmNav,
  customersNav,
  accounting_f29Nav,
  designNav,
  analyticsNav,
  quotesNav,
  landing_builderNav,
  templatesNav,
  generated_pagesNav,
  public_token_pagesNav,
  page_analyticsNav,
  business_settingsNav,
  integrationsNav,
  ecommerceNav,
  checkoutNav,
  othersNav,
];

export const fabrickSidebarModules = fabrickModules.filter((module) => Boolean(module.href));

export const fabrickModuleGroups = [
  {
    title: "Core",
    items: fabrickSidebarModules.filter((module) => module.group === "core"),
  },
  {
    title: "Dashboards",
    items: fabrickSidebarModules.filter((module) => module.group === "dashboards"),
  },
  {
    title: "Pages",
    items: fabrickSidebarModules.filter((module) => module.group === "pages"),
  },
  {
    title: "Negocio",
    items: fabrickSidebarModules.filter((module) => module.group === "business"),
  },
  {
    title: "Finanzas y Analytics",
    items: fabrickSidebarModules.filter((module) => ["finance", "analytics"].includes(module.group)),
  },
  {
    title: "Growth",
    items: fabrickSidebarModules.filter((module) => module.group === "growth"),
  },
  {
    title: "Commerce",
    items: fabrickSidebarModules.filter((module) => module.group === "commerce"),
  },
  {
    title: "Settings",
    items: fabrickSidebarModules.filter((module) => module.group === "settings"),
  },
  {
    title: "Misc",
    items: fabrickSidebarModules.filter((module) => module.group === "misc"),
  },
];

export function getFabrickModuleById(id: string) {
  return fabrickModules.find((module) => module.id === id);
}

export function getFabrickModuleByHref(href: string) {
  return fabrickSidebarModules.find((module) => module.href === href);
}
