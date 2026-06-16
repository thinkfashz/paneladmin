"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  ArrowRight,
  Calendar,
  Download,
  Edit2,
  ExternalLink,
  FileJson,
  FileText,
  Globe,
  Mail,
  MoreHorizontal,
  Palette,
  Paperclip,
  Phone,
  Plus,
  Rocket,
  Share2,
  Sparkles,
  Tag,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { importProspectsAction } from "../actions/import-prospects";
import type { CrmProspect } from "../types-prospect";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SF";
}

function safeUrl(value?: string | null) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return null;
}

function getInstagramUrl(prospect: CrmProspect) {
  const direct = prospect.socialNetworks.instagram || prospect.socialNetworks.Instagram;
  return safeUrl(direct) || safeUrl(prospect.website);
}

function buildDefaultMessage(prospect: CrmProspect) {
  const project = prospect.projectName || "una demo comercial";
  const link = prospect.landingUrl || "el link de la demo";

  return `Hola, estuve revisando ${prospect.brandName} y preparé ${project}. La idea es mostrar una propuesta más clara, con información ordenada, acceso rápido y una página que puedan compartir con clientes. Te dejo el link: ${link}`;
}

function whatsappHref(prospect: CrmProspect, message: string) {
  const phone = String(prospect.phone || "").replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(message);

  if (phone.length >= 8) return `https://wa.me/${phone}?text=${encoded}`;
  return `https://wa.me/?text=${encoded}`;
}

