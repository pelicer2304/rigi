/**
 * RigiBlick Dashboard — "Precision Navy" Design Philosophy
 * Navy #1a2e4a authority anchor | Blue #2563eb actions | Red #c53030 urgency only
 * DM Sans typography | Asymmetric sidebar layout | Minimal decoration, maximum clarity
 */

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Bell, TrendingUp, Calendar, ExternalLink, ChevronRight,
  AlertTriangle, Clock, Activity, Users, BarChart2, Search,
  MessageSquare, Microscope, Radio, Globe, Zap,
  ArrowUpRight, ArrowDownRight, Info, Building2, Send, Bot,
  Sparkles, Package, FileText, Newspaper, X, ChevronDown, Settings, List, ClipboardList
} from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#1a2e4a",
  navyMid: "#2d4a6e",
  navyDark:"#0f1e30",
  blue:    "#2563eb",
  blueLt:  "#eff6ff",
  blueBdr: "#bfdbfe",
  red:     "#c53030",
  redLt:   "#fff5f5",
  redBdr:  "#feb2b2",
  amber:   "#d97706",
  amberLt: "#fffbeb",
  green:   "#059669",
  greenLt: "#ecfdf5",
  gray1:   "#f7f9fc",
  gray2:   "#f1f4f8",
  gray3:   "#e2e8f0",
  gray4:   "#94a3b8",
  gray5:   "#475569",
  white:   "#ffffff",
};

// ── Mini SVG bar chart ────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: { value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <svg width="100%" height="48" viewBox={`0 0 ${data.length * 22} 48`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = (d.value / max) * 38;
        return (
          <rect key={i} x={i * 22 + 3} y={44 - h} width={16} height={h}
            rx={3} fill={C.blue} opacity={0.35 + (i / data.length) * 0.65} />
        );
      })}
    </svg>
  );
}

// ── Tag / Badge ───────────────────────────────────────────────────────────────
function Tag({ color, bg, bdr, children }: { color: string; bg: string; bdr: string; children: React.ReactNode }) {
  return (
    <span style={{
      background: bg, color, border: `1px solid ${bdr}`,
      fontWeight: 700, fontSize: 11, padding: "2px 9px",
      borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.2
    }}>{children}</span>
  );
}

function UrgencyBadge({ days }: { days: number }) {
  if (days < 0)   return <Tag color={C.red}    bg={C.redLt}  bdr={C.redBdr} >Vencido</Tag>;
  if (days <= 30) return <Tag color={C.red}    bg={C.redLt}  bdr={C.redBdr} >{days}d</Tag>;
  if (days <= 60) return <Tag color={C.navyMid} bg={C.gray2} bdr={C.gray3}  >{days}d</Tag>;
  return               <Tag color={C.gray4}   bg={C.gray2}  bdr={C.gray3}  >{days}d</Tag>;
}

const daysLeft = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);

