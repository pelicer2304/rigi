/**
 * DHL2 — Detalhamento Histórico e de Localização: Processos em Andamento
 * Design: "Precision Navy" — card azul gradiente, barra de progresso 4 fases
 *
 * NOTA AO DESENVOLVEDOR:
 * - Rota: /dhl2/:processo
 * - Acessado a partir da lista de Filas (botão DHL cinza/contorno)
 * - Não alterar DHL.tsx (processos finalizados)
 */

import { useState } from "react";
import { ChevronLeft, Clock, Bell, ExternalLink } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import PeticoesTimeline, { type Peticao as PeticaoTimeline } from "@/components/PeticoesTimeline";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#1a2e4a",
  blue:    "#2563eb",
  blueLt:  "#eff6ff",
  blueBdr: "#bfdbfe",
  green:   "#059669",
  greenLt: "#d1fae5",
  greenBdr:"#6ee7b7",
  amber:   "#d97706",
  amberLt: "#fef3c7",
  red:     "#dc2626",
  redLt:   "#fee2e2",
  gray1:   "#f7f9fc",
  gray2:   "#f1f4f8",
  gray3:   "#e2e8f0",
  gray4:   "#94a3b8",
  gray5:   "#475569",
  white:   "#ffffff",
};

// ── Mapeamento status ANVISA → fase consolidada (0-based) ─────────────────────
const STATUS_PARA_FASE: Record<string, number> = {
  "Distribuído para a área responsável":          0,
  "Aguardando análise do medicamento matriz":     0,
  "Em análise":                                   1,
  "Aguardando análise":                           1,
  "Em exigência":                                 2,
  "Aguardando análise do cumprimento de exigência": 2,
  "Em análise do cumprimento de exigência":       2,
  "Concluída análise":                            3,
  "Publicado deferimento":                        3,
  "Publicado indeferimento":                      3,
};

const FASES = [
  { label: "Entrada",    icon: "📥", cor: "#60a5fa" },
  { label: "Em Análise", icon: "🔍", cor: "#34d399" },
  { label: "Exigência",  icon: "⚠️",  cor: "#fbbf24" },
  { label: "Decisão",    icon: "✅",  cor: "#a78bfa" },
];

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface PeticaoAndamento {
  expediente: string;
  protocolo: string;
  assunto: string;
  data: string;
  situacao: string;
}

interface ProcessoAndamento {
  processo: string;
  expediente: string;
  assunto: string;
  empresa: string;
  dataEntrada: string;
  posicaoFila: number;
  prioridade: "Ordinária" | "Priorizada";
  fila: string;
  subfila: string;
  statusAtual: string;
  dataStatusAtual: string;
  peticoes: PeticaoAndamento[];
}

// ── Mock de processo em andamento ─────────────────────────────────────────────
// Baseado nos dados reais da fila de Registro — Genéricos e Similares
const MOCK_ANDAMENTO: ProcessoAndamento = {
  processo:        "25351822511202321",
  expediente:      "1464776252",
  assunto:         "GENÉRICO — Registro de Medicamento",
  empresa:         "EMS S.A.",
  dataEntrada:     "05/12/2023",
  posicaoFila:     1,
  prioridade:      "Ordinária",
  fila:            "REGISTRO",
  subfila:         "Genéricos e Similares",
  statusAtual:     "Em análise do cumprimento de exigência",
  dataStatusAtual: "31/10/2024",
  peticoes: [
    {
      expediente:  "1453293/25-0",
      protocolo:   "20250000001302813",
      assunto:     "10506 - GENÉRICO - Modificação Pós-Registro - CLONE",
      data:        "03/11/2025",
      situacao:    "Distribuído para a área responsável",
    },
    {
      expediente:  "1453289/25-1",
      protocolo:   "20250000001302811",
      assunto:     "10506 - GENÉRICO - Modificação Pós-Registro - CLONE",
      data:        "03/11/2025",
      situacao:    "Em exigência",
    },
    {
      expediente:  "1317670/25-6",
      protocolo:   "20250000001182220",
      assunto:     "10898 - GENÉRICO (CLONE) - Histórico de mudanças de produto com inclusão de modificações exclusiva de HMP",
      data:        "02/10/2025",
      situacao:    "Em análise",
    },
    {
      expediente:  "0579057/25-3",
      protocolo:   "20250000000520099",
      assunto:     "12269 - Notificação da alteração de rotulagem",
      data:        "29/04/2025",
      situacao:    "Anuído",
    },
    {
      expediente:  "0412033/25-8",
      protocolo:   "20250000000371044",
      assunto:     "10506 - GENÉRICO - Modificação Pós-Registro - CLONE",
      data:        "28/03/2025",
      situacao:    "Não Anuído",
    },
  ],
};

