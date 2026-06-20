export const dynamic = "force-dynamic";

export const metadata = {
  title: "E-commerce Omnifix | Admin",
  description: "Vitrina e-commerce embebida dentro del panel administrativo Fabrick.",
};

export default function AdminEcommercePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
      <section className="rounded-2xl border bg-background p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Módulo Fabrick</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">E-commerce Omnifix</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vitrina, carrito y checkout cargados dentro del admin para no perder la navegación principal.
        </p>
      </section>
      <section className="overflow-hidden rounded-[2rem] border bg-black shadow-2xl">
        <iframe
          title="Vitrina e-commerce Omnifix"
          src="/dashboard/e-commerce"
          className="h-[calc(100dvh-210px)] min-h-[720px] w-full border-0"
        />
      </section>
    </main>
  );
}
