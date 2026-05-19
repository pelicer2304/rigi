/**
 * DHL — Detalhamento Histórico e de Localização do Processo
 * "Precision Navy" design: navy #1a2e4a | blue #2563eb
 *
 * NOTA AO DESENVOLVEDOR:
 * - Esta página usa dados mockados do produto TRIKAFTA como exemplo.
 * - Para produção: receber o número do processo via parâmetro de rota (:processo)
 *   e buscar os dados reais na API/banco (ANVISA DHL endpoint).
 * - Rota sugerida: /dhl/:processo
 */

import { ChevronLeft, Bell, Clock } from "lucide-react";
import PeticoesTimeline, { type Peticao as PeticaoTimeline } from "@/components/PeticoesTimeline";
import { useState as useStateLocal } from "react";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#1a2e4a",
  navyMid: "#2d4a6e",
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

// ── Types ─────────────────────────────────────────────────────────────────────
type StepStatus = "completed" | "current" | "pending" | "alert";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  dateEnd?: string;
  status: StepStatus;
  badges: { label: string; type: "completed" | "current" | "pending" | "alert" }[];
}

interface Peticao {
  expediente: string;
  protocolo: string;
  assunto: string;
  data: string;
  situacao: string;
  local: string;
  status: StepStatus;
  steps?: TimelineStep[];
}

interface ProductData {
  nome: string;
  principioAtivo: string;
  empresa: string;
  numeroRegularizacao: string;
  dataRegularizacao: string;
  vencimentoRegularizacao: string;
  processo: string;
  expediente?: string;
  categoriaRegulatoria: string;
  medicamentoReferencia: string;
  classeTerapeutica: string;
  apresentacoes: { num: number; apresentacao: string; registro: string; formaFarmaceutica: string; dataPublicacao: string; validade: string; status: string }[];
  steps: TimelineStep[];
  peticoes?: Peticao[];
}

