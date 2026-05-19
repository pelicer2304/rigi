/**
 * Análise de Tempos ANVISA — Página Standalone
 * "Precision Navy" design: navy #1a2e4a | blue #2563eb
 * Dados fictícios para fins de demonstração.
 */

import { useState } from "react";
import {
  ArrowUpRight, ArrowDownRight, ExternalLink, Info, ChevronLeft
} from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#1a2e4a",
  navyMid: "#2d4a6e",
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
  greenBdr:"#a7f3d0",
  purple:  "#7c3aed",
  purpleLt:"#f5f3ff",
  purpleBdr:"#c4b5fd",
  gray1:   "#f7f9fc",
  gray2:   "#f1f4f8",
  gray3:   "#e2e8f0",
  gray4:   "#94a3b8",
  gray5:   "#475569",
  white:   "#ffffff",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const prd = {
  periodo_analise_meses: 24,
  n_produtos: 155,
  media_tempo_meses: 24,
  priorizados: { n: 55, com_reliance: { n: 5, meses: 10 }, sem_reliance: { n: 50, meses: 13 } },
  ordinarios:  { n: 100, com_reliance: { n: 10, meses: 10 }, sem_reliance: { n: 90, meses: 32 } },
  outliers: {
    mais_rapidos: [
      { empresa: 'Empresa A', medicamento: 'Medicamento X', tempo_meses: 6 },
      { empresa: 'Empresa B', medicamento: 'Medicamento Y', tempo_meses: 7 },
      { empresa: 'Empresa C', medicamento: 'Medicamento Z', tempo_meses: 8 },
      { empresa: 'Empresa D', medicamento: 'Medicamento W', tempo_meses: 9 },
      { empresa: 'Empresa E', medicamento: 'Medicamento V', tempo_meses: 10 },
    ],
    mais_lentos: [
      { empresa: 'Empresa F', medicamento: 'Medicamento U', tempo_meses: 48 },
      { empresa: 'Empresa G', medicamento: 'Medicamento T', tempo_meses: 46 },
      { empresa: 'Empresa H', medicamento: 'Medicamento S', tempo_meses: 44 },
      { empresa: 'Empresa I', medicamento: 'Medicamento R', tempo_meses: 42 },
      { empresa: 'Empresa J', medicamento: 'Medicamento Q', tempo_meses: 40 },
    ],
    tempo_fila:    { media: 23, desvio: 5 },
    tempo_analise: { media: 12, desvio: 6 },
    n_indeferimentos: 'X',
  },
};

const todosDados = [
  { tipo: "Inovador",         v25: 37, v26: 41, reg25: 18,  reg26: 3  },
  { tipo: "Biológico",        v25: 27, v26: 29, reg25: 22,  reg26: 4  },
  { tipo: "Genérico/Similar", v25: 36, v26: 33, reg25: 312, reg26: 48 },
  { tipo: "Clone",            v25: 7,  v26: 8,  reg25: 9,   reg26: 1  },
  { tipo: "Específico",       v25: 22, v26: 24, reg25: 41,  reg26: 7  },
];

const CATEGORIAS_FILTRO = [
  { label: 'Todos',            color: C.navy   },
  { label: 'Inovador',         color: '#7c3aed' },
  { label: 'Biológico',        color: '#0e7490' },
  { label: 'Genérico/Similar', color: C.green  },
  { label: 'Clone',            color: C.amber  },
  { label: 'Específico',       color: C.blue   },
];