// ── DATA ──────────────────────────────────────────────────────────────────────
const DATA = {
  urgentes: [
    { label: "CP 1370 de Pesquisa Clínica",          days: 5,                      displayDate: "11 Mar 2026" },
    { label: "Webinar GGMED",                         date: "02 Mar 26",            displayDate: "02 Mar 2026" },
    { label: "Contribuição ICH M4Q(R2) – CTD",        days: daysLeft("2025-10-20"), displayDate: "20 Out 2025" },
  ],
  registrosHoje: [
    { cat: "Novos",            items: [{ name: "Semaglutida",    company: "Novo Nordisk" }] },
    { cat: "Biológico",        items: [{ name: "Denosumabe",     company: "Amgen" }] },
    { cat: "Genérico/Similar", items: [{ name: "Dipirona",       company: "EMS" }] },
    { cat: "Biossimilar",      items: [{ name: "Tiraglutida",    company: "Biocon" }] },
    { cat: "Fitoterápico",     items: [{ name: "Senne",          company: "Natulab" }] },
    { cat: "Outros",           items: [{ name: "+ 5 publicados", company: "ver todos" }] },
  ],
  emAnalise: [
    { ifa: "Denosumabe",     delta: +2 },
    { ifa: "Semaglutida",    delta: +1 },
    { ifa: "Empagliflozino", delta: +1 },
    { ifa: "Empagliflozina", delta: +1 },
    { ifa: "Levetiracetam",  delta: +2 },
  ],
  consultas: [
    { ref: "105/25", title: "ICH M4Q(R2) – CTD",                deadline: "2025-10-20" },
    { ref: "13/25",  title: "ICH Q3E – Extraíveis/Lixiviáveis", deadline: "2025-11-10" },
    { ref: "16/25",  title: "Revisão de Bula Padrão",            deadline: "2025-12-01" },
    { ref: "80/25",  title: "Guia PBBM Farmacocinética",         deadline: "2026-01-05" },
    { ref: "81/25",  title: "Guia Produto-Específico Etanol",    deadline: "2026-02-07" },
  ],
  expedientes: [
    { processo: "25351.100002/2026-02", data: "07/03/2026", status: "Em análise", changed: false },
    { processo: "25351.100003/2026-03", data: "12/03/2026", status: "Exigência",  changed: true  },
    { processo: "25351.100004/2026-04", data: "15/03/2026", status: "Em análise", changed: false },
  ],
  atualizacoesBula: [
    { medicamento: "Semaglutida 1mg/mL Sol. Inj.",    dataAtualizacao: "20/03/2026" },
    { medicamento: "Denosumabe 60mg/mL Sol. Inj.",    dataAtualizacao: "18/03/2026" },
    { medicamento: "Empagliflozina 10mg Comp.",       dataAtualizacao: "15/03/2026" },
    { medicamento: "Levetiracetam 500mg Comp.",       dataAtualizacao: "10/03/2026" },
  ],
  temposAnvisa: [
    { label: "Inovador",         v24: 29, v25: 37 },
    { label: "Biológico",        v24: 26, v25: 27 },
    { label: "Genérico/Similar", v24: 32, v25: 36 },
    { label: "Clone",            v24: 8,  v25: 7  },
    { label: "Específico",       v24: 23, v25: 22 },
  ],
  pfizer: {
    gestores: ["Claudia Scordamaglia", "Juliana Rocha"],
    totalRegistros: 130,
    emAnalise: 25,
    posRegistro: 75,
    renovacao2026: 30,
    renovacoes: [
      { produto: "Produto A", processo: "25351.001234/2026-01", expiracao: "12/03/2026", status: "alerta" },
      { produto: "Produto B", processo: "25351.005678/2026-02", expiracao: "04/08/2026", status: "ok" },
      { produto: "Produto C", processo: "25351.009012/2026-03", expiracao: "15/01/2026", status: "urgente" },
    ],
  },
  chartData: [5, 8, 3, 12, 7, 9].map(v => ({ value: v })),
  noticias: [
    { title: "Novas indicações aprovadas para Keytruda e Imfinzi no tratamento de câncer", date: "23 Fev 2026", cat: "Registro", link: "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/aprovadas-pela-anvisa-novas-indicacoes-de-medicamentos-para-cancer" },
    { title: "ANVISA aprova regras para produção de Cannabis Medicinal no Brasil", date: "28 Jan 2026", cat: "Regulatório", link: "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-aprova-por-unanimidade-regras-que-cumprem-decisao-do-stj-para-producao-de-cannabis-medicinal" },
    { title: "Receituários de medicamentos controlados: nova norma RDC 1.000 entra em vigor", date: "13 Fev 2026", cat: "RDC", link: "https://agenciabrasil.ebc.com.br/saude/noticia/2026-02/norma-da-anvisa-sobre-receitas-controladas-impressas-entra-em-vigor" },
    { title: "Aprovado medicamento inédito para tratamento da doença de Alzheimer", date: "08 Jan 2026", cat: "Registro", link: "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026" },
    { title: "ANVISA aprova nova indicação de medicamento para prevenção do HIV-1", date: "12 Jan 2026", cat: "Registro", link: "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026" },
  ],
};