// ── Barra de progresso das 4 fases ───────────────────────────────────────────
function BarraProgresso({ statusAtual, dataStatusAtual }: { statusAtual: string; dataStatusAtual: string }) {
  const faseAtual = STATUS_PARA_FASE[statusAtual] ?? 0;

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 20 }}>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 16 }}>
        Situação do Processo
      </div>

      {/* Fases */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 16 }}>
        {FASES.map((fase, i) => {
          const done    = i < faseAtual;
          const current = i === faseAtual;
          return (
            <div key={fase.label} style={{ display: "flex", alignItems: "center", flex: i < FASES.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: done ? "rgba(255,255,255,.9)" : current ? fase.cor : "rgba(255,255,255,.12)",
                  border: current ? `2.5px solid ${fase.cor}` : done ? "none" : "2px solid rgba(255,255,255,.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: done ? 14 : 16, fontWeight: 800,
                  color: done ? C.blue : current ? "#fff" : "rgba(255,255,255,.35)",
                  boxShadow: current ? `0 0 0 6px ${fase.cor}33, 0 2px 12px rgba(0,0,0,.2)` : done ? "0 2px 8px rgba(0,0,0,.15)" : "none",
                  animation: current ? "pulse 2s infinite" : "none",
                  transition: "all .2s",
                }}>
                  {done ? "✓" : fase.icon}
                </div>
                <div style={{
                  fontSize: 10, whiteSpace: "nowrap" as const,
                  color: done ? "rgba(255,255,255,.8)" : current ? "#fff" : "rgba(255,255,255,.35)",
                  fontWeight: current ? 800 : done ? 600 : 400,
                  letterSpacing: current ? 0.3 : 0,
                }}>{fase.label}</div>
              </div>
              {i < FASES.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: "0 6px 22px 6px",
                  background: done
                    ? "linear-gradient(90deg, rgba(255,255,255,.7) 0%, rgba(255,255,255,.4) 100%)"
                    : "rgba(255,255,255,.15)",
                  borderRadius: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Status exato atual */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
        borderRadius: 8, padding: "8px 14px",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: FASES[faseAtual]?.cor ?? "#fff", animation: "pulse 2s infinite", flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{statusAtual}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginLeft: 8 }}>desde {dataStatusAtual}</span>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function DHL2() {
  const [, navigate] = useLocation();
  const [seguindo, setSeguindo] = useState(false);

  // Em produção: usar o processo da rota para buscar dados reais
  // const [, params] = useRoute("/dhl2/:processo");
  const data = MOCK_ANDAMENTO;

  // Converter petições para o formato do PeticoesTimeline
  const peticoesFormatadas: PeticaoTimeline[] = data.peticoes.map((p, i) => ({
    id: String(i + 1),
    expediente: p.expediente,
    data: p.data,
    assunto: p.assunto,
    situacao: p.situacao,
    status: "aguardando", // inferirStatus no componente cuida das cores
  }));

  return (
    <div style={{ minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 14 }}>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(37,99,235,.3); }
          50%       { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      {/* ── Header azul ── */}
      <header style={{
        background: C.blue,
        borderBottom: "1px solid #1d4ed8",
        padding: "13px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 2px 8px rgba(37,99,235,.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate("/filas")}
            style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 12,
              color: "rgba(255,255,255,.85)", background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.3)",
              borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontWeight: 600,
            }}
          >
            <ChevronLeft size={13} /> Filas
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.2)" }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -.5 }}>
            Rigi<span style={{ color: "#bfdbfe" }}>Blick</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", gap: 5 }}>
            / DHL do Processo
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.35)",
              borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
            }}>
              <Clock size={10} /> EM ANDAMENTO
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 12,
              color: "rgba(255,255,255,.85)", background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.3)",
              borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontWeight: 700,
            }}
          >
            🏠 Página Inicial
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Page title ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔬</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: -.3 }}>
              Inteligência RIGI AI — Rastreamento Regulatório
            </div>
          </div>
        </div>

        {/* ── Card azul — Processo em andamento ── */}
        <div style={{
          background: `linear-gradient(135deg, ${C.blue} 0%, #1d4ed8 100%)`,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 4px 24px rgba(37,99,235,.35)",
        }}>
          {/* Barra de acento */}
          <div style={{ height: 4, background: "linear-gradient(90deg, #93c5fd 0%, #e0f2fe 100%)" }} />
          <div style={{ padding: "24px 28px" }}>

            {/* Título + badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 6 }}>
                  Processo em Análise
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "monospace", letterSpacing: -.5 }}>
                  {data.processo}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 6 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.35)",
                  borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
                }}>
                  <Clock size={11} /> EM ANDAMENTO
                </span>
                {/* Link para o portal ANVISA */}
                <a
                  href={`https://consultas.anvisa.gov.br/#/saneamentos/?processo=${data.processo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: 10, color: "rgba(255,255,255,.6)", textDecoration: "none",
                    border: "1px solid rgba(255,255,255,.2)", borderRadius: 6, padding: "3px 8px",
                    transition: "all .15s",
                  }}
                >
                  <ExternalLink size={10} /> Ver no portal ANVISA
                </a>
              </div>
            </div>

            {/* Grid de dados */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 24px", marginBottom: 24 }}>
              {[
                { label: "Assunto",         value: data.assunto,       mono: false, full: true  },
                { label: "Expediente",       value: data.expediente,    mono: true,  full: false },
                { label: "Empresa",          value: data.empresa,       mono: false, full: false },
                { label: "Data de Entrada",  value: data.dataEntrada,   mono: false, full: false },
                { label: "Posição na Fila",  value: `${data.posicaoFila}º lugar`, mono: false, full: false },
                { label: "Prioridade",       value: data.prioridade,    mono: false, full: false },
                { label: "Fila",             value: data.fila,          mono: false, full: false },
                { label: "Subfila",          value: data.subfila,       mono: false, full: false },
              ].map(({ label, value, mono, full }) => (
                <div key={label} style={full ? { gridColumn: "1 / -1" } : {}}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", textTransform: "uppercase" as const, fontWeight: 700, letterSpacing: "0.8px", marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: "#e0f2fe", fontWeight: 600, fontFamily: mono ? "monospace" : "inherit" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Barra de progresso */}
            <BarraProgresso statusAtual={data.statusAtual} dataStatusAtual={data.dataStatusAtual} />
          </div>
        </div>

        {/* ── Histórico e Petições ── */}
        <PeticoesTimeline peticoes={peticoesFormatadas} titulo="Histórico e Petições" />

        {/* ── Rodapé ── */}
        <div style={{ textAlign: "center" as const, fontSize: 11, color: C.gray4, paddingBottom: 8 }}>
          RIGI AI © 2025 — Inteligência Regulatória Automatizada · Dados atualizados periodicamente a partir das fontes oficiais ANVISA
        </div>
      </div>
    </div>
  );
}
