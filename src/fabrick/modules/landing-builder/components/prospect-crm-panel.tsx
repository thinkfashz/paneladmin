"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  ChevronDown,
  Copy,
  ExternalLink,
  FileJson,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Palette,
  Rocket,
  Search,
  Upload,
  Users,
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
  return `https://${value}`;
}

function buildMessage(prospect: CrmProspect | null) {
  if (!prospect) return "";
  return `Hola ${prospect.brandName}, vi su marca y preparé una demo comercial personalizada. La idea es mostrar cómo podrían ordenar sus servicios, captar clientes y recibir consultas por WhatsApp con un link más profesional. ¿Te puedo compartir la demo?`;
}

export function ProspectCrmPanel({
  prospects,
  selectedProspectId,
}: {
  prospects: CrmProspect[];
  selectedProspectId?: string | null;
}) {
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const [payload, setPayload] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(selectedProspectId || prospects[0]?.id || null);

  const activeProspect = useMemo(
    () => prospects.find((item) => item.id === activeId) || prospects[0] || null,
    [prospects, activeId],
  );

  const [messageDraft, setMessageDraft] = useState(() => buildMessage(activeProspect));

  const socialEntries = useMemo(
    () => Object.entries(activeProspect?.socialNetworks || {}).filter(([, value]) => Boolean(value)),
    [activeProspect],
  );

  const instagramUrl = socialEntries.find(([key]) => key.toLowerCase().includes("instagram"))?.[1];
  const websiteUrl = safeUrl(activeProspect?.website || instagramUrl || null);
  const whatsappHref = activeProspect
    ? `https://wa.me/${(activeProspect.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(messageDraft)}`
    : "#";

  function selectProspect(id: string) {
    const prospect = prospects.find((item) => item.id === id) || null;
    setActiveId(id);
    setMessageDraft(buildMessage(prospect));
  }

  async function handleJsonImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isJson = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
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

  async function copyMessage() {
    await navigator.clipboard.writeText(messageDraft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  if (!activeProspect) {
    return (
      <section className="rounded-[2rem] border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">Prospectos</p>
        <h2 className="mt-1 font-bold text-2xl tracking-tight">Sube tu base JSON</h2>
        <ImportJsonForm inputRef={jsonInputRef} payload={payload} fileName={fileName} onFile={handleJsonImport} />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">Prospecto seleccionado</p>
            <div className="mt-2 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
              <label className="relative block">
                <Users className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={activeProspect.id}
                  onChange={(event) => selectProspect(event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border bg-background px-11 pr-12 font-semibold outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {prospects.map((prospect) => (
                    <option key={prospect.id} value={prospect.id}>{prospect.brandName}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </label>
              <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 font-medium text-sm">
                <Search className="size-4" /> Cambiar
              </button>
            </div>
          </div>

          <ImportJsonForm inputRef={jsonInputRef} payload={payload} fileName={fileName} onFile={handleJsonImport} compact />
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border bg-background shadow-sm">
        <div className="rounded-b-[2rem] bg-neutral-950 p-5 text-white md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-xl font-black shadow-xl"
                style={{ background: `linear-gradient(135deg, ${activeProspect.colorPalette[0] || "#1e3a8a"}, ${activeProspect.colorPalette[1] || "#111827"})` }}
              >
                {initials(activeProspect.brandName)}
              </div>
              <div>
                <h3 className="font-bold text-3xl tracking-tight">{activeProspect.brandName}</h3>
                <p className="mt-2 max-w-3xl text-white/70">{activeProspect.notes || activeProspect.projectName || "Demo comercial personalizada lista para convertir este prospecto en cliente."}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-yellow-500/40 bg-yellow-500/15 text-yellow-300">En prospección</Badge>
                  <Badge variant="secondary">Prospecto</Badge>
                  <Badge variant="secondary">Demo</Badge>
                </div>
              </div>
            </div>

            <Link href={`/admin/landing-builder?prospect=${activeProspect.id}#landing-demo-builder`} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-neutral-950 text-sm">
              <Rocket className="size-4" /> Crear demo
            </Link>
          </div>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-[160px_minmax(0,1fr)] md:p-5">
          <div
            className="flex min-h-32 items-center justify-center rounded-3xl text-4xl font-black text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${activeProspect.colorPalette[0] || "#1d4ed8"}, ${activeProspect.colorPalette[1] || "#111827"})` }}
          >
            {initials(activeProspect.brandName)}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Info label="Tipo de negocio" value={activeProspect.projectName || "Negocio local"} />
            <Info label="Seguidores" value={activeProspect.followers || "Sin dato"} />
            <Info label="Sitio web" value={activeProspect.website || instagramUrl || "Sin dato"} />
            <Info label="Red principal" value={instagramUrl ? "Instagram" : "Sin dato"} />
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-xs">Paleta de marca</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeProspect.colorPalette.length === 0 ? (
                  <span className="text-muted-foreground text-sm">Sin paleta registrada</span>
                ) : (
                  activeProspect.colorPalette.map((color) => <span key={color} className="size-8 rounded-xl border" style={{ background: color }} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border bg-background p-4 shadow-sm">
          <h4 className="flex items-center gap-2 font-bold"><Globe className="size-4" /> Accesos rápidos</h4>
          <div className="mt-3 grid gap-2">
            <ContactLink href={activeProspect.phone ? whatsappHref : null} label="WhatsApp" icon={<MessageCircle className="size-4" />} />
            <ContactLink href={safeUrl(instagramUrl)} label="Instagram" icon={<Instagram className="size-4" />} />
            <ContactLink href={websiteUrl} label="Sitio web" icon={<Globe className="size-4" />} />
            <ContactLink href={activeProspect.email ? `mailto:${activeProspect.email}` : null} label="Correo" icon={<Mail className="size-4" />} />
          </div>
        </div>

        <div className="rounded-[2rem] border bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-bold">Mensaje sugerido editable</h4>
            <button type="button" onClick={copyMessage} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
              <Copy className="size-4" /> {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <Textarea value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} className="mt-3 min-h-32 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

function ImportJsonForm({
  inputRef,
  payload,
  fileName,
  onFile,
  compact,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  payload: string;
  fileName: string | null;
  onFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}) {
  return (
    <form action={importProspectsAction} className={compact ? "space-y-2" : "mt-4 space-y-3"}>
      <input ref={inputRef} type="file" accept=".json,application/json" className="hidden" onChange={onFile} />
      <input type="hidden" name="payload" value={payload} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" className="gap-2 rounded-xl" onClick={() => inputRef.current?.click()}>
          <FileJson className="size-4" /> Subir base JSON
        </Button>
        <Button type="submit" disabled={!payload} className="gap-2 rounded-xl">
          <Upload className="size-4" /> Guardar base
        </Button>
      </div>
      {fileName && <p className="text-muted-foreground text-xs">Archivo listo: <span className="font-medium text-foreground">{fileName}</span></p>}
    </form>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 truncate font-semibold text-sm">{value}</p>
    </div>
  );
}

function ContactLink({ href, label, icon }: { href: string | null; label: string; icon: React.ReactNode }) {
  if (!href) {
    return <div className="flex items-center justify-between rounded-2xl border bg-muted/30 px-3 py-2 text-muted-foreground text-sm"><span className="inline-flex items-center gap-2">{icon}{label}</span><span>Sin dato</span></div>;
  }

  return (
    <Link href={href} target="_blank" className="flex items-center justify-between rounded-2xl border bg-background px-3 py-2 text-sm hover:bg-muted/40">
      <span className="inline-flex items-center gap-2">{icon}{label}</span>
      <ExternalLink className="size-4 text-muted-foreground" />
    </Link>
  );
}
