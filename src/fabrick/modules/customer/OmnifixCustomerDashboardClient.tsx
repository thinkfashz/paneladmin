"use client";

import { useEffect, useState } from "react";
import { Heart, History, Loader2, MessageCircle, PackageCheck, RefreshCw, Send, Star, User } from "lucide-react";
import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";

type Order = { id: string; estado: string; resumen?: { total: number }; creadoEn?: string; items?: Array<{ nombre?: string; cantidad: number }> };
type Dashboard = { profile?: { email: string; name: string; likes: Array<{ id: string; productName: string; createdAt: string }>; comments: Array<{ id: string; productName: string; text: string; createdAt: string }>; support: Array<{ id: string; role: "cliente" | "soporte"; text: string; createdAt: string }> }; orders?: Order[]; realtime?: { mode: string; intervalMs: number } };

function money(value = 0) { return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value); }

export default function OmnifixCustomerDashboardClient() {
  const [email, setEmail] = useState("cliente@omnifix.local");
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportText, setSupportText] = useState("");
  const [commentText, setCommentText] = useState("");

  async function load(nextEmail = email) {
    setLoading(true);
    const res = await fetch(`/api/customer/dashboard?email=${encodeURIComponent(nextEmail)}`, { cache: "no-store" });
    setData(await res.json() as Dashboard);
    setLoading(false);
  }

  async function mutate(action: "support" | "comment" | "like", text?: string) {
    const res = await fetch("/api/customer/dashboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, action, productId: "diagnostico-express", productName: "Diagnóstico técnico express", text }) });
    setData(await res.json() as Dashboard);
  }

  useEffect(() => {
    try { setEmail(localStorage.getItem("omnifix-customer-email") || "cliente@omnifix.local"); } catch {}
  }, []);

  useEffect(() => {
    void load(email);
    const id = setInterval(() => void load(email), 8000);
    return () => clearInterval(id);
  }, [email]);

  const profile = data?.profile;
  const orders = data?.orders || [];

  return <main className="min-h-screen bg-[#050816] px-4 py-5 pb-24 text-white md:px-8">
    <section className="mx-auto max-w-7xl space-y-5">
      <header className="overflow-hidden rounded-[2.3rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_15%_0%,rgba(0,245,255,.18),transparent_30rem),linear-gradient(135deg,#07111f,#020617)] p-5 shadow-[0_30px_100px_rgba(0,0,0,.35)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><OmnifixLogo showText className="h-28 w-auto" /><p className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.24em] text-cyan-100"><User className="size-3.5" /> Dashboard cliente</p><h1 className="mt-4 text-4xl font-black leading-[.92] tracking-[-.07em] md:text-6xl">Pedidos, favoritos y soporte.</h1></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><label className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Correo cliente</label><input value={email} onChange={(event) => { setEmail(event.target.value); try { localStorage.setItem("omnifix-customer-email", event.target.value); } catch {} }} className="mt-2 w-full bg-transparent text-sm font-bold outline-none" /></div></div>
      </header>

      <section className="grid gap-4 md:grid-cols-4"><Metric icon={PackageCheck} label="Pedidos" value={String(orders.length)} /><Metric icon={Heart} label="Me gusta" value={String(profile?.likes.length || 0)} /><Metric icon={MessageCircle} label="Comentarios" value={String(profile?.comments.length || 0)} /><Metric icon={RefreshCw} label="Tiempo real" value={data?.realtime?.mode || "sync"} /></section>

      {loading ? <div className="grid min-h-48 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.035]"><Loader2 className="size-7 animate-spin text-cyan-300" /></div> : <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Card title="Historial de compras" icon={History}>{orders.length ? orders.map((order) => <div key={order.id} className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="flex items-start justify-between gap-3"><div><b>{order.id}</b><p className="mt-1 text-sm text-slate-500">{order.estado} · {order.items?.map((item) => item.nombre || "Servicio").join(", ") || "Orden Omnifix"}</p></div><b className="text-cyan-100">{money(order.resumen?.total || 0)}</b></div></div>) : <Empty text="Cuando compres o cotices, tus pedidos aparecerán aquí." />}</Card>
          <Card title="Comentarios" icon={MessageCircle}>{profile?.comments.map((comment) => <div key={comment.id} className="rounded-2xl border border-white/10 bg-black/25 p-4"><b>{comment.productName}</b><p className="mt-2 text-sm text-slate-400">{comment.text}</p></div>)}<div className="mt-3 flex gap-2"><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Comentar un servicio..." className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm outline-none" /><button onClick={() => { void mutate("comment", commentText); setCommentText(""); }} className="rounded-2xl bg-cyan-300 px-4 font-black text-slate-950"><Send className="size-4" /></button></div></Card>
        </div>
        <div className="space-y-5"><Card title="Me gusta" icon={Heart}>{profile?.likes.map((like) => <div key={like.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3"><Star className="size-4 fill-cyan-300 text-cyan-300" /><span className="text-sm font-bold">{like.productName}</span></div>)}<button onClick={() => void mutate("like")} className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100">Guardar diagnóstico express</button></Card><Card title="Chat soporte" icon={MessageCircle}>{profile?.support.map((msg) => <div key={msg.id} className={`rounded-2xl p-3 text-sm ${msg.role === "cliente" ? "ml-8 bg-cyan-300 text-slate-950" : "mr-8 bg-white/[0.08] text-white"}`}>{msg.text}</div>)}<div className="mt-3 flex gap-2"><input value={supportText} onChange={(event) => setSupportText(event.target.value)} placeholder="Escribe al soporte..." className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm outline-none" /><button onClick={() => { void mutate("support", supportText); setSupportText(""); }} className="rounded-2xl bg-cyan-300 px-4 font-black text-slate-950"><Send className="size-4" /></button></div></Card></div>
      </section>}
    </section>
  </main>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof PackageCheck; label: string; value: string }) { return <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5"><Icon className="mb-4 size-6 text-cyan-300" /><p className="text-sm text-slate-500">{label}</p><b className="mt-1 block text-2xl">{value}</b></article>; }
function Card({ title, icon: Icon, children }: { title: string; icon: typeof PackageCheck; children: React.ReactNode }) { return <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5"><div className="mb-4 flex items-center gap-3"><Icon className="size-5 text-cyan-300" /><h2 className="text-2xl font-black tracking-[-.04em]">{title}</h2></div><div className="grid gap-3">{children}</div></article>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">{text}</div>; }
