/**
 * PeticoesTimeline — Timeline Vertical para Histórico e Petições ANVISA
 *
 * Design: "Regulatory Precision" — IBM Plex Sans + IBM Plex Mono
 * Layout: Cada petição é uma linha independente no eixo temporal.
 *         Datas repetidas quando múltiplas petições foram protocoladas no mesmo dia.
 *         Cores dos nós refletem a situação atual da ANVISA (não o status genérico).
 */

import { motion } from "framer-motion";
import { Bell, Clock, CheckCircle2, XCircle, AlertCircle, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type StatusPeticao =
  | "distribuido"   // Distribuído para a área responsável
  | "em_analise"    // Em análise
  | "exigencia"     // Em exigência
  | "anuido"        // Anuído
  | "nao_anuido"    // Não Anuído
  | "aprovado"      // Deferido / Publicado
  | "indeferido"    // Indeferido / Cancelado
  | "aguardando";   // Outros / desconhecido

export interface Peticao {
  id: string;
  expediente: string;
  data: string; // "DD/MM/AAAA"
  assunto: string;
  situacao: string;
  status: StatusPeticao;
}

// ─── Mapeamento situação ANVISA → status visual ───────────────────────────────
// Mapeia fragmentos do texto real da ANVISA para o status visual correto.

function inferirStatus(situacao: string): StatusPeticao {
  const s = situacao.toLowerCase();
  // Não Anuído — verificar antes de "anuído" para evitar falso positivo
  if (s.includes("não anuído") || s.includes("nao anuido") || s.includes("não-anuído")) return "nao_anuido";
  // Anuído
  if (s.includes("anuído") || s.includes("anuido")) return "anuido";
  // Em Exigência
  if (s.includes("exigência") || s.includes("exigencia") || s.includes("cumprimento de exig")) return "exigencia";
  // Deferido / Aprovado
  if (s.includes("deferido") || s.includes("aprovado") || s.includes("renovado") || s.includes("publicado deferimento")) return "aprovado";
  // Indeferido / Cancelado
  if (s.includes("indeferido") || s.includes("cancelado") || s.includes("arquivado")) return "indeferido";
  // Em Análise
  if (s.includes("em análise") || s.includes("em analise") || s.includes("análise técnica") || s.includes("analise tecnica")) return "em_analise";
  // Distribuído
  if (s.includes("distribuído") || s.includes("distribuido") || s.includes("área responsável") || s.includes("area responsavel")) return "distribuido";
  return "aguardando";
}

// ─── Configuração de status → cor/ícone ──────────────────────────────────────

const statusConfig: Record<
  StatusPeticao,
  {
    icon: React.ElementType;
    nodeBg: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    label: string;
  }
> = {
  distribuido: {
    icon: Clock,
    nodeBg: "bg-blue-500",
    dotColor: "bg-blue-500",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    label: "Distribuído",
  },
  em_analise: {
    icon: FileSearch,
    nodeBg: "bg-indigo-600",
    dotColor: "bg-indigo-500",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    label: "Em Análise",
  },
  exigencia: {
    icon: AlertCircle,
    nodeBg: "bg-amber-500",
    dotColor: "bg-amber-400",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    label: "Em Exigência",
  },
  anuido: {
    icon: CheckCircle2,
    nodeBg: "bg-teal-600",
    dotColor: "bg-teal-500",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    label: "Anuído",
  },
  nao_anuido: {
    icon: XCircle,
    nodeBg: "bg-orange-500",
    dotColor: "bg-orange-400",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    label: "Não Anuído",
  },
  aprovado: {
    icon: CheckCircle2,
    nodeBg: "bg-emerald-600",
    dotColor: "bg-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    label: "Deferido",
  },
  indeferido: {
    icon: XCircle,
    nodeBg: "bg-red-600",
    dotColor: "bg-red-500",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    label: "Indeferido",
  },
  aguardando: {
    icon: Clock,
    nodeBg: "bg-slate-400",
    dotColor: "bg-slate-400",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    label: "Aguardando",
  },
};

// ─── Sub-componente: Nó do eixo ───────────────────────────────────────────────

function TimelineNode({ status }: { status: StatusPeticao }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full shadow-sm",
          cfg.nodeBg,
          "w-8 h-8"
        )}
      >
        <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
}

// ─── Sub-componente: Badge de situação ───────────────────────────────────────

