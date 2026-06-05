import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user-auth";
import { QuoteList } from "./_components/quote-list";

export default async function CotizacionesPage() {
  await requireBusinessUserAuth();

  return <QuoteList />;
}
