/**
 * Processos Regulatórios — Página Standalone
 * "Precision Navy" design: navy #1a2e4a | blue #2563eb | red #c53030 | amber #d97706 | green #059669
 * DM Sans typography | Stepper timeline | Status-coded urgency indicators
 */

import { useState } from "react";
import {
  Building2, FileText, Clock, CheckCircle2, AlertTriangle,
  ChevronRight, ArrowLeft, RefreshCw, Package, Activity,
  Calendar, Users, Info, ExternalLink, Filter
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
  amberBdr:"#fde68a",
  green:   "#059669",
  greenLt: "#ecfdf5",
  greenBdr:"#a7f3d0",
  gray1:   "#f7f9fc",
  gray2:   "#f1f4f8",
  gray3:   "#e2e8f0",
  gray4:   "#94a3b8",
  gray5:   "#475569",
  white:   "#ffffff",
};

// ── Types ─────────────────────────────────────────────────────────────────────
type UrgencyLevel = "urgente" | "atencao" | "normal" | "vencido";
type StepStatus = "done" | "active" | "pending" | "blocked";

interface RenovacaoItem {
  produto: string;
  processo: string;
  expiracao: string;
  urgency: UrgencyLevel;
  diasRestantes: number;
}

interface TimelineStep {
  label: string;
  date: string | null;
  status: StepStatus;
  detail?: string;
}

