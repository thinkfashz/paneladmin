import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user-auth";
import { BusinessSettings } from "./_components/business-settings";

export default async function ConfiguracionPage() {
  await requireBusinessUserAuth();

  return <BusinessSettings />;
}
