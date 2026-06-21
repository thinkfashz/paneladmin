import EcommerceModulePage from "@/fabrick/modules/e-commerce/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "E-commerce Omnifix | Admin",
  description: "Vitrina e-commerce Omnifix con catálogo, carrito y checkout dentro del panel operativo.",
};

export default function AdminEcommercePage() {
  return <EcommerceModulePage />;
}
