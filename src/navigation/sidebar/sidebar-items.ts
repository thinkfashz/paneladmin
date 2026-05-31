import {
  Banknote,
  Calendar,
  ChartBar,
  Fingerprint,
  Forklift,
  Gauge,
  Inbox,
  Kanban,
  LayoutTemplate,
  Mail,
  Package,
  Settings,
  ShoppingBag,
  SquareTerminal,
  Users,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: NavItem[];
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const SIDEBAR_ITEMS: NavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/default",
        icon: Gauge,
        items: [
          { title: "Default", url: "/dashboard/default" },
          { title: "Analytics", url: "/dashboard/analytics" },
          { title: "E-Commerce", url: "/dashboard/ecommerce" },
        ],
      },
      {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
      },
      {
        title: "Mail",
        url: "/mail",
        icon: Mail,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
      },
      {
        title: "Kanban",
        url: "/kanban",
        icon: Kanban,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Products",
        url: "/products",
        icon: Package,
      },
      {
        title: "Orders",
        url: "/orders",
        icon: ShoppingBag,
      },
      {
        title: "Finance",
        url: "/finance",
        icon: Banknote,
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: Forklift,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
      {
        title: "Authentication",
        url: "/auth/v1/login",
        icon: Fingerprint,
      },
    ],
  },
  {
    label: "Components",
    items: [
      {
        title: "Analytics",
        url: "/components/analytics",
        icon: ChartBar,
      },
      {
        title: "UI Components",
        url: "/components/ui",
        icon: SquareTerminal,
      },
      {
        title: "Page Examples",
        url: "/components/pages",
        icon: LayoutTemplate,
      },
    ],
  },
];
