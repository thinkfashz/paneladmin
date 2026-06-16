"use client";

import * as React from "react";
import Link from "next/link";

import {
  ArrowRight,
  Calendar,
  Code2,
  Download,
  Edit2,
  ExternalLink,
  FileCode2,
  FileJson,
  FileText,
  Globe,
  Instagram,
  Mail,
  MoreHorizontal,
  Paperclip,
  Palette,
  Phone,
  Plus,
  Rocket,
  Share2,
  Tag,
  Users,
  X,
} from "lucide-react";

import type { CrmProspect } from "../types-prospect";
import styles from "./prospect-detail-view.module.css";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SF";
}

function cleanPhone(phone: string | null) {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}

function getInstagram(prospect: CrmProspect) {
  const entries = Object.entries(prospect.socialNetworks || {});
  const instagram = entries.find(([key, value]) => {
    const text = `${key} ${value}`.toLowerCase();
    return text.includes("instagram") || text.includes("instagr.am");
  });

  if (instagram?.[1]) return instagram[1];
  if (prospect.website?.includes("instagram.com")) return prospect.website;
  return "";
}

function buildMessage(prospect: CrmProspect) {
  const landing = prospect.landingUrl || "";
  const project = prospect.projectName || "una demo comercial";

  return `Hola ${prospect.brandName}, vi su marca y preparé una propuesta visual para ${project}. Me gustaría mostrarles una demo rápida con una página pensada para captar más clientes, ordenar consultas y llevarlos a WhatsApp/Instagram con un flujo más profesional.${landing ? `\n\nLink demo: ${landing}` : ""}`;
}

function statusLabel(prospect: CrmProspect) {
  return prospect.landingToken ? "Demo generada" : "En preparación";
}