interface Processo {
  id: string;
  produto: string;
  tipo: string;
  empresa: string;
  responsavel: string;
  steps: TimelineStep[];
  prazoResposta: string | null;
  diasParado: number;
  alertLevel: UrgencyLevel;
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const VISAO_GERAL = {
  totalRegistros: 130,
  emAnalise: 25,
  posRegistro: 75,
  renovacao2026: 30,
  gestores: ["Claudia Scordamaglia", "Juliana Rocha"],
};

const RENOVACOES: RenovacaoItem[] = [
  { produto: "Produto A", processo: "25351.001234/2026-01", expiracao: "12/03/2026", urgency: "atencao",  diasRestantes: 1  },
  { produto: "Produto B", processo: "25351.005678/2026-02", expiracao: "04/08/2026", urgency: "normal",   diasRestantes: 146 },
  { produto: "Produto C", processo: "25351.009012/2026-03", expiracao: "15/01/2026", urgency: "vencido",  diasRestantes: -55 },
  { produto: "Produto D", processo: "25351.011111/2026-04", expiracao: "30/04/2026", urgency: "atencao",  diasRestantes: 50  },
  { produto: "Produto E", processo: "25351.022222/2026-05", expiracao: "20/06/2026", urgency: "normal",   diasRestantes: 101 },
];

const PROCESSOS: Processo[] = [
  {
    id: "PROC-001",
    produto: "Produto Alpha",
    tipo: "Inovador",
    empresa: "Pfizer",
    responsavel: "Claudia Scordamaglia",
    prazoResposta: "25/03/2026",
    diasParado: 0,
    alertLevel: "urgente",
    steps: [
      { label: "Submissão",      date: "01/02/2025", status: "done",    detail: "Protocolo recebido pela ANVISA" },
      { label: "Análise ANVISA", date: "10/04/2025", status: "done",    detail: "Análise técnica iniciada" },
      { label: "Exigência",      date: "22/05/2025", status: "done",    detail: "Documentação complementar solicitada" },
      { label: "Resposta",       date: "15/06/2025", status: "done",    detail: "Resposta enviada à ANVISA" },
      { label: "Nova análise",   date: "10/09/2025", status: "active",  detail: "Em análise — prazo de resposta: 25/03/2026" },
      { label: "Aprovação",      date: null,         status: "pending", detail: "Aguardando conclusão da análise" },
    ],
  },
  {
    id: "PROC-002",
    produto: "Produto Beta",
    tipo: "Biossimilar",
    empresa: "Pfizer",
    responsavel: "Juliana Rocha",
    prazoResposta: null,
    diasParado: 45,
    alertLevel: "atencao",
    steps: [
      { label: "Submissão",      date: "15/03/2025", status: "done",   detail: "Protocolo recebido" },
      { label: "Análise ANVISA", date: "20/05/2025", status: "done",   detail: "Análise em andamento" },
      { label: "Exigência",      date: "01/07/2025", status: "done",   detail: "2ª exigência emitida" },
      { label: "Resposta",       date: "30/07/2025", status: "active", detail: "Processo parado há 45 dias" },
      { label: "Nova análise",   date: null,         status: "pending" },
      { label: "Aprovação",      date: null,         status: "pending" },
    ],
  },
  {
    id: "PROC-003",
    produto: "Produto Gamma",
    tipo: "Genérico",
    empresa: "Pfizer",
    responsavel: "Claudia Scordamaglia",
    prazoResposta: null,
    diasParado: 0,
    alertLevel: "normal",
    steps: [
      { label: "Submissão",      date: "10/01/2025", status: "done",   detail: "Protocolo recebido" },
      { label: "Análise ANVISA", date: "05/03/2025", status: "done",   detail: "Análise concluída sem exigências" },
      { label: "Exigência",      date: null,         status: "pending", detail: "Sem exigências" },
      { label: "Resposta",       date: null,         status: "pending" },
      { label: "Nova análise",   date: null,         status: "pending" },
      { label: "Aprovação",      date: "14/11/2025", status: "done",   detail: "Registro aprovado" },
    ],
  },
];

// ── Urgency config ────────────────────────────────────────────────────────────
const urgencyConfig = {
  urgente: { dot: C.red,   bg: C.redLt,   bdr: C.redBdr,   label: "Urgente", icon: "🔴" },
  atencao: { dot: C.amber, bg: C.amberLt, bdr: C.amberBdr, label: "Atenção", icon: "🟡" },
  normal:  { dot: C.green, bg: C.greenLt, bdr: C.greenBdr, label: "Normal",  icon: "🟢" },
  vencido: { dot: C.red,   bg: C.redLt,   bdr: C.redBdr,   label: "Vencido", icon: "🔴" },
};

// ── Step status config ────────────────────────────────────────────────────────
const stepConfig: Record<StepStatus, { bg: string; border: string; text: string; ring: string }> = {
  done:    { bg: C.navy,   border: C.navy,   text: C.white,  ring: C.navyMid },
  active:  { bg: C.blue,   border: C.blue,   text: C.white,  ring: "#93c5fd" },
  pending: { bg: C.white,  border: C.gray3,  text: C.gray4,  ring: C.gray3   },
  blocked: { bg: C.redLt,  border: C.red,    text: C.red,    ring: C.redBdr  },
};

// ── Components ────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: C.white, borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.04)",
    overflow: "hidden", ...style
  }}>{children}</div>
);

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div style={{ padding: "12px 18px", background: C.navy, borderBottom: "2px solid rgba(37,99,235,.4)" }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: 0.3 }}>{title}</div>
    {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
  </div>
);