export function ProspectCrmPanel({
  prospects,
  selectedProspectId,
}: {
  prospects: CrmProspect[];
  selectedProspectId?: string | null;
}) {
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const htmlInputRef = useRef<HTMLInputElement | null>(null);
  const [payload, setPayload] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [htmlFileName, setHtmlFileName] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(
    selectedProspectId || prospects[0]?.id || null,
  );

  const activeProspect = useMemo(
    () => prospects.find((item) => item.id === activeId) || prospects[0] || null,
    [prospects, activeId],
  );

  const [message, setMessage] = useState("");

  const currentMessage = useMemo(() => {
    if (!activeProspect) return "";
    return message || buildDefaultMessage(activeProspect);
  }, [activeProspect, message]);

  async function handleJsonImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isJson =
      file.type === "application/json" ||
      file.name.toLowerCase().endsWith(".json");

    if (!isJson) {
      alert("Selecciona un archivo .json válido");
      event.target.value = "";
      return;
    }

    const content = await file.text();

    try {
      JSON.parse(content);
    } catch {
      alert("El archivo no tiene JSON válido");
      event.target.value = "";
      return;
    }

    setPayload(content);
    setFileName(file.name);
  }

  function handleHtmlImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isHtml =
      file.type === "text/html" ||
      file.name.toLowerCase().endsWith(".html") ||
      file.name.toLowerCase().endsWith(".htm");

    if (!isHtml) {
      alert("Selecciona un archivo .html válido");
      event.target.value = "";
      return;
    }

    setHtmlFileName(file.name);
  }

  function selectProspect(id: string) {
    setActiveId(id);
    setMessage("");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <div className="rounded-3xl border bg-background p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              CRM Prospectos
            </p>
            <h2 className="mt-1 flex items-center gap-2 font-bold text-xl">
              <Users className="size-5" />
              Importar JSON
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Carga prospectos, toca una card y abre el detalle operativo.
            </p>
          </div>

          <Badge variant="outline">{prospects.length} leads</Badge>
        </div>

        <form action={importProspectsAction} className="mt-4 space-y-3">
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleJsonImport}
          />

          <input type="hidden" name="payload" value={payload} />

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => jsonInputRef.current?.click()}
            >
              <FileJson className="size-4" />
              Importar JSON
            </Button>

            <Button type="submit" disabled={!payload} className="gap-2">
              <Sparkles className="size-4" />
              Guardar prospectos
            </Button>
          </div>

          {fileName && (
            <div className="rounded-2xl border bg-muted/40 p-3 text-sm">
              JSON listo: <span className="font-medium">{fileName}</span>
            </div>
          )}
        </form>

        <div className="mt-5 max-h-[640px] space-y-2 overflow-y-auto pr-1">
          {prospects.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-5 text-muted-foreground text-sm">
              Todavía no hay prospectos. Importa un JSON para empezar.
            </div>
          ) : (
            prospects.map((prospect) => (
              <button
                key={prospect.id}
                type="button"
                onClick={() => selectProspect(prospect.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  activeProspect?.id === prospect.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{prospect.brandName}</p>
                    <p className="line-clamp-2 text-muted-foreground text-xs">
                      {prospect.projectName || "Proyecto sin nombre"} · {prospect.followers || "Sin seguidores"}
                    </p>
                  </div>

                  {prospect.landingToken ? (
                    <Badge variant="secondary">Landing</Badge>
                  ) : (
                    <Badge variant="outline">Nuevo</Badge>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {!activeProspect ? (
        <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-dashed text-muted-foreground">
          Selecciona un prospecto
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border bg-neutral-950 text-white shadow-2xl shadow-black/40">
          <div className="border-b border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-sm text-white/55">
                CRM Prospectos <span className="mx-2">/</span> {activeProspect.projectName || "Proyecto comercial"}
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-xl p-2 text-white/70 hover:bg-white/10" type="button" aria-label="Compartir">
                  <Share2 className="size-4" />
                </button>
                <button className="rounded-xl p-2 text-white/70 hover:bg-white/10" type="button" aria-label="Editar">
                  <Edit2 className="size-4" />
                </button>
                <button className="rounded-xl p-2 text-white/70 hover:bg-white/10" type="button" aria-label="Cerrar">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-5 md:p-8">
            <div className="grid gap-5 md:grid-cols-[96px_minmax(0,1fr)] md:items-start">
              <div
                className="flex size-24 items-center justify-center rounded-[2rem] border border-white/10 text-3xl font-black tracking-[-.08em] shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${activeProspect.colorPalette[0] || "#111827"}, ${activeProspect.colorPalette[1] || "#f97316"})`,
                }}
              >
                {initials(activeProspect.brandName)}
              </div>

              <div>
                <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {activeProspect.brandName}
                </h3>
                <p className="mt-3 max-w-3xl text-white/70">
                  {activeProspect.notes || "Sin descripción todavía. Adjunta HTML, revisa datos y crea una demo para compartir con el cliente."}
                </p>
              </div>
            </div>

            <div className="grid gap-5 text-sm md:grid-cols-2 lg:grid-cols-3">
              <MetaBlock
                icon={<MoreHorizontal className="size-5" />}
                label="Status"
                value={activeProspect.landingToken ? "Demo creada" : "En prospección"}
                badge={activeProspect.landingToken ? "Completed" : "In Progress"}
              />
              <MetaBlock
                icon={<Users className="size-5" />}
                label="Seguidores"
                value={activeProspect.followers || "Sin dato"}
              />
              <MetaBlock
                icon={<Calendar className="size-5" />}
                label="Fecha"
                value="Hoy"
                suffix={<ArrowRight className="size-4 text-white/40" />}
              />
              <MetaBlock
                icon={<Tag className="size-5" />}
                label="Tags"
                value={activeProspect.projectName || "Prospecto"}
                badge="Client Work"
              />
              <MetaBlock
                icon={<Phone className="size-5" />}
                label="Número"
                value={activeProspect.phone || "Sin dato"}
              />
              <MetaBlock
                icon={<Mail className="size-5" />}
                label="Correo"
                value={activeProspect.email || "Sin dato"}
              />
              <MetaBlock
                icon={<Globe className="size-5" />}
                label="Sitio web"
                value={activeProspect.website || getInstagramUrl(activeProspect) || "Sin dato"}
                wide
              />
              <MetaBlock
                icon={<FileText className="size-5" />}
                label="Descripción"
                value={activeProspect.notes || activeProspect.projectName || "Prospecto importado desde JSON."}
                wide
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Paperclip className="size-5 text-white/55" />
                  Adjuntos <Badge variant="secondary">2</Badge>
                </h4>
                <button type="button" className="inline-flex items-center gap-2 text-primary text-sm">
                  <Download className="size-4" />
                  Descargar todo
                </button>
              </div>

              <input
                ref={htmlInputRef}
                type="file"
                accept=".html,.htm,text/html"
                className="hidden"
                onChange={handleHtmlImport}
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AttachmentCard
                  icon={<FileJson className="size-6 text-red-400" />}
                  name="prospecto.json"
                  detail="Datos importados al CRM"
                />
                <AttachmentCard
                  icon={<FileText className="size-6 text-blue-400" />}
                  name={htmlFileName || "landing-demo.html"}
                  detail={htmlFileName ? "HTML listo para usar" : "Adjunta o crea el HTML abajo"}
                />
                <button
                  type="button"
                  onClick={() => htmlInputRef.current?.click()}
                  className="flex min-h-[72px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 text-white/55 transition hover:bg-white/10"
                >
                  <Plus className="size-6" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Share2 className="size-4" />
                  Accesos directos
                </h4>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <a
                    href={whatsappHref(activeProspect, currentMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-emerald-950"
                  >
                    WhatsApp
                    <ExternalLink className="size-4" />
                  </a>
                  {getInstagramUrl(activeProspect) ? (
                    <a
                      href={getInstagramUrl(activeProspect) || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-semibold text-white"
                    >
                      Instagram
                      <ExternalLink className="size-4" />
                    </a>
                  ) : (
                    <div className="rounded-xl border border-white/10 px-4 py-3 text-center text-white/35">
                      Sin Instagram
                    </div>
                  )}
                  {activeProspect.landingUrl ? (
                    <a
                      href={activeProspect.landingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-semibold text-white sm:col-span-2"
                    >
                      Abrir link generado
                      <ExternalLink className="size-4" />
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Palette className="size-4" />
                  Paleta de colores
                </h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeProspect.colorPalette.length === 0 ? (
                    <p className="text-white/50 text-sm">Sin paleta registrada.</p>
                  ) : (
                    activeProspect.colorPalette.map((color) => (
                      <div key={color} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                        <span className="size-5 rounded-full border border-white/30" style={{ background: color }} />
                        <span className="font-mono text-white/80">{color}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="font-semibold">Mensaje sugerido editable</h4>
                  <p className="text-white/55 text-sm">Edita el texto antes de abrir WhatsApp o Instagram.</p>
                </div>
                <Link
                  href={`/admin/landing-builder?prospect=${activeProspect.id}#create-demo`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-neutral-950"
                >
                  <Rocket className="size-4" />
                  Crear página
                </Link>
              </div>
              <Textarea
                value={currentMessage}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-4 min-h-[150px] border-white/10 bg-neutral-900 text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MetaBlock({
  icon,
  label,
  value,
  badge,
  suffix,
  wide,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  suffix?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${wide ? "md:col-span-2" : ""}`}>
      <div className="mt-0.5 text-white/45">{icon}</div>
      <div className="min-w-0">
        <p className="text-white/45">{label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {badge ? (
            <Badge variant="outline" className="border-white/10 bg-white/10 text-white">
              {badge}
            </Badge>
          ) : null}
          <p className="break-words font-medium text-white/85">{value}</p>
          {suffix}
        </div>
      </div>
    </div>
  );
}

function AttachmentCard({
  icon,
  name,
  detail,
}: {
  icon: React.ReactNode;
  name: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      {icon}
      <div className="min-w-0">
        <p className="truncate font-medium text-sm text-white">{name}</p>
        <p className="text-white/45 text-xs">{detail}</p>
      </div>
    </div>
  );
}