export function ProspectDetailView({ prospect }: { prospect: CrmProspect }) {
  const [htmlFileName, setHtmlFileName] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState(() => buildMessage(prospect));

  React.useEffect(() => {
    setMessage(buildMessage(prospect));
    setHtmlFileName(null);
  }, [prospect]);

  const phone = cleanPhone(prospect.phone);
  const whatsappHref = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  const instagramHref = getInstagram(prospect);
  const jsonPayload = JSON.stringify(prospect, null, 2);
  const jsonHref = `data:application/json;charset=utf-8,${encodeURIComponent(jsonPayload)}`;
  const tags = [
    prospect.projectName || "Prospecto comercial",
    prospect.followers ? `${prospect.followers} seguidores` : "Sin seguidores",
    prospect.landingToken ? "Landing guardada" : "Sin landing",
  ];

  async function handleHtmlAttachment(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const isHtml = file.name.toLowerCase().endsWith(".html") || file.name.toLowerCase().endsWith(".htm");

    if (!isHtml) {
      alert("Adjunta un archivo .html o .htm");
      event.target.value = "";
      return;
    }

    setHtmlFileName(file.name);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      alert(message);
    }
  }

  return (
    <article className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.breadcrumbs}>
          <span>CRM Prospectos</span>
          <span>/</span>
          <span>{prospect.projectName || "Demo comercial"}</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.iconButton} type="button" onClick={copyMessage} aria-label="Compartir mensaje">
            <Share2 size={16} />
          </button>
          <Link className={styles.iconButton} href={`/admin/landing-builder?prospect=${prospect.id}`} aria-label="Editar demo">
            <Edit2 size={16} />
          </Link>
          <button className={styles.iconButton} type="button" aria-label="Cerrar detalle">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <section className={styles.titleRow}>
          <div className={styles.kicker}>Prospecto seleccionado</div>
          <h2 className={styles.title}>{prospect.brandName}</h2>
          <p className={styles.summary}>
            {prospect.notes ||
              "Prospecto listo para crear una demo comercial, adjuntar HTML/JSON y enviar un mensaje editable por WhatsApp o Instagram."}
          </p>

          <Link className={styles.primaryAction} href={`/admin/landing-builder?prospect=${prospect.id}#crear-demo`}>
            <Rocket size={18} />
            Crear página
          </Link>
        </section>

        <section className={styles.metaGrid}>
          <MetaItem icon={<MoreHorizontal size={18} />} label="Status">
            <span className={styles.badge}>
              <i className={styles.statusDot} />
              {statusLabel(prospect)}
            </span>
          </MetaItem>

          <MetaItem icon={<Users size={18} />} label="Marca / iniciales">
            <strong>{initials(prospect.brandName)} · {prospect.brandName}</strong>
          </MetaItem>

          <MetaItem icon={<Calendar size={18} />} label="Fecha CRM">
            <strong>{prospect.createdAt ? prospect.createdAt.slice(0, 10) : "Sin fecha"}</strong>
          </MetaItem>

          <MetaItem icon={<Tag size={18} />} label="Tags">
            <div className={styles.badges}>
              {tags.map((tag) => (
                <span key={tag} className={styles.badge}>{tag}</span>
              ))}
            </div>
          </MetaItem>

          <MetaItem icon={<Phone size={18} />} label="Número">
            <strong>{prospect.phone || "Sin dato"}</strong>
          </MetaItem>

          <MetaItem icon={<Mail size={18} />} label="Correo">
            <strong>{prospect.email || "Sin dato"}</strong>
          </MetaItem>

          <MetaItem icon={<Globe size={18} />} label="Sitio web / link actual">
            <strong>{prospect.website || instagramHref || "Sin dato"}</strong>
          </MetaItem>

          <MetaItem icon={<FileText size={18} />} label="Descripción">
            <span>{prospect.projectName || "Demo comercial personalizada"}</span>
          </MetaItem>
        </section>

        <section className={styles.attachments}>
          <div className={styles.sectionTitle}>
            <span><Paperclip size={18} /> Attachment</span>
            <a className={styles.quickButton} href={jsonHref} download={`${prospect.brandName.replace(/\s+/g, "-").toLowerCase()}-prospecto.json`}>
              <Download size={16} />
              Download JSON
            </a>
          </div>

          <div className={styles.attachmentGrid}>
            <a className={styles.attachmentCard} href={jsonHref} download={`${prospect.brandName.replace(/\s+/g, "-").toLowerCase()}-prospecto.json`}>
              <span className={styles.attachmentIcon}><FileJson size={22} /></span>
              <span>
                <strong>prospecto.json</strong>
                <small>Datos comerciales del lead</small>
              </span>
            </a>

            <div className={styles.attachmentCard}>
              <span className={styles.attachmentIcon}><FileCode2 size={22} /></span>
              <span>
                <strong>{htmlFileName || "landing-demo.html"}</strong>
                <small>{htmlFileName ? "HTML adjuntado localmente" : "Adjunta el HTML de propuesta"}</small>
              </span>
            </div>

            <label className={styles.uploadCard}>
              <input className="hidden" type="file" accept=".html,.htm,text/html" onChange={handleHtmlAttachment} />
              <Plus size={22} />
              <span>Adjuntar HTML</span>
            </label>
          </div>
        </section>

        <section className={styles.messageBox}>
          <div className={styles.sectionTitle}>Mensaje sugerido editable</div>
          <textarea className={styles.messageTextarea} value={message} onChange={(event) => setMessage(event.target.value)} />

          <div className={styles.quickActions}>
            <a className={`${styles.quickButton} ${styles.whatsapp}`} href={whatsappHref} target="_blank" rel="noreferrer">
              <Phone size={16} />
              WhatsApp
            </a>

            {instagramHref ? (
              <a className={`${styles.quickButton} ${styles.instagram}`} href={instagramHref} target="_blank" rel="noreferrer">
                <Instagram size={16} />
                Instagram
              </a>
            ) : null}

            {prospect.landingUrl ? (
              <a className={styles.quickButton} href={prospect.landingUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                Abrir landing
              </a>
            ) : null}

            <button className={styles.quickButton} type="button" onClick={copyMessage}>
              <Share2 size={16} />
              Copiar mensaje
            </button>
          </div>
        </section>

        <section className={styles.attachments}>
          <div className={styles.sectionTitle}>
            <span><Palette size={18} /> Paleta de colores</span>
          </div>
          <div className={styles.swatches}>
            {prospect.colorPalette.length ? (
              prospect.colorPalette.map((color) => (
                <span className={styles.swatch} key={color}>
                  <i style={{ background: color }} />
                  {color}
                </span>
              ))
            ) : (
              <span className={styles.badge}>Sin paleta registrada</span>
            )}
          </div>
        </section>

        <section className={styles.taskTableWrap}>
          <div className={styles.sectionTitle}>Task List</div>
          <table className={styles.taskTable}>
            <thead>
              <tr>
                <th>No</th>
                <th>Task</th>
                <th>Category</th>
                <th>Status</th>
                <th>Next step</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Revisar datos del prospecto</td>
                <td>Discovery</td>
                <td>Completed</td>
                <td>Validar redes y contacto</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Adjuntar HTML / JSON</td>
                <td>Propuesta</td>
                <td>In Progress</td>
                <td>Subir demo al editor</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Enviar mensaje personalizado</td>
                <td>Venta</td>
                <td>Pending</td>
                <td>WhatsApp o Instagram</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </article>
  );
}

function MetaItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <div>
        <small>{label}</small>
        {children}
      </div>
    </div>
  );
}