function SituacaoBadge({ status, situacao }: { status: StatusPeticao; situacao: string }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap",
        cfg.badgeBg,
        cfg.badgeText
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dotColor)} />
      {situacao}
    </span>
  );
}

// ─── Sub-componente: Linha de petição (independente) ─────────────────────────

function PeticaoRow({
  peticao,
  index,
  isLast,
}: {
  peticao: Peticao;
  index: number;
  isLast: boolean;
}) {
  // Inferir status a partir da situação textual real da ANVISA
  const status = inferirStatus(peticao.situacao);

  return (
    <div className="flex gap-0 items-stretch">
      {/* Coluna esquerda: data */}
      <div className="w-28 flex-shrink-0 pt-3 pr-4 text-right">
        <span
          className="text-[12px] font-medium text-slate-500 leading-tight block whitespace-nowrap"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          {peticao.data}
        </span>
      </div>

      {/* Coluna central: nó + linha vertical */}
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        <div className="pt-2.5">
          <TimelineNode status={status} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-slate-200 mt-2 mb-0" />
        )}
      </div>

      {/* Coluna direita: dados da petição */}
      <div className={cn("flex-1 pl-4", isLast ? "pb-2" : "pb-5")}>
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="grid items-start gap-x-4 py-2.5 hover:bg-slate-50 transition-colors rounded px-2 -mx-2"
          style={{ gridTemplateColumns: "160px 1fr 220px" }}
        >
          {/* Expediente */}
          <span
            className="font-mono text-[12.5px] font-medium text-slate-800 tracking-tight truncate pt-0.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {peticao.expediente}
          </span>

          {/* Assunto */}
          <span className="text-[12.5px] text-slate-600 leading-snug">
            {peticao.assunto}
          </span>

          {/* Situação Atual */}
          <div className="flex justify-start pt-0.5">
            <SituacaoBadge status={status} situacao={peticao.situacao} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface PeticoesTimelineProps {
  peticoes?: Peticao[];
  titulo?: string;
}

export default function PeticoesTimeline({
  peticoes = [],
  titulo = "Histórico e Petições",
}: PeticoesTimelineProps) {
  const total = peticoes.length;

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-[14px] font-semibold text-slate-800 tracking-tight uppercase">
          {titulo}
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-800 text-white text-[12px] font-semibold">
            {total} {total === 1 ? "petição" : "petições"}
          </span>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all">
            <Bell className="w-3.5 h-3.5" />
            Seguir processo
          </button>
        </div>
      </div>

      {/* Cabeçalho das colunas */}
      <div className="flex gap-0 items-center border-b border-slate-100 bg-slate-50/50">
        <div className="w-28 flex-shrink-0" />
        <div className="w-10 flex-shrink-0" />
        <div
          className="flex-1 pl-4 pr-2 py-2 grid gap-x-4"
          style={{ gridTemplateColumns: "160px 1fr 220px" }}
        >
          <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
            Expediente
          </span>
          <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
            Assunto
          </span>
          <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">
            Situação Atual
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pt-4 pb-2">
        {/* Linha de entrada no topo */}
        <div className="flex gap-0">
          <div className="w-28 flex-shrink-0" />
          <div className="flex flex-col items-center w-10 flex-shrink-0">
            <div className="w-px h-3 bg-slate-200" />
          </div>
        </div>

        {total > 0 ? (
          peticoes.map((p, idx) => (
            <PeticaoRow
              key={p.id}
              peticao={p}
              index={idx}
              isLast={idx === total - 1}
            />
          ))
        ) : (
          <div className="flex gap-0">
            <div className="w-28 flex-shrink-0" />
            <div className="w-10 flex-shrink-0" />
            <div className="flex-1 pl-4 py-8 text-[13px] text-slate-400 italic">
              Nenhuma petição registrada
            </div>
          </div>
        )}

        {/* Seta final do eixo */}
        <div className="flex gap-0 -mt-2">
          <div className="w-28 flex-shrink-0" />
          <div className="flex flex-col items-center w-10 flex-shrink-0">
            <div className="w-px h-4 bg-slate-200" />
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "6px solid #CBD5E1",
              }}
            />
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-[11px] text-slate-400">
          Dados obtidos via ANVISA · Atualizado em 26/03/2026
        </p>
      </div>
    </div>
  );
}
