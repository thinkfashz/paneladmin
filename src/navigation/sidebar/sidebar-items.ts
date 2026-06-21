import {
  Banknote,
  BookTemplate,
  Calendar,
  ChartBar,
  CreditCard,
  Database,
  FileStack,
  FileText,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  KeyRound,
  LayoutDashboard,
  Layers,
  LineChart,
  ListTodo,
  Lock,
  Paintbrush,
  Plug,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  Settings,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      { title: "Default", url: "/dashboard/default", icon: LayoutDashboard },
      { title: "CRM", url: "/dashboard/crm", icon: ChartBar },
      { title: "Finance", url: "/dashboard/finance", icon: Banknote },
      { title: "Analytics", url: "/dashboard/analytics", icon: Gauge },
      { title: "Productivity", url: "/dashboard/productivity", icon: ListTodo },
      { title: "E-commerce", url: "/dashboard/e-commerce", icon: ShoppingBag },
      { title: "Academy", url: "/dashboard/academy", icon: GraduationCap, isNew: true },
      { title: "Logistics", url: "/dashboard/logistics", icon: Forklift },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      { title: "Email", url: "/email", icon: Mail },
      { title: "Chat", url: "/chat", icon: MessageSquare },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Kanban", url: "/kanban", icon: Kanban },
      { title: "Invoice", url: "/invoice", icon: ReceiptText },
      { title: "Users", url: "/users", icon: Users },
      { title: "Roles", url: "/roles", icon: Lock },
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Módulos Omnifix",
    items: [
      {
        title: "Page Engine",
        url: "/dashboard/page-engine",
        icon: Layers,
        subItems: [
          { title: "Landing Builder", url: "/dashboard/page-engine", icon: Layers },
          { title: "Plantillas HTML", url: "/admin/templates", icon: BookTemplate },
          { title: "Páginas Generadas", url: "/admin/generated-pages", icon: FileStack },
          { title: "Páginas por Token", url: "/admin/public-token-pages", icon: KeyRound },
          { title: "Estadísticas Páginas", url: "/admin/page-analytics", icon: LineChart },
        ],
      },
      {
        title: "Vitrina Omnifix",
        url: "/dashboard/e-commerce",
        icon: ShoppingBag,
        subItems: [
          { title: "Tienda", url: "/dashboard/e-commerce", icon: ShoppingBag },
          { title: "Checkout", url: "/dashboard/e-commerce#checkout", icon: CreditCard },
        ],
      },
      { title: "CRM Omnifix", url: "/admin/crm", icon: ChartBar },
      { title: "Clientes Omnifix", url: "/admin/customers", icon: Users },
      { title: "Productos Omnifix", url: "/admin/productos", icon: ShoppingBag },
      { title: "Cotizaciones", url: "/admin/cotizaciones", icon: FileText },
      { title: "F29 / SII", url: "/admin/contabilidad", icon: Banknote },
      { title: "Estado DB", url: "/admin/database-status", icon: Database },
      { title: "Diseño de marca", url: "/admin/diseno", icon: Paintbrush },
      {
        title: "Configuración",
        url: "/admin/configuracion",
        icon: Settings,
        subItems: [
          { title: "Negocio", url: "/admin/configuracion", icon: Settings },
          { title: "Integraciones", url: "/admin/integrations", icon: Plug },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Legacy",
    items: [
      {
        title: "Dashboards",
        url: "/dashboard/default-v1",
        subItems: [
          { title: "Default V1", url: "/dashboard/default-v1" },
          { title: "CRM V1", url: "/dashboard/crm-v1" },
          { title: "Finance V1", url: "/dashboard/finance-v1" },
          { title: "Analytics V1", url: "/dashboard/analytics-v1" },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Misc",
    items: [
      {
        title: "Others",
        url: "/others",
        icon: SquareArrowUpRight,
      },
    ],
  },
];