const NAV_LINKS = [
  { icon: FileText,  label: "Slides disponíveis" },
  { icon: Radio,     label: "Webcasts" },
  { icon: Globe,     label: "Notícias Internacionais" },
];

const OUTROS_SUBS = ["CADIFA", "CBPFs", "Medicamentos de Referência", "DCB", "Estudos Clínicos", "Terapias Avançadas"];

// ── Card ──────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: C.white, borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.04)",
    overflow: "hidden", ...style
  }}>{children}</div>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader = ({ number, title, link = "#" }: { number?: string; title: string; link?: string | null }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "11px 16px", background: C.navy,
    borderBottom: "2px solid rgba(37,99,235,.4)"
  }}>
    <span style={{ fontWeight: 700, fontSize: 13, color: C.white, letterSpacing: 0.3 }}>
      {number && <span style={{ opacity: .45, marginRight: 6, fontSize: 11 }}>{number}</span>}
      {title}
    </span>
    {link && (
      <a href={link} style={{ fontSize: 11, color: "#93c5fd", display: "flex", alignItems: "center", gap: 3, textDecoration: "none", opacity: 0.85 }}>
        Ver tudo <ExternalLink size={10} />
      </a>
    )}
  </div>
);

// ── Slide-in Panel ────────────────────────────────────────────────────────────
function SlidePanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 50,
      display: "flex", justifyContent: "flex-end", backdropFilter: "blur(2px)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 460, background: C.white, height: "100%", overflow: "auto",
        boxShadow: "-8px 0 32px rgba(0,0,0,.15)", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${C.gray3}`, background: C.navy }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ border: "none", background: "rgba(255,255,255,.1)", cursor: "pointer", width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color="#93c5fd" />
          </button>
        </div>
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function RigiBlick() {
  const [, navigate] = useLocation();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [outrosOpen, setOutrosOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .news-track { animation: marquee 38s linear infinite; }
        .news-track:hover { animation-play-state: paused; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .nav-btn:hover { background: rgba(255,255,255,.07) !important; color: #e2e8f0 !important; }
        .nav-sub:hover { color: #93c5fd !important; border-left-color: #93c5fd !important; }
        .nav-card-hover:hover { border-color: #2563eb !important; box-shadow: 0 6px 20px rgba(37,99,235,.12) !important; transform: translateY(-2px) !important; }
        .news-card:hover { border-color: #2563eb !important; background: #eff6ff !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 172, background: `linear-gradient(180deg, ${C.navy} 0%, ${C.navyDark} 100%)`,
        display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0,
        boxShadow: "2px 0 12px rgba(0,0,0,.12)"
      }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ width: 42, height: 42, background: "rgba(37,99,235,.25)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, border: "1px solid rgba(37,99,235,.4)" }}>
            <Activity size={20} color="#93c5fd" />
          </div>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 2 }}>Página Inicial</div>
          <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>RIGI AI</div>
        </div>

        <nav style={{ padding: "12px 0", flex: 1 }}>
          <button
            onClick={() => setOutrosOpen(o => !o)}
            className="nav-btn"
            style={{
              width: "100%", background: outrosOpen ? "rgba(255,255,255,.09)" : "none",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 9, padding: "10px 16px",
              color: outrosOpen ? "#e2e8f0" : "#94a3b8", fontSize: 13, textAlign: "left",
              transition: "all .15s"
            }}
          >
            <BarChart2 size={14} />
            <span style={{ flex: 1 }}>Outros Painéis</span>
            <ChevronDown size={12} style={{ transform: outrosOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>

          {outrosOpen && (
            <div style={{ paddingBottom: 4 }}>
              {OUTROS_SUBS.map(sub => (
                <button key={sub} className="nav-sub" style={{
                  width: "calc(100% - 16px)", marginLeft: 16, background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 16px 7px 20px",
                  color: "#64748b", fontSize: 12, textAlign: "left",
                  borderLeft: "2px solid rgba(255,255,255,.07)",
                  transition: "all .15s"
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: 2, background: "currentColor", display: "inline-block", flexShrink: 0 }} />
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* FILAS — item independente abaixo de Outros Painéis */}
          <button className="nav-btn" style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 9, padding: "10px 16px",
            color: "#94a3b8", fontSize: 13, textAlign: "left", transition: "all .15s"
          }}
            onClick={() => navigate("/filas")}
          >
            <List size={14} /> FILAS
          </button>

          {/* Processos em Análise — item independente abaixo de FILAS */}
          <button className="nav-btn" style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 9, padding: "10px 16px",
            color: "#94a3b8", fontSize: 13, textAlign: "left", transition: "all .15s"
          }}
            onClick={() => { window.dispatchEvent(new CustomEvent('toast', { detail: 'Em breve' })); }}
          >
            <ClipboardList size={14} /> Processos em Análise
          </button>

          {NAV_LINKS.map(({ icon: Icon, label }) => (
            <button key={label} className="nav-btn" style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 9, padding: "10px 16px",
              color: "#94a3b8", fontSize: 13, textAlign: "left", transition: "all .15s"
            }}>
              <Icon size={14} /> {label}
            </button>
          ))}

          <div style={{ margin: "14px 10px", background: `linear-gradient(135deg, ${C.red} 0%, #9b1c1c 100%)`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(197,48,48,.3)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: 4 }}>NOVOS REGULAMENTOS</div>
            <div style={{ fontSize: 11, color: "#fca5a5", lineHeight: 1.4 }}>→ Novo marco regulatório de fitoterápicos</div>
          </div>
        </nav>

        <div style={{ padding: "0 10px", borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 12 }}>
          {["Time do Breath", "Suporte"].map(l => (
            <div key={l} style={{ fontSize: 12, color: "#64748b", padding: "5px 6px", cursor: "pointer", borderRadius: 5, transition: "color .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.color = "#94a3b8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.color = "#64748b"; }}
            >{l}</div>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* Header */}
        <header style={{
          background: C.white, borderBottom: `1px solid ${C.gray3}`,
          padding: "12px 24px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10,
          boxShadow: "0 1px 4px rgba(0,0,0,.06)"
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: -.5 }}>
            Rigi<span style={{ color: C.blue }}>Blick</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 7, background: C.gray2,
              border: `1px solid ${C.gray3}`, borderRadius: 8, padding: "7px 13px",
              fontSize: 13, color: C.gray4, cursor: "text", width: 220,
              transition: "border-color .15s"
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.blue; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.gray3; }}
            >
              <Search size={13} /> Buscar regulamento, produto…
            </div>
            <button style={{
              background: C.blue, color: "#fff", border: "none", borderRadius: 8,
              padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 2px 8px rgba(37,99,235,.3)", transition: "all .15s"
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1d4ed8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.blue; }}
            >
              <MessageSquare size={13} /> Fale com a RIGI
            </button>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <Bell size={18} color={C.gray4} />
              <span style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, background: C.red, borderRadius: 4, border: "2px solid #fff" }} />
            </div>
          </div>
        </header>

        {/* Grid */}
        <div style={{ display: "flex", flex: 1, padding: "18px 20px", gap: 16 }}>

          {/* CENTER */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>

            {/* 1. DESTAQUES */}
            <Card>
              <SectionHeader title="DESTAQUES E PRAZOS URGENTES" />
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {DATA.urgentes.map((u, i) => {
                  const urgent = u.days !== undefined && u.days <= 30;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 15px", gap: 16,
                      background: urgent ? C.redLt : C.gray2,
                      borderRadius: 8, border: `1px solid ${urgent ? C.redBdr : C.gray3}`,
                      cursor: "pointer", transition: "all .15s",
                      borderLeft: urgent ? `3px solid ${C.red}` : `3px solid ${C.gray3}`
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,.06)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                        <div style={{ flexShrink: 0 }}>
                          {urgent   ? <AlertTriangle size={15} color={C.red} />
                           : (u as { date?: string }).date ? <Calendar size={15} color={C.blue} />
                                    : <Clock size={15} color={C.gray4} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: C.navy, fontWeight: 600, lineHeight: 1.3, marginBottom: 2 }}>{u.label}</div>
                          <div style={{ fontSize: 11, color: C.gray4 }}>Prazo: {u.displayDate}</div>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        {u.days !== undefined ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                            <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, color: urgent ? C.red : C.navyMid }}>{u.days}</span>
                            <span style={{ fontSize: 10, color: C.gray4, fontWeight: 500 }}>dias restantes</span>
                          </div>
                        ) : (
                          <Tag color={C.blue} bg={C.blueLt} bdr={C.blueBdr}>Evento</Tag>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 2+3. REGISTROS E IFAs DO DIA */}
            <Card>
              <SectionHeader title="REGISTROS E IFAs DO DIA" link="/ifa-monitoramento" />
              <div style={{ display: "flex", gap: 0 }}>

                {/* Coluna esquerda: Registros do Dia */}
                <div style={{ flex: 1, padding: "12px 16px", borderRight: `1px solid ${C.gray3}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.gray4, textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>Registros do Dia</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {DATA.registrosHoje.map(({ cat, items }) => (
                      <div key={cat} style={{
                        background: C.gray2, borderRadius: 8, padding: "10px 12px",
                        border: `1px solid ${C.gray3}`, cursor: "pointer", transition: "all .15s"
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.blue; (e.currentTarget as HTMLDivElement).style.background = C.blueLt; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.gray3; (e.currentTarget as HTMLDivElement).style.background = C.gray2; }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: .5, marginBottom: 5 }}>{cat}</div>
                        {items.map(item => (
                          <div key={item.name}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: C.gray4 }}>{item.company}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coluna direita: IFAs do Dia */}
                <div style={{ width: 260, flexShrink: 0, padding: "12px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.gray4, textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>IFAs do Dia</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {DATA.emAnalise.map(({ ifa, delta }) => (
                      <div key={ifa} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: C.gray2, border: `1px solid ${C.gray3}`,
                        borderRadius: 8, padding: "7px 12px", transition: "all .15s"
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.blue; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.gray3; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Microscope size={12} color={C.gray4} />
                          <span style={{ fontWeight: 600, color: C.navy, fontSize: 12 }}>{ifa}</span>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 12, color: delta > 0 ? C.red : C.blue, display: "flex", alignItems: "center", gap: 1 }}>
                          {delta > 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Card>

            {/* 5. MEUS CARDS */}
            <Card>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 16px", background: C.navy,
                borderBottom: "2px solid rgba(37,99,235,.4)"
              }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: C.white, letterSpacing: 0.3 }}>Meus Cards</span>
                <button
                  title="Personalizar cards"
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)",
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                    fontSize: 11, color: "#93c5fd", fontWeight: 600, transition: "all .15s"
                  }}
                  onClick={() => setActivePanel("Personalizar Meus Cards")}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.1)"; }}
                >
                  <Settings size={11} />
                  Personalizar
                </button>
              </div>
              <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                { title: "Análise de Tempos da ANVISA",  icon: TrendingUp, desc: "Comparativo 2024 × 2025", href: "/tempos-anvisa" },
                { title: "Medicamentos Registrados",     icon: Package,    desc: "Todos os registros do período", href: "/medicamentos-registrados" },
                { title: "Estatísticas ANVISA",          icon: BarChart2,  desc: "Relatórios gerenciais", href: null },
                { title: "Pipeline Regulatório",          icon: Microscope, desc: "Pesquisa clínica · pré-registro", href: null },
              ].map(({ title, icon: Icon, desc, href }) => (
                <div key={title}
                  onClick={() => href ? (window.location.href = href) : setActivePanel(title)}
                  className="nav-card-hover"
                  style={{
                    background: C.white, border: `1px solid ${C.gray3}`,
                    borderRadius: 10, padding: "18px 16px", cursor: "pointer",
                    transition: "all .2s", display: "flex", flexDirection: "column", gap: 0
                  }}
                >
                  <div style={{ width: 38, height: 38, background: C.blueLt, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Icon size={19} color={C.blue} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.35, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 11, color: C.gray4, lineHeight: 1.4, flex: 1 }}>{desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 10, fontSize: 11, color: C.blue, fontWeight: 600 }}>
                    Abrir <ChevronRight size={11} />
                  </div>
                </div>
              ))}
            </div>
              </div>
            </Card>

            {/* 6. NOTÍCIAS */}
            <Card>
              <SectionHeader title="Notícias da ANVISA" link="https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa" />
              <div style={{ padding: "14px 16px", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 48, background: `linear-gradient(to right, ${C.white}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 16, top: 0, bottom: 0, width: 48, background: `linear-gradient(to left, ${C.white}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
                <div className="news-track" style={{ display: "flex", gap: 12, width: "max-content" }}>
                  {[...DATA.noticias, ...DATA.noticias].map((n, i) => (
                    <a key={i} href={n.link} target="_blank" rel="noopener noreferrer"
                      className="news-card"
                      style={{
                        display: "flex", flexDirection: "column", justifyContent: "space-between",
                        width: 234, flexShrink: 0, padding: "13px 15px",
                        background: C.gray2, borderRadius: 9,
                        border: `1px solid ${C.gray3}`,
                        textDecoration: "none", transition: "all .2s"
                      }}
                    >
                      <div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: C.blue,
                          background: C.blueLt, border: `1px solid ${C.blueBdr}`,
                          borderRadius: 20, padding: "2px 8px",
                          textTransform: "uppercase", letterSpacing: .5,
                          display: "inline-block", marginBottom: 7
                        }}>{n.cat}</span>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, lineHeight: 1.45 }}>{n.title}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                        <span style={{ fontSize: 11, color: C.gray4 }}>{n.date}</span>
                        <ExternalLink size={10} color={C.blue} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside style={{ width: 248, display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>

            {/* User */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%)`, borderRadius: 10, padding: "13px 15px", boxShadow: "0 2px 8px rgba(26,46,74,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, background: "rgba(255,255,255,.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.1)" }}>
                  <Users size={16} color="#93c5fd" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Claudia Scordamaglia</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Juliana Rocha</div>
                </div>
              </div>
            </div>

            {/* Processos Pfizer */}
            <Card style={{ overflow: "visible" }}>
              <SectionHeader title="Processos Pfizer" link={null} />
              <div style={{ padding: "14px 14px 10px" }}>

                {/* Gestores */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 10px", background: C.gray2, borderRadius: 7, border: `1px solid ${C.gray3}` }}>
                  <Users size={13} color={C.blue} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 10, color: C.gray4, fontWeight: 600, textTransform: "uppercase", letterSpacing: .4, marginBottom: 1 }}>Gestores Regulatórios</div>
                    <div style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>{DATA.pfizer.gestores.join(" · ")}</div>
                  </div>
                </div>

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.gray4, textTransform: "uppercase", letterSpacing: .4, marginBottom: 1 }}>Total de Processos</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{DATA.pfizer.totalRegistros}</div>
                  </div>
                  <Building2 size={18} color={C.gray3} />
                </div>

                {/* KPI grid */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                  {[
                    { label: "Em análise (ANVISA)",    val: DATA.pfizer.emAnalise,    color: C.blue,  bg: C.blueLt,  bdr: C.blueBdr },
                    { label: "Pós-registro",            val: DATA.pfizer.posRegistro,  color: C.green, bg: C.greenLt, bdr: `${C.green}30` },
                    { label: "Renovação em 2026",       val: DATA.pfizer.renovacao2026, color: C.amber, bg: C.amberLt, bdr: `${C.amber}40` },
                  ].map(({ label, val, color, bg, bdr }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: bg, borderRadius: 6, border: `1px solid ${bdr}` }}>
                      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Renovações table */}
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Renovações de Registro em 2026</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {DATA.pfizer.renovacoes.map(r => {
                    const cfg = r.status === "urgente"
                      ? { dot: C.red,   bg: C.redLt,   bdr: C.redBdr,   label: "Urgente" }
                      : r.status === "alerta"
                      ? { dot: C.amber, bg: C.amberLt, bdr: `${C.amber}40`, label: "6 meses" }
                      : { dot: C.green, bg: C.greenLt, bdr: `${C.green}30`, label: "Ok" };
                    return (
                      <div key={r.produto} style={{ background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 7, padding: "8px 10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{r.produto}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: cfg.dot }}>
                            <span style={{ width: 6, height: 6, borderRadius: 3, background: cfg.dot, display: "inline-block" }} />
                            {cfg.label}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 10, color: C.gray4, fontFamily: "monospace" }}>{r.processo}</span>
                          <span style={{ fontSize: 10, color: C.gray5, fontWeight: 600 }}>Exp: {r.expiracao}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <a href="/processos" style={{
                  display: "block", textAlign: "center", marginTop: 10,
                  fontSize: 12, fontWeight: 700, color: C.blue,
                  background: C.blueLt, borderRadius: 7, padding: "7px",
                  textDecoration: "none", border: `1px solid ${C.blueBdr}`,
                  transition: "all .15s"
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.blue; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = C.blueLt; (e.currentTarget as HTMLAnchorElement).style.color = C.blue; }}
                >Ver todos os processos →</a>
              </div>
            </Card>

            {/* Processos que Sigo */}
            <Card>
              <SectionHeader title="Processos que Sigo" link={null} />
              <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
                {DATA.expedientes.map(exp => (
                  <div key={exp.processo} style={{
                    padding: "9px 11px",
                    background: exp.changed ? C.blueLt : C.gray2,
                    borderRadius: 7,
                    border: `1px solid ${exp.changed ? C.blueBdr : C.gray3}`,
                    borderLeft: exp.changed ? `3px solid ${C.blue}` : `3px solid ${C.gray3}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: C.gray4 }}>{exp.processo}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                        color: exp.status === "Exigência" ? C.red : exp.status === "Em análise" ? C.blue : C.gray4,
                        background: exp.status === "Exigência" ? C.redLt : exp.status === "Em análise" ? C.blueLt : C.gray2,
                        border: `1px solid ${exp.status === "Exigência" ? C.redBdr : exp.status === "Em análise" ? C.blueBdr : C.gray3}`
                      }}>{exp.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.gray4 }}>{exp.data}</span>
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: C.gray5, padding: "3px 2px", display: "flex", alignItems: "center", gap: 5 }}>
                  <Info size={11} color={C.blue} />
                  {DATA.expedientes.filter(e => e.changed).length} processo(s) com mudança de status
                </div>
              </div>
            </Card>

            {/* Atualizações de Bula */}
            <Card>
              <SectionHeader title="Atualizações de Bula" link={null} />
              <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
                {DATA.atualizacoesBula.map(item => (
                  <div key={item.medicamento} style={{
                    padding: "9px 11px",
                    background: C.gray2,
                    borderRadius: 7,
                    border: `1px solid ${C.gray3}`,
                    borderLeft: `3px solid ${C.blue}`,
                    cursor: "pointer", transition: "all .15s"
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.blueBdr; (e.currentTarget as HTMLDivElement).style.background = C.blueLt; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.gray3; (e.currentTarget as HTMLDivElement).style.background = C.gray2; }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, lineHeight: 1.35, marginBottom: 4 }}>{item.medicamento}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={10} color={C.gray4} />
                      <span style={{ fontSize: 11, color: C.gray4 }}>Atualizado em {item.dataAtualizacao}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </aside>
        </div>
      </div>

      {/* SLIDE-IN PANEL */}
      {activePanel && (
        <SlidePanel title={activePanel} onClose={() => setActivePanel(null)}>
          {activePanel.includes("Tempos") && (
            <div>
              <p style={{ fontSize: 13, color: C.gray5, marginBottom: 16, lineHeight: 1.6 }}>
                Tempo médio de aprovação ANVISA em meses — comparativo entre 2024 e Out/2025.
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.navy, color: "#fff" }}>
                    {["Tipo de Registro", "2024", "Out/2025", "Δ"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: h === "Tipo de Registro" ? "left" : "center", fontSize: 12, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATA.temposAnvisa.map((row, i) => {
                    const d = row.v25 - row.v24;
                    return (
                      <tr key={row.label} style={{ background: i % 2 === 0 ? C.white : C.gray2, borderBottom: `1px solid ${C.gray3}` }}>
                        <td style={{ padding: "11px 14px", fontWeight: 600, color: C.navy }}>{row.label}</td>
                        <td style={{ padding: "11px 14px", textAlign: "center", color: C.gray5 }}>{row.v24}</td>
                        <td style={{ padding: "11px 14px", textAlign: "center", color: C.navy, fontWeight: 700 }}>{row.v25}</td>
                        <td style={{ padding: "11px 14px", textAlign: "center", fontWeight: 700, color: d > 0 ? C.red : C.green }}>
                          {d > 0 ? `+${d}` : d}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 16, padding: "12px 14px", background: C.blueLt, borderRadius: 8, border: `1px solid ${C.blueBdr}`, fontSize: 12, color: C.navyMid, lineHeight: 1.6 }}>
                <strong>Fonte:</strong> ANVISA — Relatório de Gestão Out/2025. Dados referentes a processos concluídos no período.
              </div>
            </div>
          )}
          {activePanel.includes("Registrados") && (
            <div>
              <p style={{ fontSize: 13, color: C.gray5, marginBottom: 16, lineHeight: 1.6 }}>
                Acesse o portal DATAVISA para consultar todos os medicamentos registrados no período.
              </p>
              <a href="https://consultas.anvisa.gov.br/#/medicamentos/" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.blue, color: "#fff", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                Acessar DATAVISA <ExternalLink size={13} />
              </a>
            </div>
          )}
          {activePanel.includes("Estatísticas") && (
            <div>
              <p style={{ fontSize: 13, color: C.gray5, marginBottom: 16, lineHeight: 1.6 }}>
                Relatórios gerenciais e estatísticas publicados pela ANVISA.
              </p>
              <a href="https://www.gov.br/anvisa/pt-br/acessoainformacao/dadosabertos" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.blue, color: "#fff", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                Dados Abertos ANVISA <ExternalLink size={13} />
              </a>
            </div>
          )}
          {activePanel.includes("Pipeline") && (
            <div>
              <p style={{ fontSize: 13, color: C.gray5, marginBottom: 16, lineHeight: 1.6 }}>
                Acompanhe o pipeline regulatório — pesquisa clínica, pré-registro e submissões em andamento.
              </p>
              <a href="https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/pesquisa-clinica" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.blue, color: "#fff", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                Pesquisa Clínica ANVISA <ExternalLink size={13} />
              </a>
            </div>
          )}
        </SlidePanel>
      )}
    </div>
  );
}