// ── Fluxograma node ───────────────────────────────────────────────────────────
function FluxNode({ top, left, label, sub, width = 150 }: {
  top: number; left: number; label: React.ReactNode; sub: string; width?: number;
}) {
  return (
    <div style={{ position: 'absolute', top, left, width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width, height: 65, background: '#FFE566', border: '2px solid #d4a800',
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 11.5, color: '#1a1a1a', textAlign: 'center',
        lineHeight: 1.45, padding: '6px 10px', boxSizing: 'border-box',
        boxShadow: '0 2px 6px rgba(0,0,0,0.13)',
      }}>{label}</div>
      <div style={{ width: 2, height: 10, background: '#999' }} />
      <div style={{
        width: 110, height: 38, background: '#38b2e0', border: '2px solid #1a8fb5',
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 15, color: '#fff', textAlign: 'center',
        boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,0.13)',
      }}>{sub}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TemposAnvisaPage() {
  const [filtroAno, setFiltroAno] = useState("2025");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");

  const dadosFiltrados = filtroCategoria === "Todos"
    ? todosDados
    : todosDados.filter(d => d.tipo === filtroCategoria);

  // Fluxograma geometry
  const YW = 150, YH = 65, BH = 38, VG = 10;
  const nodeH = YH + VG + BH;
  const R0 = 0, R1 = 136, R2 = 296, R3 = 432;
  const cy = (r: number) => r + YH / 2;
  const priMid = (cy(R0) + cy(R1)) / 2;
  const ordMid = (cy(R2) + cy(R3)) / 2;
  const allMid = (priMid + ordMid) / 2;
  const C1 = 95, C2 = 290, C3 = 495;
  const bif12 = (C1 + YW / 2 + C2 - YW / 2) / 2;
  const bif23 = (C2 + YW / 2 + C3 - YW / 2) / 2;
  const W = C3 + YW / 2 + 20;
  const H = R3 + nodeH + 10;

  return (
    <div style={{ minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 14 }}>

      {/* ── Header ── */}
      <header style={{
        background: C.white, borderBottom: `1px solid ${C.gray3}`,
        padding: "13px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12,
            color: C.gray5, textDecoration: "none", fontWeight: 600,
            padding: "5px 10px", borderRadius: 7, border: `1px solid ${C.gray3}`,
            background: C.gray2, transition: "all .15s",
          }}>
            <ChevronLeft size={13} /> Dashboard
          </a>
          <div style={{ width: 1, height: 20, background: C.gray3 }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: -.5 }}>
            Rigi<span style={{ color: C.blue }}>Blick</span>
          </div>
          <div style={{ fontSize: 11, color: C.gray4 }}>/ Análise de Tempos ANVISA</div>
        </div>

      </header>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Page title ── */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: 0 }}>Análise de Tempos da ANVISA</h1>
          <p style={{ fontSize: 13, color: C.gray4, margin: "4px 0 0" }}>
            Monitoramento dos prazos médios de aprovação por categoria · Atualizado Out/2025
          </p>
        </div>

        {/* ── Intro callout ── */}
        <div style={{
          fontSize: 14, fontWeight: 600, color: C.navy, lineHeight: 1.7,
          borderLeft: `4px solid ${C.blue}`, paddingLeft: 16,
          background: C.blueLt, borderRadius: "0 8px 8px 0", padding: "14px 20px 14px 18px",
        }}>
          Aqui você encontrará o detalhamento de tempo e número de processos realizados pela ANVISA — gerais e por categoria regulatória.
        </div>

        {/* ── Tabela comparativa ── */}
        <div style={{ background: C.white, border: `1px solid ${C.gray3}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.gray3}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>
              Análise de Tempos e Registros por Categoria Regulatória
            </span>
            {/* Filtro de ano — aplicado somente a esta tabela */}
            <div style={{ display: "flex", gap: 6 }}>
              {["2023", "2024", "2025"].map(a => (
                <button key={a} onClick={() => setFiltroAno(a)} style={{
                  padding: "5px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", border: `1px solid ${filtroAno === a ? C.blue : C.gray3}`,
                  background: filtroAno === a ? C.blue : C.white,
                  color: filtroAno === a ? "#fff" : C.gray5,
                  transition: "all .15s",
                }}>{a}</button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.navy }}>
                <th rowSpan={2} style={{ padding: "12px 18px", textAlign: "left", fontSize: 12, color: "#fff", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,.15)", verticalAlign: "middle", minWidth: 160 }}>
                  Categoria Regulatória
                </th>
                <th colSpan={2} style={{ padding: "10px 18px", textAlign: "center", fontSize: 12, color: "#93c5fd", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,.15)", borderBottom: "1px solid rgba(255,255,255,.15)" }}>
                  ⏱ Tempo Médio de Aprovação
                </th>
                <th rowSpan={2} style={{ padding: "12px 18px", textAlign: "center", fontSize: 12, color: "#fff", fontWeight: 700, borderRight: "1px solid rgba(255,255,255,.15)", verticalAlign: "middle" }}>
                  Tendência
                </th>
                <th colSpan={2} style={{ padding: "10px 18px", textAlign: "center", fontSize: 12, color: "#93c5fd", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,.15)" }}>
                  📦 Medicamentos Registrados
                </th>
              </tr>
              <tr style={{ background: C.navyMid }}>
                <th style={{ padding: "9px 18px", textAlign: "center", fontSize: 11, color: "#cbd5e1", fontWeight: 600, borderRight: "1px solid rgba(255,255,255,.1)" }}>2025</th>
                <th style={{ padding: "9px 18px", textAlign: "center", fontSize: 11, color: "#cbd5e1", fontWeight: 600, borderRight: "1px solid rgba(255,255,255,.15)" }}>Mês / 2026</th>
                <th style={{ padding: "9px 18px", textAlign: "center", fontSize: 11, color: "#cbd5e1", fontWeight: 600, borderRight: "1px solid rgba(255,255,255,.1)" }}>2025</th>
                <th style={{ padding: "9px 18px", textAlign: "center", fontSize: 11, color: "#cbd5e1", fontWeight: 600 }}>Mês / 2026</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((row, i) => {
                const d = row.v26 - row.v25;
                return (
                  <tr key={row.tipo} style={{ background: i % 2 === 0 ? C.white : C.gray1, borderBottom: `1px solid ${C.gray3}` }}>
                    <td style={{ padding: "14px 18px", fontWeight: 700, color: C.navy, borderRight: `1px solid ${C.gray3}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: C.blue, flexShrink: 0 }} />
                        {row.tipo}
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "center", borderRight: `1px solid ${C.gray3}` }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{row.v25}<span style={{ fontSize: 11, color: C.gray4, fontWeight: 400 }}> m</span></span>
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "center", borderRight: `1px solid ${C.gray3}` }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{row.v26}<span style={{ fontSize: 11, color: C.gray4, fontWeight: 400 }}> m</span></span>
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "center", borderRight: `1px solid ${C.gray3}` }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 13, color: d > 0 ? C.red : d < 0 ? C.green : C.gray4 }}>
                        {d > 0 ? <ArrowUpRight size={14} /> : d < 0 ? <ArrowDownRight size={14} /> : null}
                        {d > 0 ? `+${d}m` : d < 0 ? `${d}m` : "Estável"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "center", borderRight: `1px solid ${C.gray3}` }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{row.reg25}</span>
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{row.reg26}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "10px 18px", background: C.gray2, borderTop: `1px solid ${C.gray3}`, fontSize: 12, color: C.gray4, display: "flex", alignItems: "center", gap: 6 }}>
            <Info size={12} color={C.gray4} /> Dados fictícios para fins de demonstração.
          </div>
        </div>

        {/* ── Filtro por categoria (visual only — aplicado ao fluxograma) ── */}
        <div style={{ background: C.white, borderRadius: 12, padding: "16px 22px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", border: `1px solid ${C.gray3}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.gray4, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>
            Filtrar Fluxograma por Categoria Regulatória
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIAS_FILTRO.map(({ label, color }, i) => (
              <button key={label} style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                cursor: "default", border: `2px solid ${color}`,
                background: i === 0 ? color : C.white,
                color: i === 0 ? "#fff" : color,
                opacity: 0.85,
              }}>{label}</button>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: C.gray4, display: "flex", alignItems: "center", gap: 5 }}>
            <Info size={11} color={C.gray4} /> Filtro funcional em desenvolvimento.
          </div>
        </div>

        {/* ── Fluxograma ── */}
        <div style={{ background: C.white, borderRadius: 14, padding: "28px 28px 28px", boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: `1px solid ${C.gray3}`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Distribuição de Processos — Priorizados × Ordinários × Reliance</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.gray5 }}>
                  <div style={{ width: 16, height: 16, background: "#FFE566", border: "2px solid #d4a800", borderRadius: 3 }} />
                  Número de processos (somente deferidos)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.gray5 }}>
                  <div style={{ width: 16, height: 16, background: "#38b2e0", border: "2px solid #1a8fb5", borderRadius: 3 }} />
                  Tempo Médio (meses)
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, background: C.blueLt, border: `1.5px solid ${C.blueBdr}`, borderRadius: 8, padding: "6px 16px", whiteSpace: "nowrap" }}>
              📅 Período de análise: {prd.periodo_analise_meses} meses
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <div style={{ position: "relative", width: W, height: H }}>
              <svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "visible" }}>
                {/* Main → bifurcation */}
                <line x1={C1 + YW/2} y1={allMid} x2={bif12} y2={allMid} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                <line x1={bif12} y1={priMid} x2={bif12} y2={ordMid} stroke="#aaa" strokeWidth="2"/>
                <line x1={bif12} y1={priMid} x2={C2 - YW/2} y2={priMid} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                <line x1={bif12} y1={ordMid} x2={C2 - YW/2} y2={ordMid} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                {/* Priorizados → reliance */}
                <line x1={C2 + YW/2} y1={priMid} x2={bif23} y2={priMid} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                <line x1={bif23} y1={cy(R0)} x2={bif23} y2={cy(R1)} stroke="#aaa" strokeWidth="2"/>
                <line x1={bif23} y1={cy(R0)} x2={C3 - YW/2} y2={cy(R0)} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                <line x1={bif23} y1={cy(R1)} x2={C3 - YW/2} y2={cy(R1)} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                {/* Ordinários → reliance */}
                <line x1={C2 + YW/2} y1={ordMid} x2={bif23} y2={ordMid} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                <line x1={bif23} y1={cy(R2)} x2={bif23} y2={cy(R3)} stroke="#aaa" strokeWidth="2"/>
                <line x1={bif23} y1={cy(R2)} x2={C3 - YW/2} y2={cy(R2)} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                <line x1={bif23} y1={cy(R3)} x2={C3 - YW/2} y2={cy(R3)} stroke="#aaa" strokeWidth="2" strokeDasharray="5,3"/>
                {/* Divider between priorizados and ordinários */}
                <line x1={C2 - 10} y1={(R1 + nodeH + R2) / 2} x2={W - 10} y2={(R1 + nodeH + R2) / 2} stroke={C.gray3} strokeWidth="1.5" strokeDasharray="6,4"/>
              </svg>

              {/* Nodes */}
              <FluxNode top={allMid - YH / 2} left={C1 - YW / 2}
                label={<>N produtos registrados<br/><span style={{ fontSize: 20, lineHeight: 1.2 }}>{prd.n_produtos}</span></>}
                sub={`${prd.media_tempo_meses} m`}
              />
              <FluxNode top={priMid - YH / 2} left={C2 - YW / 2}
                label={<>Nº Priorizados<br/><span style={{ fontSize: 20, lineHeight: 1.2 }}>{prd.priorizados.n}</span></>}
                sub={`${prd.priorizados.com_reliance.meses} m`}
              />
              <FluxNode top={ordMid - YH / 2} left={C2 - YW / 2}
                label={<>Nº Ordinários<br/><span style={{ fontSize: 20, lineHeight: 1.2 }}>{prd.ordinarios.n}</span></>}
                sub={`${prd.ordinarios.sem_reliance.meses} m`}
              />
              <FluxNode top={R0} left={C3 - YW / 2}
                label={<>Com Reliance<br/><span style={{ fontSize: 18, lineHeight: 1.2 }}>{prd.priorizados.com_reliance.n}</span></>}
                sub={`${prd.priorizados.com_reliance.meses} meses`}
              />
              <FluxNode top={R1} left={C3 - YW / 2}
                label={<>Sem Reliance<br/><span style={{ fontSize: 18, lineHeight: 1.2 }}>{prd.priorizados.sem_reliance.n}</span></>}
                sub={`${prd.priorizados.sem_reliance.meses} meses`}
              />
              <FluxNode top={R2} left={C3 - YW / 2}
                label={<>Com Reliance<br/><span style={{ fontSize: 18, lineHeight: 1.2 }}>{prd.ordinarios.com_reliance.n}</span></>}
                sub={`${prd.ordinarios.com_reliance.meses} meses`}
              />
              <FluxNode top={R3} left={C3 - YW / 2}
                label={<>Sem Reliance<br/><span style={{ fontSize: 18, lineHeight: 1.2 }}>{prd.ordinarios.sem_reliance.n}</span></>}
                sub={`${prd.ordinarios.sem_reliance.meses} meses`}
              />

              {/* Labels */}
              <div style={{ position: "absolute", left: C2 - YW / 2 - 60, top: priMid - 10, fontSize: 10, fontWeight: 700, color: C.amber, textTransform: "uppercase", letterSpacing: 0.5, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Priorizados</div>
              <div style={{ position: "absolute", left: C2 - YW / 2 - 60, top: ordMid - 10, fontSize: 10, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 0.5, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Ordinários</div>
            </div>
          </div>
        </div>

        {/* ── Processos Indeferidos ── */}
        <div style={{ background: C.white, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", border: `1.5px solid ${C.redBdr}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: C.redLt, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>✕</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.red }}>Processos Indeferidos</div>
                <div style={{ fontSize: 12, color: C.gray4 }}>Total: <strong style={{ color: C.red }}>{prd.outliers.n_indeferimentos}</strong> indeferimentos no período</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.red, background: C.redLt, border: `1px solid ${C.redBdr}`, borderRadius: 20, padding: "4px 12px" }}>
              {prd.outliers.n_indeferimentos} indeferidos
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fef2f2" }}>
                {["Processo", "Empresa", "Medicamento", "Data Decisão", "DHL"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: h === "DHL" ? "center" : "left", fontSize: 12, fontWeight: 700, color: C.red, borderBottom: `1px solid ${C.redBdr}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { processo: "25351.000123/2024-01", empresa: "EMS S.A.", medicamento: "Atorvastatina 40mg", data: "12/03/2025" },
                { processo: "25351.000456/2024-02", empresa: "Eurofarma", medicamento: "Losartana 50mg", data: "28/01/2025" },
                { processo: "25351.000789/2024-03", empresa: "Hypermarcas", medicamento: "Omeprazol 20mg", data: "05/11/2024" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 2 ? `1px solid ${C.redLt}` : "none", background: i % 2 === 0 ? C.white : "#fff5f5" }}>
                  <td style={{ padding: "12px 14px", fontSize: 12, fontFamily: "monospace", color: C.navy, fontWeight: 600 }}>{row.processo}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: C.navy }}>{row.empresa}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: C.gray5 }}>{row.medicamento}</td>
                  <td style={{ padding: "12px 14px", fontSize: 12, color: C.gray4 }}>{row.data}</td>
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    <button
                      onClick={() => window.location.href = `/dhl/${row.processo.replace(/\//g, '-')}`}
                      style={{ background: C.redLt, border: `1.5px solid ${C.redBdr}`, borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: C.red, cursor: "pointer" }}
                    >
                      DHL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Tabela Reliance ── */}
        <div style={{ background: C.white, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.06)", border: `1px solid ${C.gray3}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 10 }}>🔗 Processos com Reliance</div>
          <div style={{ fontSize: 13, color: C.gray5, marginBottom: 16, lineHeight: 1.6, padding: "10px 14px", background: C.blueLt, borderRadius: 8, borderLeft: `3px solid ${C.blue}` }}>
            Processos que obtiveram Reliance, na média, são analisados/aprovados <strong>X meses antes</strong> dos processos que seguem análise ordinária.
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.navy }}>
                <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#fff", borderRight: "1px solid rgba(255,255,255,0.15)" }}>Total de Processos com Reliance</th>
                <th style={{ padding: "10px 18px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#fff", borderRight: "1px solid rgba(255,255,255,0.15)" }}>Anuídos</th>
                <th style={{ padding: "10px 18px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>Não Anuídos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "14px 18px", fontSize: 22, fontWeight: 800, color: C.navy, borderRight: `1px solid ${C.gray3}` }}>15</td>
                <td style={{ padding: "14px 18px", fontSize: 22, fontWeight: 800, color: C.green, textAlign: "center", borderRight: `1px solid ${C.gray3}` }}>10</td>
                <td style={{ padding: "14px 18px", fontSize: 22, fontWeight: 800, color: C.red, textAlign: "center" }}>5</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dev note: reliance click */}
        <div style={{ padding: "10px 16px", background: C.amberLt, border: `1.5px dashed ${C.amber}`, borderRadius: 8, fontSize: 12, color: "#92400e" }}>
          💡 <strong>NOTA ao desenvolvedor:</strong> Ao clicar nos números da tabela acima (Total, Anuídos ou Não Anuídos), abrir modal ou painel lateral exibindo a lista com os números dos processos com Reliance correspondentes.
        </div>

        {/* ── Cards Fila / Análise / Indeferimentos ── */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Tempo de Fila",    val: `${prd.outliers.tempo_fila.media} meses`,    desvio: prd.outliers.tempo_fila.desvio,    color: C.purple, bdr: C.purpleBdr, bg: C.purpleLt },
            { label: "Tempo de Análise", val: `${prd.outliers.tempo_analise.media} meses`, desvio: prd.outliers.tempo_analise.desvio, color: C.purple, bdr: C.purpleBdr, bg: C.purpleLt },

          ].map(({ label, val, desvio, color, bdr, bg }) => (
            <div key={label} style={{ flex: 1, minWidth: 200, background: C.white, border: `1.5px solid ${bdr}`, borderRadius: 10, padding: "16px 22px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ color, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
              {desvio != null && (
                <div style={{ fontSize: 12, color: C.gray4, marginTop: 2 }}>± {desvio} meses (desvio padrão)</div>
              )}

            </div>
          ))}
        </div>

        {/* ── Outliers ── */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 16, borderBottom: `2px solid ${C.navy}`, paddingBottom: 8 }}>
            📈 Outliers / Range
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Mais Rápidos */}
            <div style={{ background: C.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1.5px solid #86efac" }}>
              <div style={{ background: "#dcfce7", padding: "12px 18px", fontWeight: 700, color: "#15803d", fontSize: 13 }}>
                ⚡ 5 Mais Rápidos — tempo do processo total
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f0fdf4" }}>
                    {["#", "Empresa", "Medicamento", "Tempo", "DHL"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: h === "Tempo" || h === "DHL" ? "center" : "left", fontSize: 12, color: "#15803d", fontWeight: 700, borderBottom: "1px solid #bbf7d0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prd.outliers.mais_rapidos.map((item, i) => (
                    <tr key={i} style={{ borderBottom: i < 4 ? "1px solid #dcfce7" : "none", background: i % 2 === 0 ? C.white : "#f0fdf4" }}>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#15803d", fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.navy, fontWeight: 600 }}>{item.empresa}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.gray5 }}>{item.medicamento}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, fontSize: 14, color: "#15803d" }}>{item.tempo_meses}m</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <ExternalLink size={14} color="#15803d" style={{ cursor: "pointer" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mais Lentos */}
            <div style={{ background: C.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.07)", border: "1.5px solid #fca5a5" }}>
              <div style={{ background: "#fee2e2", padding: "12px 18px", fontWeight: 700, color: "#991b1b", fontSize: 13 }}>
                🐢 5 Mais Lentos — tempo do processo total
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fff7f7" }}>
                    {["#", "Empresa", "Medicamento", "Tempo", "DHL"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: h === "Tempo" || h === "DHL" ? "center" : "left", fontSize: 12, color: "#991b1b", fontWeight: 700, borderBottom: "1px solid #fecaca" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prd.outliers.mais_lentos.map((item, i) => (
                    <tr key={i} style={{ borderBottom: i < 4 ? "1px solid #fee2e2" : "none", background: i % 2 === 0 ? C.white : "#fff7f7" }}>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "#991b1b", fontWeight: 700 }}>{i + 1}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.navy, fontWeight: 600 }}>{item.empresa}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.gray5 }}>{item.medicamento}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, fontSize: 14, color: "#991b1b" }}>{item.tempo_meses}m</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <ExternalLink size={14} color="#991b1b" style={{ cursor: "pointer" }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer disclaimer ── */}
        <div style={{ padding: "12px 16px", background: C.gray2, borderRadius: 8, fontSize: 12, color: C.gray4, display: "flex", alignItems: "center", gap: 6, borderTop: `1px solid ${C.gray3}` }}>
          <Info size={13} color={C.gray4} />
          Dados fictícios para fins de demonstração. A RIGI AI fornecerá dados reais da ANVISA após integração com as fontes oficiais.
        </div>

      </div>
    </div>
  );
}
