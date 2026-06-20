import EcommerceModulePage from "@/fabrick/modules/e-commerce/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "E-commerce Omnifix | Admin",
  description: "Vitrina e-commerce embebida dentro del panel administrativo Fabrick.",
};

export default function AdminEcommercePage() {
  return <EcommerceModulePage />;
}