// ── Mock data — VYCRIS (exemplo) ───────────────────────────────────────────
const MOCK_TRIKAFTA: ProductData = {
  nome: "VYCRIS",
  principioAtivo: "SULFATO DE VINCRISTINA",
  empresa: "LABORATORIO QUIMICO FARMACEUTICO BERGAMO LTDA",
  numeroRegularizacao: "106460236",
  dataRegularizacao: "30/09/2024",
  vencimentoRegularizacao: "09/2034",
  processo: "25351.354865/2024-10",
  expediente: "1464776251",
  categoriaRegulatoria: "Similar",
  medicamentoReferencia: "—",
  classeTerapeutica: "ALCALOIDE DA VINCA",
  apresentacoes: [
    { num: 1, apresentacao: "1 MG/ML SOL INJ CT FA VD AMB X 1 ML",    registro: "1064602360015", formaFarmaceutica: "SOLUCAO INJETAVEL", dataPublicacao: "30/09/2024", validade: "24 meses", status: "Ativo" },
    { num: 2, apresentacao: "1 MG/ML SOL INJ CT 5 FA VD AMB X 1 ML",  registro: "1064602360023", formaFarmaceutica: "SOLUCAO INJETAVEL", dataPublicacao: "30/09/2024", validade: "24 meses", status: "Ativo" },
    { num: 3, apresentacao: "1 MG/ML SOL INJ CT 20 FA VD AMB X 1 ML", registro: "1064602360031", formaFarmaceutica: "SOLUCAO INJETAVEL", dataPublicacao: "30/09/2024", validade: "24 meses", status: "Ativo" },
  ],
  steps: [
    {
      id: 1,
      title: "Distribuído para a área responsável",
      description: "Processo protocolado e distribuído para a área técnica responsável pela análise. Assunto: 10490 - SIMILAR - Registro de Produto - CLONE.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "14/06/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 2,
      title: "Aguardando análise",
      description: "Processo na fila aguardando início da análise técnica pela equipe da GGMED.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "02/07/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 3,
      title: "Em análise",
      description: "Análise técnica do dossiê iniciada pela equipe da GGMED.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "16/07/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 4,
      title: "Em exigência",
      description: "Exigência técnica emitida pela ANVISA. Empresa foi notificada para complementação do dossiê.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "12/08/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 5,
      title: "Aguardando análise do cumprimento de exigência",
      description: "Empresa respondeu à exigência. Processo aguarda análise da resposta pela equipe técnica.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "02/09/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 6,
      title: "Em análise do cumprimento de exigência",
      description: "Análise da resposta à exigência em andamento pela equipe técnica da GGMED.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "20/09/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 7,
      title: "Concluída análise",
      description: "Análise técnica concluída com parecer favorável ao deferimento do registro.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "25/09/2024",
      status: "completed",
      badges: [{ label: "Concluído", type: "completed" }],
    },
    {
      id: 8,
      title: "Publicado deferimento",
      description: "Registro deferido e publicado no Diário Oficial da União. RE 3.577 de 26/09/2024 — DOU nº 189 de 30/09/2024.",
      location: "GGMED - Gerência-Geral de Medicamentos",
      date: "30/09/2024",
      status: "completed",
      badges: [{ label: "✓ Deferido", type: "completed" }],
    },
  ],
  peticoes: [
    {
      expediente: "1453293/25-0",
      protocolo: "20250000001302813",
      assunto: "10506 - GENÉRICO - Modificação Pós-Registro - CLONE",
      data: "03/11/2025",
      situacao: "Distribuído para a área responsável",
      local: "GQMED - GERÊNCIA DE AVALIAÇÃO DA QUALIDADE DE MEDICAMENTOS SINTÉTICOS",
      status: "current" as StepStatus,
      steps: [],
    },
    {
      expediente: "1453289/25-1",
      protocolo: "20250000001302811",
      assunto: "10506 - GENÉRICO - Modificação Pós-Registro - CLONE",
      data: "03/11/2025",
      situacao: "Em exigência",
      local: "GQMED - GERÊNCIA DE AVALIAÇÃO DA QUALIDADE DE MEDICAMENTOS SINTÉTICOS",
      status: "alert" as StepStatus,
      steps: [],
    },
    {
      expediente: "1317670/25-6",
      protocolo: "20250000001182220",
      assunto: "10898 - GENÉRICO (CLONE) - Histórico de mudanças de produto com inclusão de modificações exclusiva de HMP",
      data: "02/10/2025",
      situacao: "Em análise",
      local: "GQMED - GERÊNCIA DE AVALIAÇÃO DA QUALIDADE DE MEDICAMENTOS SINTÉTICOS",
      status: "current" as StepStatus,
      steps: [],
    },
    {
      expediente: "0579057/25-3",
      protocolo: "20250000000520099",
      assunto: "12269 - Notificação da alteração de rotulagem",
      data: "29/04/2025",
      situacao: "Anuído",
      local: "CBRES - COORDENAÇÃO DE BULA, ROTULAGEM, REGISTRO SIMPLIFICADO E NOME COMERCIAL",
      status: "completed" as StepStatus,
      steps: [],
    },
    {
      expediente: "0412033/25-8",
      protocolo: "20250000000371044",
      assunto: "10506 - GENÉRICO - Modificação Pós-Registro - CLONE",
      data: "28/03/2025",
      situacao: "Não Anuído",
      local: "GQMED - GERÊNCIA DE AVALIAÇÃO DA QUALIDADE DE MEDICAMENTOS SINTÉTICOS",
      status: "alert" as StepStatus,
      steps: [],
    },
    {
      expediente: "0234891/24-2",
      protocolo: "20240000002109834",
      assunto: "10501 - GENÉRICO - Renovação de Registro",
      data: "15/03/2024",
      situacao: "Deferido",
      local: "GGMED - GERÊNCIA-GERAL DE MEDICAMENTOS",
      status: "completed" as StepStatus,
      steps: [],
    },
  ],
};

// ── Badge component ───────────────────────────────────────────────────────────
function Badge({ label, type }: { label: string; type: "completed" | "current" | "pending" | "alert" }) {
  const styles: Record<string, React.CSSProperties> = {
    completed: { background: C.greenLt, color: C.green, border: `1px solid ${C.greenBdr}` },
    current:   { background: C.blueLt,  color: C.blue,  border: `1px solid ${C.blueBdr}` },
    pending:   { background: C.gray2,   color: C.gray5, border: `1px solid ${C.gray3}` },
    alert:     { background: C.redLt,   color: C.red,   border: `1px solid #fca5a5` },
  };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 12,
      fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const,
      letterSpacing: "0.4px", marginRight: 6, marginTop: 8,
      ...(type === "alert" ? { animation: "blink 1.5s infinite" } : {}),
      ...styles[type],
    }}>
      {label}
    </span>
  );
}