function KpiCard({ icon, label, value, color, bg, bdr }: {
  icon: React.ReactNode; label: string; value: number;
  color: string; bg: string; bdr: string;
}) {
  return (
    <div style={{ flex: 1, background: bg, border: `1px solid ${bdr}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, background: C.white, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.08)", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: C.gray5, marginTop: 2, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function UrgencyBadge({ level, dias }: { level: UrgencyLevel; dias: number }) {
  const cfg = urgencyConfig[level];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, border: `1px solid ${cfg.bdr}`,
      color: cfg.dot, fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: cfg.dot, display: "inline-block", flexShrink: 0 }} />
      {level === "vencido" ? "Vencido" : dias <= 0 ? "Hoje" : `${dias}d`}
    </span>
  );
}

// ── Timeline Stepper ──────────────────────────────────────────────────────────
function TimelineStepper({ steps }: { steps: TimelineStep[] }) {
  const [tooltip, setTooltip] = useState<number | null>(null);

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "flex-start", minWidth: "max-content", padding: "8px 4px 4px" }}>
        {steps.map((step, i) => {
          const cfg = stepConfig[step.status];
          const isLast = i === steps.length - 1;
          const isDone = step.status === "done";
          const isActive = step.status === "active";

          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
              {/* Step node */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 90 }}>
                {/* Circle */}
                <div
                  onMouseEnter={() => setTooltip(i)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: cfg.bg, border: `2px solid ${cfg.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: step.detail ? "pointer" : "default",
                    boxShadow: isActive ? `0 0 0 4px ${cfg.ring}40` : "none",
                    transition: "box-shadow .2s", position: "relative", zIndex: 2,
                    flexShrink: 0
                  }}
                >
                  {isDone && <CheckCircle2 size={14} color={C.white} />}
                  {isActive && <Activity size={14} color={C.white} />}
                  {step.status === "pending" && <span style={{ width: 8, height: 8, borderRadius: 4, background: C.gray3, display: "inline-block" }} />}
                  {step.status === "blocked" && <AlertTriangle size={13} color={C.red} />}

                  {/* Tooltip */}
                  {tooltip === i && step.detail && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                      transform: "translateX(-50%)",
                      background: C.navy, color: "#e2e8f0",
                      fontSize: 11, lineHeight: 1.5, padding: "7px 11px",
                      borderRadius: 7, whiteSpace: "nowrap", zIndex: 20,
                      boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                      pointerEvents: "none"
                    }}>
                      {step.detail}
                      <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${C.navy}` }} />
                    </div>
                  )}
                </div>

                {/* Label */}
                <div style={{ marginTop: 6, fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? C.blue : isDone ? C.navy : C.gray4, textAlign: "center", lineHeight: 1.3, maxWidth: 80 }}>
                  {step.label}
                </div>

                {/* Date */}
                <div style={{ marginTop: 3, fontSize: 10, color: step.date ? C.gray5 : C.gray4, fontWeight: 500, textAlign: "center" }}>
                  {step.date || "—"}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  height: 2, width: 58, marginTop: 15, flexShrink: 0,
                  background: isDone
                    ? `linear-gradient(to right, ${C.navy}, ${steps[i + 1].status === "done" ? C.navy : C.gray3})`
                    : C.gray3,
                  borderRadius: 1
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Alert indicator ───────────────────────────────────────────────────────────
function AlertIndicator({ level, label }: { level: UrgencyLevel; label: string }) {
  const cfg = urgencyConfig[level];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", background: cfg.bg,
      border: `1px solid ${cfg.bdr}`, borderRadius: 8,
      borderLeft: `3px solid ${cfg.dot}`
    }}>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: cfg.dot, display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: C.navy, fontWeight: 500, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.dot }}>{cfg.label}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProcessosPage() {
  const [filtroTipo, setFiltroTipo] = useState<string>("Todos");
  const tipos = ["Todos", "Inovador", "Biossimilar", "Genérico"];
  const processosFiltrados = filtroTipo === "Todos"
    ? PROCESSOS
    : PROCESSOS.filter(p => p.tipo === filtroTipo);

  return (
    <div style={{ minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%)`,
        padding: "16px 32px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 38, height: 38, background: "rgba(37,99,235,.3)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(37,99,235,.5)" }}>
            <Activity size={19} color="#93c5fd" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -.3 }}>
              Rigi<span style={{ color: "#93c5fd" }}>Blick</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b", marginLeft: 10 }}>/ Processos Regulatórios</span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>Pfizer — Gestão de Processos ANVISA</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "6px 12px" }}>
            <Users size={13} color="#93c5fd" />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{VISAO_GERAL.gestores.join(" · ")}</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 7, padding: "5px 10px" }}>
            Atualizado: {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 40px" }}>

        {/* ── SEÇÃO 1: VISÃO GERAL ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 4, height: 20, background: C.blue, borderRadius: 2 }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: 0 }}>1. Visão Geral de Processos</h2>
          </div>

          {/* KPI row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <KpiCard icon={<Building2 size={18} color={C.navy} />}  label="Total de Registros"    value={VISAO_GERAL.totalRegistros} color={C.navy}  bg={C.gray2}   bdr={C.gray3}   />
            <KpiCard icon={<FileText   size={18} color={C.blue} />}  label="Em análise (ANVISA)"  value={VISAO_GERAL.emAnalise}      color={C.blue}  bg={C.blueLt}  bdr={C.blueBdr} />
            <KpiCard icon={<Package    size={18} color={C.green} />} label="Pós-registro"          value={VISAO_GERAL.posRegistro}    color={C.green} bg={C.greenLt} bdr={C.greenBdr}/>
            <KpiCard icon={<RefreshCw  size={18} color={C.amber} />} label="Renovação em 2026"     value={VISAO_GERAL.renovacao2026}  color={C.amber} bg={C.amberLt} bdr={C.amberBdr}/>
          </div>

          {/* Distribuição visual */}
          <Card style={{ marginBottom: 16 }}>
            <SectionHeader title="Distribuição dos Processos" sub="Proporção por categoria" />
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 12, gap: 2 }}>
                {[
                  { val: VISAO_GERAL.emAnalise,     color: C.blue,  label: "Em análise" },
                  { val: VISAO_GERAL.posRegistro,   color: C.green, label: "Pós-registro" },
                  { val: VISAO_GERAL.renovacao2026, color: C.amber, label: "Renovação" },
                ].map(({ val, color }) => (
                  <div key={color} style={{ flex: val, background: color, borderRadius: 3, transition: "flex .3s" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  { val: VISAO_GERAL.emAnalise,     color: C.blue,  label: "Em análise" },
                  { val: VISAO_GERAL.posRegistro,   color: C.green, label: "Pós-registro" },
                  { val: VISAO_GERAL.renovacao2026, color: C.amber, label: "Renovação" },
                ].map(({ val, color, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />
                    <span style={{ fontSize: 12, color: C.gray5 }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{val}</span>
                    <span style={{ fontSize: 11, color: C.gray4 }}>({Math.round(val / VISAO_GERAL.totalRegistros * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Renovações de Registro */}
          <Card>
            <SectionHeader title="Renovações de Registro em 2026" sub={`${RENOVACOES.length} produtos com renovação prevista`} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.gray2, borderBottom: `1px solid ${C.gray3}` }}>
                    {["Produto", "Nº Processo", "Data de Expiração", "Dias Restantes", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RENOVACOES.sort((a, b) => a.diasRestantes - b.diasRestantes).map((r, i) => (
                    <tr key={r.produto} style={{ background: i % 2 === 0 ? C.white : C.gray2, borderBottom: `1px solid ${C.gray3}`, transition: "background .15s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = C.blueLt; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? C.white : C.gray2; }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: C.navy }}>{r.produto}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: C.gray4 }}>{r.processo}</td>
                      <td style={{ padding: "12px 16px", color: C.gray5, fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={12} color={C.gray4} />
                          {r.expiracao}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: r.diasRestantes < 0 ? C.red : r.diasRestantes <= 60 ? C.amber : C.green }}>
                          {r.diasRestantes < 0 ? `${Math.abs(r.diasRestantes)}d atrás` : r.diasRestantes === 0 ? "Hoje" : `${r.diasRestantes}d`}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <UrgencyBadge level={r.urgency} dias={r.diasRestantes} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── SEÇÃO 2: GESTÃO DE PROCESSOS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 20, background: C.blue, borderRadius: 2 }} />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: 0 }}>2. Gestão de Processos em Andamento</h2>
            </div>
            {/* Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Filter size={13} color={C.gray4} />
              <div style={{ display: "flex", gap: 4 }}>
                {tipos.map(t => (
                  <button key={t} onClick={() => setFiltroTipo(t)} style={{
                    fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20,
                    border: `1px solid ${filtroTipo === t ? C.blue : C.gray3}`,
                    background: filtroTipo === t ? C.blue : C.white,
                    color: filtroTipo === t ? C.white : C.gray5,
                    cursor: "pointer", transition: "all .15s"
                  }}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {processosFiltrados.map(proc => {
              const alertCfg = urgencyConfig[proc.alertLevel];
              const activeStep = proc.steps.find(s => s.status === "active");
              const completedSteps = proc.steps.filter(s => s.status === "done").length;
              const progress = Math.round((completedSteps / proc.steps.length) * 100);

              return (
                <Card key={proc.id}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.gray3}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, background: C.blueLt, border: `1px solid ${C.blueBdr}`, borderRadius: 5, padding: "2px 7px" }}>{proc.tipo}</span>
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: C.gray4 }}>{proc.id}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 2 }}>{proc.produto}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: C.gray4 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={11} /> {proc.responsavel}</span>
                          {activeStep && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Activity size={11} color={C.blue} /> <span style={{ color: C.blue, fontWeight: 600 }}>{activeStep.label}</span></span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                          background: alertCfg.bg, border: `1px solid ${alertCfg.bdr}`,
                          color: alertCfg.dot, display: "flex", alignItems: "center", gap: 5
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: 3, background: alertCfg.dot, display: "inline-block" }} />
                          {alertCfg.label}
                        </span>
                        {proc.prazoResposta && (
                          <span style={{ fontSize: 11, color: C.red, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={11} /> Prazo: {proc.prazoResposta}
                          </span>
                        )}
                        {proc.diasParado > 0 && (
                          <span style={{ fontSize: 11, color: C.amber, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                            <AlertTriangle size={11} /> Parado há {proc.diasParado}d
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: C.gray4 }}>Progresso do processo</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.navy }}>{progress}%</span>
                      </div>
                      <div style={{ height: 5, background: C.gray3, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(to right, ${C.navy}, ${C.blue})`, borderRadius: 3, transition: "width .4s ease" }} />
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div style={{ padding: "14px 18px 10px", background: C.gray1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.gray4, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
                      Linha do Tempo — passe o mouse sobre as etapas para detalhes
                    </div>
                    <TimelineStepper steps={proc.steps} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── SEÇÃO 3: INDICADORES DE PRAZO ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 4, height: 20, background: C.blue, borderRadius: 2 }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: 0 }}>3. Indicadores de Prazo</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Legenda */}
            <Card>
              <SectionHeader title="Sistema de Urgência" sub="Critérios de classificação de prazos" />
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { level: "normal"  as UrgencyLevel, desc: "Prazo confortável — mais de 90 dias",          ex: "Produto B: 146 dias restantes" },
                  { level: "atencao" as UrgencyLevel, desc: "Prazo próximo — entre 30 e 90 dias",           ex: "Produto A: 1 dia restante" },
                  { level: "urgente" as UrgencyLevel, desc: "Prazo crítico — menos de 30 dias ou exigência", ex: "Proc-001: resposta até 25/03/2026" },
                  { level: "vencido" as UrgencyLevel, desc: "Prazo vencido — ação imediata necessária",      ex: "Produto C: vencido há 55 dias" },
                ].map(({ level, desc, ex }) => {
                  const cfg = urgencyConfig[level];
                  return (
                    <div key={level} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 8, borderLeft: `3px solid ${cfg.dot}` }}>
                      <span style={{ width: 10, height: 10, borderRadius: 5, background: cfg.dot, display: "inline-block", flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{cfg.label}</div>
                        <div style={{ fontSize: 11, color: C.gray5 }}>{desc}</div>
                        <div style={{ fontSize: 10, color: C.gray4, marginTop: 2, fontStyle: "italic" }}>Ex: {ex}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Alertas ativos */}
            <Card>
              <SectionHeader title="Alertas Ativos" sub="Processos que requerem atenção imediata" />
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                <AlertIndicator level="urgente" label="PROC-001 — Prazo de resposta à exigência: 25/03/2026" />
                <AlertIndicator level="urgente" label="Produto C — Registro vencido em 15/01/2026" />
                <AlertIndicator level="atencao" label="PROC-002 — Processo parado há 45 dias sem movimentação" />
                <AlertIndicator level="atencao" label="Produto A — Renovação em 12/03/2026 (1 dia restante)" />
                <AlertIndicator level="atencao" label="Produto D — Renovação em 30/04/2026 (50 dias restantes)" />
                <AlertIndicator level="normal"  label="Produto B — Renovação em 04/08/2026 (146 dias restantes)" />

                <div style={{ marginTop: 6, padding: "10px 12px", background: C.blueLt, border: `1px solid ${C.blueBdr}`, borderRadius: 8, fontSize: 11, color: C.navyMid, lineHeight: 1.6 }}>
                  <strong>Nota:</strong> Os alertas são calculados automaticamente com base nas datas de expiração e nos prazos de resposta registrados no sistema.
                </div>
              </div>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
