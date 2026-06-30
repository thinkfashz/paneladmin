import { Suspense } from "react";

import OmnifixCheckoutApp from "@/components/OmnifixCheckoutApp";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <OmnifixCheckoutApp />
    </Suspense>
  );
}
