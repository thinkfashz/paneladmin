"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  ArrowRight,
  Calendar,
  Copy,
  Download,
  Edit2,
  ExternalLink,
  FileJson,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Paperclip,
  Phone,
  Plus,
  Rocket,
  Share2,
  Tag,
  Upload,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { importProspectsAction } from "../actions/import-prospects";
import type { CrmProspect } from "../types-prospect";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SF";
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

function getSocialEntries(prospect: CrmProspect | null) {
  if (!prospect) return [] as Array<[string, string]>;
  return Object.entries(prospect.socialNetworks || {}).filter(([, value]) => Boolean(value));
}

export function ProspectCrmPanel({ prospects, selectedProspectId }: { prospects: CrmProspect[]; selectedProspectId?: string | null }) {
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const htmlAttachRef = useRef<HTMLInputElement | null>(null);
  const jsonAttachRef = useRef<HTMLInputElement | null>(null);
  const [payload, setPayload] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [attachedHtml, setAttachedHtml] = useState<string | null>(null);
  const [attachedJson, setAttachedJson] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(selectedProspectId || prospects[0]?.id || null);

  const activeProspect = useMemo(() => prospects.find((item) => item.id === activeId) || prospects[0] || null, [prospects, activeId]);
  const [messageDraft, setMessageDraft] = useState(() => buildMessage(activeProspect));
  const socialEntries = useMemo(() => getSocialEntries(activeProspect), [activeProspect]);

  function selectProspect(prospect: CrmProspect) {
    setActiveId(prospect.id);
    setMessageDraft(buildMessage(prospect));
    setAttachedHtml(null);
    setAttachedJson(null);
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

  async function handleAttachment(event: React.ChangeEvent<HTMLInputElement>, type: "html" | "json") {
    const file = event.target.files?.[0];
    if (!file) return;
    if (type === "html") setAttachedHtml(file.name);
    if (type === "json") setAttachedJson(file.name);
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(messageDraft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const instagramUrl = socialEntries.find(([key]) => key.toLowerCase().includes("instagram"))?.[1];
  const whatsappHref = activeProspect ? `https://wa.me/${(activeProspect.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(messageDraft)}` : "#";
  const websiteUrl = safeUrl(activeProspect?.website || instagramUrl || null);

  return (
    <section className="grid gap-6 xl:grid-cols-[410px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] border bg-background p-4 shadow-sm xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">CRM Prospectos</p>
            <h2 className="mt-1 flex items-center gap-2 font-bold text-2xl tracking-tight"><Users className="size-5" />Importar JSON</h2>
            <p className="mt-2 text-muted-foreground text-sm">Importa, selecciona y abre cada prospecto como ficha de proyecto.</p>
          </div>
          <Badge variant="outline">{prospects.length}</Badge>
        </div>

        <form action={importProspectsAction} className="mt-4 space-y-3">
          <input ref={jsonInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleJsonImport} />
          <input type="hidden" name="payload" value={payload} />
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" className="gap-2" onClick={() => jsonInputRef.current?.click()}><FileJson className="size-4" />Importar</Button>
            <Button type="submit" disabled={!payload} className="gap-2"><Upload className="size-4" />Guardar</Button>
          </div>
          {fileName && <div className="rounded-2xl border bg-muted/40 p-3 text-sm">JSON listo: <span className="font-medium">{fileName}</span></div>}
        </form>

        <div className="mt-5 space-y-2">
          {prospects.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-5 text-muted-foreground text-sm">Todavía no hay prospectos. Importa un JSON para empezar.</div>
          ) : (
            prospects.map((prospect) => (
              <button key={prospect.id} type="button" onClick={() => selectProspect(prospect)} className={`w-full rounded-2xl border p-3 text-left transition ${activeProspect?.id === prospect.id ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{prospect.brandName}</p>
                    <p className="line-clamp-2 text-muted-foreground text-xs">{prospect.projectName || "Proyecto sin nombre"} · {prospect.followers || "Sin seguidores"}</p>
                  </div>
                  {prospect.landingToken ? <Badge variant="secondary">Demo</Badge> : <Badge variant="outline">Nuevo</Badge>}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="rounded-[2rem] border bg-neutral-950 p-0 text-white shadow-2xl shadow-black/30">
        {!activeProspect ? (
          <div className="flex min-h-[560px] items-center justify-center rounded-[2rem] border border-dashed border-white/10 text-white/60">Selecciona un prospecto</div>
        ) : (
          <div className="overflow-hidden rounded-[2rem]">
            <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="text-white/55 text-xs">Cliente potencial / {activeProspect.projectName || "Demo comercial"}</div>
              <div className="flex items-center gap-1"><IconAction label="Compartir" icon={<Share2 className="size-4" />} /><IconAction label="Editar" icon={<Edit2 className="size-4" />} /><IconAction label="Cerrar" icon={<X className="size-4" />} /></div>
            </header>

            <div className="space-y-8 p-5 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-xl font-black shadow-xl" style={{ background: `linear-gradient(135deg, ${activeProspect.colorPalette[0] || "#f97316"}, ${activeProspect.colorPalette[1] || "#111827"})` }}>{initials(activeProspect.brandName)}</div>
                  <div><h3 className="font-bold text-3xl tracking-tight md:text-4xl">{activeProspect.brandName}</h3><p className="mt-2 max-w-3xl text-white/65">{activeProspect.notes || "Prospecto listo para crear una demo personalizada y enviar propuesta por WhatsApp o Instagram."}</p></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/landing-builder?prospect=${activeProspect.id}#landing-demo-builder`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 font-medium text-neutral-950 text-sm"><Rocket className="size-4" />Crear página</Link>
                  {activeProspect.landingUrl && <Link href={activeProspect.landingUrl} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-medium text-sm"><ExternalLink className="size-4" />Ver demo</Link>}
                </div>
              </div>

              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <MetaItem icon={<MoreHorizontal className="size-5" />} label="Status"><Badge variant="outline" className="border-yellow-500/40 bg-yellow-500/15 text-yellow-300">En prospección</Badge></MetaItem>
                <MetaItem icon={<Users className="size-5" />} label="Seguidores"><span>{activeProspect.followers || "Sin dato"}</span></MetaItem>
                <MetaItem icon={<Calendar className="size-5" />} label="Fecha"><span className="inline-flex items-center gap-2">Hoy <ArrowRight className="size-4 text-white/40" /> Próxima llamada</span></MetaItem>
                <MetaItem icon={<Tag className="size-5" />} label="Tags"><div className="flex flex-wrap gap-2"><Badge>Prospecto</Badge><Badge variant="secondary">Demo</Badge></div></MetaItem>
              </section>

              <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <Panel title="Descripción del proyecto" icon={<FileText className="size-5 text-white/55" />}><p className="text-white/70 leading-relaxed">Categoría: {activeProspect.projectName || "Proyecto comercial"}. Sitio web actual: {activeProspect.website || instagramUrl || "sin dato"}. La demo debe mostrar problema, solución, confianza visual, CTA y contacto directo.</p></Panel>
                <Panel title="Paleta de colores" icon={<Palette className="size-5 text-white/55" />}><div className="flex flex-wrap gap-2">{activeProspect.colorPalette.length === 0 ? <span className="text-white/55 text-sm">Sin paleta registrada</span> : activeProspect.colorPalette.map((color) => <span key={color} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm"><span className="size-5 rounded-full border border-white/30" style={{ background: color }} /><span className="font-mono text-white/75">{color}</span></span>)}</div></Panel>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3"><h4 className="flex items-center gap-2 font-semibold"><Paperclip className="size-5 text-white/55" />Adjuntos <Badge variant="secondary">2</Badge></h4><Button variant="ghost" size="sm" className="text-white/80 hover:text-white"><Download className="mr-2 size-4" />Descargar todo</Button></div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <AttachmentCard icon={<FileText className="size-6 text-red-400" />} title={attachedHtml || "Landing_Demo.html"} subtitle={attachedHtml ? "HTML adjunto" : "Importar HTML abajo"} />
                  <AttachmentCard icon={<FileJson className="size-6 text-emerald-400" />} title={attachedJson || "Prospecto_Data.json"} subtitle={attachedJson ? "JSON adjunto" : "Datos del prospecto"} />
                  <div className="grid gap-2 rounded-xl border-2 border-dashed border-white/10 p-3"><input ref={htmlAttachRef} type="file" accept=".html,.htm,text/html" className="hidden" onChange={(event) => handleAttachment(event, "html")} /><input ref={jsonAttachRef} type="file" accept=".json,application/json" className="hidden" onChange={(event) => handleAttachment(event, "json")} /><button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm" onClick={() => htmlAttachRef.current?.click()}><Plus className="size-4" />HTML</button><button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm" onClick={() => jsonAttachRef.current?.click()}><Plus className="size-4" />JSON</button></div>
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <Panel title="Accesos directos" icon={<Share2 className="size-5 text-white/55" />}><div className="grid gap-2"><ContactLink href={activeProspect.phone ? whatsappHref : null} label="WhatsApp" icon={<MessageCircle className="size-4" />} /><ContactLink href={safeUrl(instagramUrl)} label="Instagram" icon={<Share2 className="size-4" />} /><ContactLink href={websiteUrl} label="Sitio web" icon={<Globe className="size-4" />} /><ContactLink href={activeProspect.email ? `mailto:${activeProspect.email}` : null} label="Correo" icon={<Mail className="size-4" />} /><ContactLink href={activeProspect.phone ? `tel:${activeProspect.phone}` : null} label="Teléfono" icon={<Phone className="size-4" />} /></div></Panel>
                <Panel title="Mensaje sugerido editable" icon={<Copy className="size-5 text-white/55" />} action={<button type="button" onClick={copyMessage} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm"><Copy className="size-4" />{copied ? "Copiado" : "Copiar"}</button>}><Textarea value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} className="min-h-[150px] border-white/10 bg-neutral-900 text-white placeholder:text-white/40" /><div className="mt-3 flex flex-wrap gap-2"><Link href={whatsappHref} target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-medium text-emerald-950 text-sm"><MessageCircle className="size-4" />Enviar WhatsApp</Link>{safeUrl(instagramUrl) && <Link href={safeUrl(instagramUrl)!} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-medium text-sm"><Share2 className="size-4" />Ir a Instagram</Link>}</div></Panel>
              </section>

              <section className="space-y-3"><h4 className="font-semibold">Plan de trabajo</h4><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[640px] text-sm"><thead className="bg-white/[0.04] text-white/55"><tr><th className="px-4 py-3 text-left">No</th><th className="px-4 py-3 text-left">Tarea</th><th className="px-4 py-3 text-left">Categoría</th><th className="px-4 py-3 text-left">Estado</th><th className="px-4 py-3 text-right">Entrega</th></tr></thead><tbody><TaskRow id="1" task="Revisar marca, redes y problema comercial" category="Discovery" status="Completed" date="Hoy" /><TaskRow id="2" task="Adjuntar HTML y JSON del prospecto" category="Assets" status="In Progress" date="Hoy" /><TaskRow id="3" task="Crear demo y compartir link con mensaje editable" category="Demo" status="Pending" date="Próximo" /></tbody></table></div></section>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function IconAction({ label, icon }: { label: string; icon: React.ReactNode }) { return <button type="button" aria-label={label} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white">{icon}</button>; }
function MetaItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) { return <div className="flex items-start gap-3"><span className="mt-0.5 text-white/45">{icon}</span><div><p className="text-white/45 text-sm">{label}</p><div className="mt-1 font-medium text-white/90 text-sm">{children}</div></div></div>; }
function Panel({ title, icon, children, action }: { title: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><h4 className="mb-3 flex items-center justify-between gap-2 font-semibold"><span className="inline-flex items-center gap-2">{icon}{title}</span>{action}</h4>{children}</div>; }
function AttachmentCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) { return <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">{icon}<div className="min-w-0 flex-1"><p className="truncate font-medium text-sm">{title}</p><p className="text-white/45 text-xs">{subtitle}</p></div></div>; }
function ContactLink({ href, label, icon }: { href: string | null; label: string; icon: React.ReactNode }) { if (!href) return <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white/35 text-sm"><span className="inline-flex items-center gap-2">{icon}{label}</span><span>Sin dato</span></div>; return <Link href={href} target="_blank" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm hover:bg-white/[0.1]"><span className="inline-flex items-center gap-2">{icon}{label}</span><ExternalLink className="size-4 text-white/45" /></Link>; }
function TaskRow({ id, task, category, status, date }: { id: string; task: string; category: string; status: "Completed" | "In Progress" | "Pending"; date: string }) { const cls = status === "Completed" ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : status === "In Progress" ? "border-yellow-500/40 bg-yellow-500/15 text-yellow-300" : "border-white/10 bg-white/[0.04] text-white/55"; return <tr className="border-t border-white/10"><td className="px-4 py-3 text-white/45">{id}</td><td className="px-4 py-3 font-medium">{task}</td><td className="px-4 py-3 text-white/65">{category}</td><td className="px-4 py-3"><span className={`rounded-full border px-2 py-1 text-xs ${cls}`}>{status}</span></td><td className="px-4 py-3 text-right text-white/55">{date}</td></tr>; }