// ── Step icon ─────────────────────────────────────────────────────────────────
function StepIcon({ status, id }: { status: StepStatus; id: number }) {
  const bg: Record<StepStatus, string> = {
    completed: C.green,
    current:   C.blue,
    pending:   C.gray3,
    alert:     C.amber,
  };
  const border: Record<StepStatus, string> = {
    completed: C.green,
    current:   C.blue,
    pending:   "#cbd5e1",
    alert:     C.amber,
  };
  const icon: Record<StepStatus, string> = {
    completed: "✓",
    current:   "◐",
    pending:   String(id),
    alert:     "!",
  };
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: bg[status], border: `3px solid ${border[status]}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: status === "pending" ? 13 : 18,
      fontWeight: 700, color: status === "pending" ? C.gray5 : "#fff",
      flexShrink: 0, marginRight: 20,
      boxShadow: status === "current" ? `0 0 0 4px rgba(37,99,235,.2)` : "0 2px 6px rgba(0,0,0,.1)",
      transition: "box-shadow .3s",
      ...(status === "current" ? { animation: "pulse 2s infinite" } : {}),
    }}>
      {icon[status]}
    </div>
  );
}

// ── Timeline Section component ──────────────────────────────────────────────
const COLLAPSE_AFTER = 5;

function CompactStep({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const dotColor = step.status === "completed" ? C.green : step.status === "current" ? C.blue : step.status === "alert" ? C.amber : C.gray4;
  const lineColor = step.status === "completed" ? C.green : C.gray3;
  return (
    <div style={{ display: "flex", position: "relative", paddingBottom: isLast ? 0 : 0 }}>
      {/* Vertical line */}
      {!isLast && (
        <div style={{ position: "absolute", left: 9, top: 24, width: 2, height: "calc(100% + 0px)", background: lineColor }} />
      )}
      {/* Dot */}
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        background: step.status === "current" ? C.blue : step.status === "completed" ? C.green : C.gray3,
        border: `3px solid ${dotColor}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: "#fff", fontWeight: 800, marginRight: 14, marginTop: 2,
        boxShadow: step.status === "current" ? `0 0 0 4px rgba(37,99,235,.15)` : "none",
        ...(step.status === "current" ? { animation: "pulse 2s infinite" } : {}),
      }}>
        {step.status === "completed" ? "✓" : step.status === "current" ? "◐" : ""}
      </div>
      {/* Row content */}
      <div style={{ flex: 1, paddingBottom: 16 }}>
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", padding: "6px 12px", borderRadius: 8,
            background: step.status === "current" ? C.blueLt : open ? C.gray2 : "transparent",
            border: step.status === "current" ? `1px solid ${C.blueBdr}` : "1px solid transparent",
            transition: "background .15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <span style={{ fontSize: 11, color: C.gray4, fontFamily: "monospace", minWidth: 72, flexShrink: 0 }}>{step.date}</span>
            <span style={{ fontSize: 13, fontWeight: step.status === "current" ? 700 : 600, color: step.status === "current" ? C.blue : C.navy }}>
              {step.title}
            </span>
            {step.status === "current" && <Badge label="Em andamento" type="current" />}
            {step.status === "alert" && <Badge label="Atenção" type="alert" />}
          </div>
          <span style={{ fontSize: 11, color: C.gray4, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
        </div>
        {open && (
          <div style={{ margin: "6px 0 0 0", padding: "12px 14px", background: C.gray1, borderRadius: 8, borderLeft: `3px solid ${dotColor}`, fontSize: 12, color: C.gray5, lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6 }}>{step.description}</div>
            <div style={{ color: C.gray4, fontSize: 11 }}>📍 {step.location}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PeticaoCard({ p }: { p: Peticao }) {
  const [open, setOpen] = useState(false);
  const statusColor = p.status === "current" ? C.blue : p.status === "completed" ? C.green : C.gray4;
  const statusBg = p.status === "current" ? C.blueLt : p.status === "completed" ? C.greenLt : C.gray2;
  const statusBdr = p.status === "current" ? C.blueBdr : p.status === "completed" ? C.greenBdr : C.gray3;
  return (
    <div style={{ border: `1px solid ${statusBdr}`, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", cursor: "pointer",
          background: statusBg,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: C.gray5, fontWeight: 700 }}>{p.expediente}</span>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: statusColor, color: "#fff", fontWeight: 700 }}>
              {p.status === "current" ? "Em andamento" : p.status === "completed" ? "Concluída" : "Pendente"}
            </span>
            <span style={{ fontSize: 11, color: C.gray4, fontFamily: "monospace" }}>📅 {p.data}</span>
          </div>
          <div style={{ fontSize: 12, color: C.navy, fontWeight: 600, lineHeight: 1.4 }}>{p.assunto}</div>
        </div>
        <span style={{ fontSize: 12, color: C.gray4, marginLeft: 12 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "14px 16px", background: C.white, borderTop: `1px solid ${statusBdr}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 12, marginBottom: 14 }}>
            <div><span style={{ color: C.gray4 }}>Protocolo: </span><span style={{ fontFamily: "monospace", color: C.navy }}>{p.protocolo}</span></div>
            <div><span style={{ color: C.gray4 }}>Situação atual: </span><span style={{ color: C.navy, fontWeight: 600 }}>{p.situacao}</span></div>
            <div style={{ gridColumn: "1 / -1" }}><span style={{ color: C.gray4 }}>Local: </span><span style={{ color: C.navy }}>{p.local}</span></div>
          </div>
          {p.steps && p.steps.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gray4, textTransform: "uppercase" as const, letterSpacing: "0.8px", marginBottom: 8 }}>Histórico da petição</div>
              {p.steps.map((s, i) => <CompactStep key={s.id} step={s} isLast={i === (p.steps!.length - 1)} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BulaFollowHeader — DEV: conectar ao sistema de alertas de bula ────────
function BulaFollowHeader() {
  const [seguindo, setSeguindo] = useStateLocal(false);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, textTransform: "uppercase" as const, letterSpacing: "1px" }}>
        Bulas do Produto
      </div>
      {/* DEV: conectar ao sistema de alertas de atualização de bula */}
      <button
        onClick={() => setSeguindo(s => !s)}
        title={seguindo ? "Cancelar alertas de bula" : "Receber atualizações de bula desse produto"}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 600,
          color: seguindo ? "#2563eb" : "#64748b",
          background: seguindo ? "#eff6ff" : "transparent",
          border: `1px solid ${seguindo ? "#2563eb" : "#e2e8f0"}`,
          borderRadius: 8, padding: "6px 12px", cursor: "pointer",
          transition: "all .15s",
        }}
      >
        <Bell size={13} fill={seguindo ? "#2563eb" : "none"} />
        {seguindo ? "Recebendo atualizações" : "Receber atualizações de bula"}
      </button>
    </div>
  );
}

function TimelineSection({ steps: _steps, peticoes }: { steps: TimelineStep[]; peticoes?: Peticao[] }) {
  const [seguindo, setSeguindo] = useStateLocal(false);
  return (
    <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.gray3}`, boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}>
      {/* Header navy */}
      <div style={{ background: C.navy, padding: "16px 28px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" as const, flex: 1 }}>Histórico e Petições</div>
        {peticoes && peticoes.length > 0 && (
          <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, color: "#fff" }}>
            {peticoes.length} {peticoes.length !== 1 ? "petições" : "petição"}
          </div>
        )}
        <button
          onClick={() => setSeguindo(s => !s)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600,
            color: seguindo ? "#93c5fd" : "rgba(255,255,255,.7)",
            background: seguindo ? "rgba(255,255,255,.15)" : "transparent",
            border: `1px solid ${seguindo ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.2)"}`,
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            transition: "all .15s",
          }}
        >
          <Bell size={13} fill={seguindo ? "#93c5fd" : "none"} />
          {seguindo ? "Seguindo" : "Seguir processo"}
        </button>
      </div>

      {/* Cabeçalho das colunas */}
      <div style={{
        display: "grid", gridTemplateColumns: "180px 130px 1fr 220px",
        background: "#f8fafc", borderBottom: `1px solid ${C.gray3}`,
        padding: "0",
      }}>
        {["Expediente", "Data", "Assunto", "Situação Atual"].map((h, i, arr) => (
          <div key={h} style={{
            padding: "10px 16px",
            fontSize: 10, fontWeight: 800, color: C.gray4,
            textTransform: "uppercase" as const, letterSpacing: "0.8px",
            borderRight: i < arr.length - 1 ? `1px solid ${C.gray3}` : "none",
          }}>{h}</div>
        ))}
      </div>

      {/* Linhas de petições */}
      {peticoes && peticoes.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" as const }}>
          {peticoes.map((p, i) => {
            const isLast = i === peticoes!.length - 1;
            const rowBg = p.status === "current" ? "#f0f7ff" : i % 2 === 0 ? C.white : "#fafafa";
            const statusColor = p.status === "current" ? C.blue : p.status === "completed" ? C.green : C.gray4;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "180px 130px 1fr 220px",
                background: rowBg,
                borderBottom: isLast ? "none" : `1px solid ${C.gray3}`,
              }}>
                {/* Expediente */}
                <div style={{ padding: "14px 16px", borderRight: `1px solid ${C.gray3}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: "monospace" }}>{p.expediente}</div>
                </div>
                {/* Data */}
                <div style={{ padding: "14px 16px", borderRight: `1px solid ${C.gray3}` }}>
                  <div style={{ fontSize: 13, color: C.gray5 }}>{p.data}</div>
                </div>
                {/* Assunto */}
                <div style={{ padding: "14px 16px", borderRight: `1px solid ${C.gray3}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, lineHeight: 1.5 }}>{p.assunto}</div>
                </div>
                {/* Situação Atual */}
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{
                    display: "inline-block", width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                    background: statusColor,
                    ...(p.status === "current" ? { animation: "pulse 2s infinite" } : {}),
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: statusColor, lineHeight: 1.4 }}>{p.situacao}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "32px", textAlign: "center" as const, color: C.gray4, fontSize: 13 }}>Nenhuma petição registrada</div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DHL() {
  const data = MOCK_TRIKAFTA;

  // Determina se é DHL de processo não finalizado via query param ?tipo=andamento
  // Chamado pela página de Filas com base na situação do expediente
  const isAndamento = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tipo") === "andamento";

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

      {/* ── Top nav bar ── */}
      <header style={{
        background: isAndamento ? C.blue : C.white,
        borderBottom: isAndamento ? `1px solid #1d4ed8` : `1px solid ${C.gray3}`,
        padding: "13px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20,
        boxShadow: isAndamento ? "0 2px 8px rgba(37,99,235,.3)" : "0 1px 3px rgba(0,0,0,.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/filas" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12,
            color: isAndamento ? "rgba(255,255,255,.85)" : C.gray5, textDecoration: "none", fontWeight: 600,
            padding: "5px 10px", borderRadius: 7,
            border: isAndamento ? "1px solid rgba(255,255,255,.3)" : `1px solid ${C.gray3}`,
            background: isAndamento ? "rgba(255,255,255,.15)" : C.gray2,
          }}>
            <ChevronLeft size={13} /> Filas
          </a>
          <div style={{ width: 1, height: 20, background: C.gray3 }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: isAndamento ? "#fff" : C.navy, letterSpacing: -.5 }}>
            Rigi<span style={{ color: isAndamento ? "#bfdbfe" : C.blue }}>Blick</span>
          </div>
          <div style={{ fontSize: 11, color: isAndamento ? "rgba(255,255,255,.6)" : C.gray4, display: "flex", alignItems: "center", gap: 5 }}>
            / DHL do Processo
            {isAndamento && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.35)", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>
                <Clock size={10} /> EM ANDAMENTO
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12,
            color: isAndamento ? "rgba(255,255,255,.85)" : C.blue, textDecoration: "none", fontWeight: 700,
            padding: "5px 12px", borderRadius: 7,
            border: isAndamento ? "1px solid rgba(255,255,255,.3)" : `1px solid ${C.blueBdr}`,
            background: isAndamento ? "rgba(255,255,255,.15)" : C.blueLt,
          }}>
            🏠 Página Inicial
          </a>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Page title ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔬</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: -.3 }}>Inteligência RIGI AI — Rastreamento Regulatório</div>

          </div>
        </div>

        {/* ── Product header card ── */}
        {isAndamento ? (
          /* ── Card azul — Processo em andamento ── */
          <div style={{ background: `linear-gradient(135deg, ${C.blue} 0%, #1d4ed8 100%)`, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(37,99,235,.35)" }}>
            {/* Barra de acento mais clara */}
            <div style={{ height: 4, background: "linear-gradient(90deg, #93c5fd 0%, #e0f2fe 100%)" }} />
            <div style={{ padding: "24px 28px" }}>

              {/* Título + badge */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 6 }}>Processo em Análise</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "monospace", letterSpacing: -.5 }}>{data.processo}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 6 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.35)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>
                    <Clock size={11} /> EM ANDAMENTO
                  </span>
                </div>
              </div>

              {/* Grid de dados disponíveis */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px 24px", marginBottom: 24 }}>
                {[
                  { label: "Assunto",          value: "GENÉRICO — Registro de Medicamento", mono: false, full: true },
                  { label: "Expediente",        value: "1464776252", mono: true,  full: false },
                  { label: "Empresa",           value: data.empresa,   mono: false, full: false },
                  { label: "Data de Entrada",   value: "05/12/2023",   mono: false, full: false },
                  { label: "Posição na Fila",  value: "1º lugar",     mono: false, full: false },
                  { label: "Prioridade",        value: "Ordinária",    mono: false, full: false },
                ].map(({ label, value, mono, full }) => (
                  <div key={label} style={full ? { gridColumn: "1 / -1" } : {}}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", textTransform: "uppercase" as const, fontWeight: 700, letterSpacing: "0.8px", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "#e0f2fe", fontWeight: 600, fontFamily: mono ? "monospace" : "inherit" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Barra de progresso de etapas */}
              {/* ── Barra de progresso: 4 fases consolidadas ── */}
              {(() => {
                // Status ANVISA real — em produção viria via query param ou API
                const statusAtual = "Em análise do cumprimento de exigência";
                const dataStatusAtual = "31/10/2024";

                // Mapeamento de status ANVISA → fase consolidada (0-based)
                const statusParaFase: Record<string, number> = {
                  "Distribuído para a área responsável": 0,
                  "Aguardando análise do medicamento matriz": 0,
                  "Em análise": 1,
                  "Aguardando análise": 1,
                  "Em exigência": 2,
                  "Aguardando análise do cumprimento de exigência": 2,
                  "Em análise do cumprimento de exigência": 2,
                  "Concluída análise": 3,
                  "Publicado deferimento": 3,
                  "Publicado indeferimento": 3,
                };

                const faseAtual = statusParaFase[statusAtual] ?? 0;

                const fases = [
                  { label: "Entrada",    icon: "📥", cor: "#60a5fa" },
                  { label: "Em Análise", icon: "🔍", cor: "#34d399" },
                  { label: "Exigência",  icon: "⚠️",  cor: "#fbbf24" },
                  { label: "Decisão",   icon: "✅",  cor: "#a78bfa" },
                ];

                return (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 20 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 16 }}>Progresso do Processo</div>

                    {/* Fases */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 16 }}>
                      {fases.map((fase, i) => {
                        const done    = i < faseAtual;
                        const current = i === faseAtual;
                        const pending = i > faseAtual;
                        return (
                          <div key={fase.label} style={{ display: "flex", alignItems: "center", flex: i < fases.length - 1 ? 1 : "none" }}>
                            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8 }}>
                              {/* Círculo */}
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: done ? "rgba(255,255,255,.9)" : current ? fase.cor : "rgba(255,255,255,.12)",
                                border: current ? `2.5px solid ${fase.cor}` : done ? "none" : "2px solid rgba(255,255,255,.25)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: done ? 14 : 16,
                                fontWeight: 800,
                                color: done ? C.blue : current ? "#fff" : "rgba(255,255,255,.35)",
                                boxShadow: current ? `0 0 0 6px ${fase.cor}33, 0 2px 12px rgba(0,0,0,.2)` : done ? "0 2px 8px rgba(0,0,0,.15)" : "none",
                                animation: current ? "pulse 2s infinite" : "none",
                                transition: "all .2s",
                              }}>
                                {done ? "✓" : fase.icon}
                              </div>
                              {/* Label */}
                              <div style={{
                                fontSize: 10, whiteSpace: "nowrap" as const,
                                color: done ? "rgba(255,255,255,.8)" : current ? "#fff" : "rgba(255,255,255,.35)",
                                fontWeight: current ? 800 : done ? 600 : 400,
                                letterSpacing: current ? 0.3 : 0,
                              }}>{fase.label}</div>
                            </div>
                            {/* Conector */}
                            {i < fases.length - 1 && (
                              <div style={{
                                flex: 1, height: 2, marginBottom: 22, margin: "0 6px 22px 6px",
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
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: fases[faseAtual]?.cor ?? "#fff", animation: "pulse 2s infinite", flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{statusAtual}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginLeft: 8 }}>desde {dataStatusAtual}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          /* ── Card navy — Processo finalizado (original) ── */
          <div style={{ background: C.navy, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(26,46,74,.25)" }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${C.blue} 0%, #38bdf8 100%)` }} />
            <div style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 2 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{data.nome}</div>
                {data.medicamentoReferencia !== "Não" && data.medicamentoReferencia && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(251,191,36,.15)", border: "1.5px solid rgba(251,191,36,.5)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: "0.5px", whiteSpace: "nowrap" as const, flexShrink: 0, marginLeft: 12, marginTop: 4 }}>
                    ⭐ Medicamento de Referência
                  </div>
                )}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>{data.principioAtivo}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px 24px" }}>
                {[
                  { label: "Nº do Processo",             value: data.processo,                mono: true },
                  { label: "Expediente",                  value: data.expediente ?? "25351.000456/2023-88", mono: true },
                  { label: "Nº da Regularização",       value: data.numeroRegularizacao,      mono: true },
                  { label: "Data da Regularização",      value: data.dataRegularizacao,        mono: false },
                  { label: "Vencimento da Regularização", value: data.vencimentoRegularizacao,  mono: false },
                  { label: "Empresa Detentora",            value: data.empresa,                  mono: false },
                  { label: "Categoria Regulatória",       value: data.categoriaRegulatoria,     mono: false },
                  { label: "Medicamento de Referência",   value: data.medicamentoReferencia,    mono: false },
                  { label: "Classe Terapêutica",          value: data.classeTerapeutica,        mono: false },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" as const, fontWeight: 700, letterSpacing: "0.8px", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, fontFamily: mono ? "monospace" : "inherit" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Histórico e Petições (PeticoesTimeline) ── */}
        {!isAndamento && (() => {
          const peticoesFormatadas: PeticaoTimeline[] = (data.peticoes ?? []).map((p, i) => ({
            id: String(i + 1),
            expediente: p.expediente,
            data: p.data,
            assunto: p.assunto,
            situacao: p.situacao,
            status: p.status === "completed" ? "aprovado"
                  : p.status === "current"   ? "distribuido"
                  : p.status === "alert"     ? "aguardando"
                  : "aguardando",
          }));
          return <PeticoesTimeline peticoes={peticoesFormatadas} titulo="Histórico e Petições" />;
        })()}

        {/* ── Apresentações do Medicamento ── */}
        {!isAndamento && (
          <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.07)", border: `1px solid ${C.gray3}` }}>
            {/* Header */}
            <div style={{ background: C.navy, padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Apresentações do Medicamento</div>
              <div style={{ marginLeft: "auto", background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, color: "#fff" }}>{data.apresentacoes.length} apresentações</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Nº", "Apresentação", "Nº Registro", "Forma Farmacêutica", "Data Publicação", "Validade", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: C.gray5, textTransform: "uppercase" as const, letterSpacing: "0.6px", borderBottom: `1px solid ${C.gray3}`, whiteSpace: "nowrap" as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.apresentacoes.map((ap, idx) => (
                    <tr key={ap.num} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: `1px solid ${C.gray3}` }}>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.gray5, fontWeight: 700 }}>{ap.num}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: C.navy, fontWeight: 600 }}>{ap.apresentacao}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.gray5, fontFamily: "monospace" }}>{ap.registro}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.gray5 }}>{ap.formaFarmaceutica}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.gray5 }}>{ap.dataPublicacao}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: C.gray5 }}>{ap.validade}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: ap.status === "Ativo" ? "#dcfce7" : "#fee2e2", color: ap.status === "Ativo" ? "#166534" : "#991b1b" }}>{ap.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Bulas do Produto ── */}
        {!isAndamento && (
          <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.07)", border: `1px solid ${C.gray3}` }}>
            {/* Header */}
            <div style={{ background: C.navy, padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📄</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Bulas do Produto</div>
              <button
                style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#bfdbfe", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}
                title="Receber alertas de atualização de bula"
              >
                <Bell size={13} />
                Receber atualizações de bula
              </button>
            </div>
            <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {[
                { tipo: "Bula do Paciente", versao: "3.0", data: "30/09/2024", link: "#" },
                { tipo: "Bula do Profissional de Saúde", versao: "3.0", data: "30/09/2024", link: "#" },
              ].map(b => (
                <div key={b.tipo} style={{ border: `1px solid ${C.gray3}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{b.tipo}</div>
                    <div style={{ fontSize: 11, color: C.gray5 }}>Versão {b.versao} &bull; Publicada em {b.data}</div>
                  </div>
                  <a href={b.link} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: C.blue, background: C.blueLt, border: `1px solid ${C.blueBdr}`, borderRadius: 8, padding: "6px 12px", textDecoration: "none", whiteSpace: "nowrap" as const }}>
                    📅 Ver bula
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Estatísticas do Processo ── */}
        {!isAndamento && (
          <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.07)", border: `1px solid ${C.gray3}` }}>
            {/* Header */}
            <div style={{ background: C.navy, padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>Estatísticas desse Processo</div>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Métricas de tempo com benchmark */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  {
                    label: "Tempo Total do Processo",
                    value: 48, unit: "meses",
                    icon: "⏱",
                    color: C.navy, bg: C.blueLt, bdr: C.blueBdr,
                    mediaCategoria: 36,
                    categoria: "Genérico",
                  },
                  {
                    label: "Tempo de Fila",
                    value: 5, unit: "meses",
                    icon: "🕐",
                    color: C.amber, bg: C.amberLt, bdr: "#fcd34d",
                    mediaCategoria: 8,
                    categoria: "Genérico",
                  },
                  {
                    label: "Tempo de Análise",
                    value: 24, unit: "meses",
                    icon: "🔬",
                    color: C.green, bg: C.greenLt, bdr: C.greenBdr,
                    mediaCategoria: 22,
                    categoria: "Genérico",
                  },
                ].map(({ label, value, unit, icon, color, bg, bdr, mediaCategoria, categoria }) => {
                  const diff = value - mediaCategoria;
                  const isAbove = diff > 0;
                  const isEqual = diff === 0;
                  const diffLabel = isEqual ? "Na média" : `${isAbove ? "+" : ""}${diff}m vs média`;
                  const diffColor = isEqual ? C.gray4 : isAbove ? C.red : C.green;
                  const diffBg   = isEqual ? C.gray2 : isAbove ? C.redLt : C.greenLt;
                  const diffIcon = isEqual ? "→" : isAbove ? "↑" : "↓";
                  return (
                    <div key={label} style={{ background: bg, border: `1.5px solid ${bdr}`, borderRadius: 10, padding: "16px 20px" }}>
                      <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: "0.6px", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color, marginBottom: 10 }}>{value} {unit}</div>
                      {/* Benchmark */}
                      <div style={{ borderTop: `1px solid ${bdr}`, paddingTop: 10 }}>
                        <div style={{ fontSize: 10, color: C.gray4, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Média {categoria}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.gray5 }}>{mediaCategoria} {unit}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 700,
                            color: diffColor,
                            background: diffBg,
                            borderRadius: 6,
                            padding: "2px 8px",
                            whiteSpace: "nowrap" as const,
                          }}>{diffIcon} {diffLabel}</span>
                        </div>
                        {/* Barra comparativa */}
                        <div style={{ marginTop: 8, height: 4, background: "rgba(0,0,0,.08)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${Math.min(100, (Math.min(value, mediaCategoria) / Math.max(value, mediaCategoria)) * 100)}%`,
                            background: color,
                            borderRadius: 4,
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Divisor */}
              <div style={{ height: 1, background: C.gray3, marginBottom: 20 }} />

              {/* Exigências + Priorização */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Exigências */}
                <div style={{ background: C.redLt, border: "1.5px solid #fca5a5", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase" as const, letterSpacing: "0.6px", marginBottom: 6 }}>Quantas Exigências</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: C.red, lineHeight: 1 }}>2</span>
                    <span style={{ fontSize: 13, color: C.red, fontWeight: 600 }}>exigências</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 6 }}>Cumprimento registrado em ambas</div>
                </div>

                {/* Priorização / Reliance */}
                <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase" as const, letterSpacing: "0.6px", marginBottom: 10 }}>Priorização ou Reliance?</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0 }}>✓</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Sim</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: C.green, borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap" as const, flexShrink: 0 }}>PRIORIZAÇÃO</span>
                      <span style={{ fontSize: 12, color: "#166534" }}>RDC XYZ</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: C.blue, borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap" as const, flexShrink: 0 }}>RELIANCE</span>
                      <span style={{ fontSize: 12, color: "#1e40af" }}>Anuído</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer disclaimer ── */}
        <div style={{ padding: "10px 16px", background: C.gray2, borderRadius: 8, fontSize: 12, color: C.gray4, textAlign: "center" as const }}>
          RIGI AI © 2025 — Inteligência Regulatória Automatizada · Dados atualizados periodicamente a partir das fontes oficiais ANVISA
        </div>

      </div>
    </div>
  );
}
