import type { ReactNode } from "react";

import { AdminNav } from "./_components/admin-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      {children}
    </div>
  );
}
