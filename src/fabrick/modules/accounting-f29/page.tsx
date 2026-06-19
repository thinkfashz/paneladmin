import { redirect } from "next/navigation";

import Link from "next/link";

import { AlertCircle, CalendarDays, ExternalLink, ShieldCheck } from "lucide-react";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { cn } from "@/lib/utils";

import { BeneficiosFiscales } from "./components/beneficios-fiscales";
import { CarpetaTributaria } from "./components/carpeta-tributaria";
import { DocumentosRequeridos } from "./components/documentos-requeridos";
import { F29Calculator } from "./components/f29-calculator";
import { SimuladorTributario } from "./components/simulador-tributario";

export const dynamic = "force-dynamic";

export default async function ContabilidadPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) {
    redirect("/auth/v1/login");
  }

  const now = new Date();
  const diaActual = now.getDate();
  const mesNombre = now.toLocaleString("es-CL", { month: "long", year: "numeric" });
  const diasRestantes = 12 - diaActual;
  const isUrgente = diaActual >= 8 && diaActual <= 11;
  const isVencido = diaActual > 12;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Módulo Tributario · SII Chile</p>
          <h1 className="font-bold text-2xl tracking-tight md:text-3xl">Dashboard Contable / F29</h1>
          <p className="max-w-xl text-muted-foreground text-sm">
            Declara tu F29, optimiza impuestos y accede a créditos y beneficios tributarios en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="https://homer.sii.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Portal SII
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="https://www.sii.cl/servicios_online/1039-.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
          >
            Declarar F29
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Banner de urgencia */}
      {(isUrgente || isVencido) && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border p-4",
            isVencido ? "border-red-500/30 bg-red-500/5" : "border-amber-500/30 bg-amber-500/5",
          )}
        >
          <AlertCircle
            className={cn("mt-0.5 h-5 w-5 shrink-0", isVencido ? "text-red-500" : "text-amber-500")}
          />
          <div>
            <p
              className={cn(
                "font-semibold text-sm",
                isVencido ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400",
              )}
            >
              {isVencido
                ? "⚠️ Plazo vencido — El F29 del período ya debió declararse"
                : `⏰ Quedan ${diasRestantes} día${diasRestantes === 1 ? "" : "s"} para declarar el F29`}
            </p>
            <p className={cn("text-xs", isVencido ? "text-red-600" : "text-amber-600")}>
              {isVencido
                ? "Declara a la brevedad para evitar multa del 10% + interés penal (Art. 97 N°11 CT)"
                : "El vencimiento es el día 12 de cada mes · Art. 97 N°11 Código Tributario"}
            </p>
          </div>
        </div>
      )}

      {/* Barra de stats rápidos */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <CalendarDays className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Período actual</p>
            <p className="font-bold capitalize">{mesNombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              isVencido ? "bg-red-500/10" : isUrgente ? "bg-amber-500/10" : "bg-green-500/10",
            )}
          >
            <AlertCircle
              className={cn(
                "h-5 w-5",
                isVencido ? "text-red-500" : isUrgente ? "text-amber-500" : "text-green-500",
              )}
            />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Vencimiento F29</p>
            <p className="font-bold">
              {isVencido
                ? "Vencido"
                : diasRestantes > 0
                  ? `Día 12 (−${diasRestantes}d)`
                  : "Hoy es el día 12"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-background p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Régimen tributario</p>
            <p className="font-bold">ProPyme / 14 Ter</p>
          </div>
        </div>
      </div>

      {/* Carpeta Tributaria */}
      <CarpetaTributaria />

      {/* Calculadora F29 */}
      <F29Calculator />

      {/* Simulador + Beneficios */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SimuladorTributario />
        <BeneficiosFiscales />
      </div>

      {/* Documentos */}
      <DocumentosRequeridos />
    </main>
  );
}
