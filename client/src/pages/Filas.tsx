/**
 * RigiBlick — Painel de Filas ANVISA
 * Design: "Precision Navy" — Navy #1a2e4a | Blue #2563eb | DM Sans typography
 * Dados baseados na estrutura real do portal consultas.anvisa.gov.br
 */

import { useState } from "react";
import type { ElementType } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft, ExternalLink, Filter, X, ChevronDown,
  Activity, Pill, Building2, FlaskConical, Clock, TrendingUp, AlertTriangle
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────────────────
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

// ── Estrutura de dados: Áreas, Filas e Subfilas ─────────────────────────────────
type Subfila = { id: string; nome: string };
type Fila = { id: string; nome: string; subfilas: Subfila[] };
type Area = { id: string; nome: string; icone: ElementType; filas: Fila[] };

// Filas reais conforme portal consultas.anvisa.gov.br (capturado em mar/2026)
// Fila = lista menor (10 itens) | Subfila = lista maior (categorias de produto)
const SUBFILAS_MEDICAMENTOS: Subfila[] = [
  { id: "clones", nome: "Clones" },
  { id: "dinamizados", nome: "Dinamizados" },
  { id: "dinamizados-doencas-raras", nome: "Dinamizados - Doenças raras (RDC 205/2017)" },
  { id: "dinamizados-priorizados", nome: "Dinamizados - Priorizados (RDC 1.001/2025)" },
  { id: "especificos", nome: "Específicos" },
  { id: "especificos-doencas-raras", nome: "Específicos - Doenças raras (RDC 205/2017)" },
  { id: "especificos-priorizados", nome: "Específicos - Priorizados (RDC 1.001/2025)" },
  { id: "fitoterapicos", nome: "Fitoterapícos" },
  { id: "fitoterapicos-doencas-raras", nome: "Fitoterapícos - Doenças raras (RDC 205/2017)" },
  { id: "fitoterapicos-priorizados", nome: "Fitoterapícos - Priorizados (RDC 1.001/2025)" },
  { id: "gases-medicinais", nome: "Gases Medicinais" },
  { id: "genericos-similares", nome: "Genéricos e Similares" },
  { id: "genericos-similares-priorizados", nome: "Genéricos e Similares - Priorizados (RDC 1.001/2025)" },
  { id: "inovadores", nome: "Inovadores" },
  { id: "inovadores-priorizados", nome: "Inovadores - Priorizados (RDC 1.001/2025)" },
  { id: "novos", nome: "Novos" },
  { id: "novos-doencas-raras", nome: "Novos - Doenças raras (RDC205/2017)" },
  { id: "novos-priorizados", nome: "Novos - Priorizados (RDC 1.001/2025)" },
  { id: "produtos-terapia-avancada", nome: "PRODUTOS DE TERAPIA AVANÇADA" },
  { id: "produtos-biologicos", nome: "Produtos Biológicos" },
  { id: "produtos-biologicos-doencas-raras", nome: "Produtos Biológicos - Doenças raras (RDC 205/2017)" },
  { id: "produtos-biologicos-priorizados", nome: "Produtos Biológicos - Priorizados (RDC 1.001/2025)" },
  { id: "produtos-cannabis", nome: "Produtos de Cannabis" },
  { id: "radiofarmacos", nome: "Radiofarmacos" },
  { id: "radiofarmacos-doencas-raras", nome: "Radiofarmacos - Doenças raras (RDC 205/2017)" },
  { id: "radiofarmacos-priorizados", nome: "Radiofarmacos - Priorizados (RDC 204/2017)" },
];

const AREAS: Area[] = [
  {
    id: "medicamentos",
    nome: "Medicamentos",
    icone: Pill,
    filas: [
      { id: "equivalencia-terapeutica", nome: "EQUIVALÊNCIA TERAPÊUTICA", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "notificados", nome: "NOTIFICADOS", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "pesquisa-clinica", nome: "PESQUISA CLÍNICA", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "procedimento-otimizado", nome: "PROCEDIMENTO OTIMIZADO DE ANÁLISE", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "produtos-terapia-avancada-cbpf", nome: "PRODUTOS DE TERAPIA AVANÇADA - CBPF", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "protocolo-seguranca-eficacia", nome: "PROTOCOLO DE SEGURANÇA E EFICÁCIA", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "pos-registro", nome: "PÓS-REGISTRO", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "registro", nome: "REGISTRO", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "renovacao", nome: "RENOVAÇÃO", subfilas: SUBFILAS_MEDICAMENTOS },
      { id: "rotulagem-nome-comercial", nome: "ROTULAGEM E NOME COMERCIAL", subfilas: SUBFILAS_MEDICAMENTOS },
    ],
  },
  {
    id: "empresas",
    nome: "Empresas",
    icone: Building2,
    filas: [
      {
        id: "afe-ae",
        nome: "AFE / AE",
        subfilas: [
          { id: "ordinaria", nome: "Ordinária" },
          { id: "priorizada", nome: "Priorizada" },
        ],
      },
      {
        id: "cbpf-nacional",
        nome: "CBPF Nacional",
        subfilas: [
          { id: "ordinaria", nome: "Ordinária" },
          { id: "priorizada", nome: "Priorizada" },
        ],
      },
      {
        id: "cbpf-internacional",
        nome: "CBPF Internacional",
        subfilas: [
          { id: "ordinaria", nome: "Ordinária" },
          { id: "priorizada", nome: "Priorizada" },
        ],
      },
    ],
  },
  {
    id: "insumos",
    nome: "Insumos Farmacêuticos",
    icone: FlaskConical,
    filas: [
      {
        id: "registro-ifa",
        nome: "Registro de IFA",
        subfilas: [
          { id: "ordinaria", nome: "Ordinária" },
          { id: "priorizada", nome: "Priorizada" },
        ],
      },
      {
        id: "cbpf-ifa",
        nome: "CBPF de IFA",
        subfilas: [
          { id: "ordinaria", nome: "Ordinária" },
          { id: "priorizada", nome: "Priorizada" },
        ],
      },
    ],
  },
];

// ── Dados de exemplo por área/fila/subfila ─────────────────────────────────────
type FilaItem = {
  posicao: number;
  processo: string;
  dataEntrada: string;
  assunto: string;
  empresa: string;
  categoria?: string;
  priorizado: boolean;
  situacao: "Distribuído para a área responsável" | "Em análise" | "Em exigência" | "Aguardando análise";
};

function gerarDados(area: string, fila: string, subfila: string): FilaItem[] {
  const priorizado = subfila === "priorizada";
  const base: Record<string, FilaItem[]> = {
    "medicamentos-registro": [
      { posicao: 1, processo: "25351822511202321", dataEntrada: "05/12/2023", assunto: "GENÉRICO - Registro de Medicamento", empresa: "EMS S.A.", categoria: "Genérico", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351809991202334", dataEntrada: "30/11/2023", assunto: "GENÉRICO - Registro de Medicamento", empresa: "Eurofarma Laboratórios", categoria: "Genérico", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 3, processo: "25351801421202304", dataEntrada: "28/11/2023", assunto: "SIMILAR - Registro de Medicamento", empresa: "Medley Farmacêutica", categoria: "Similar", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 4, processo: "25351780797202360", dataEntrada: "21/11/2023", assunto: "MEDICAMENTO INOVADOR - Registro", empresa: "Pfizer Brasil", categoria: "Novo", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 5, processo: "25351765432202311", dataEntrada: "15/11/2023", assunto: "BIOLÓGICO - Registro de Medicamento", empresa: "Amgen Brasil", categoria: "Biológico", priorizado, situacao: "Em análise" },
      { posicao: 6, processo: "25351754321202298", dataEntrada: "10/11/2023", assunto: "BIOSSIMILAR - Registro de Medicamento", empresa: "Biocon Biologics", categoria: "Biossimilar", priorizado, situacao: "Em análise" },
      { posicao: 7, processo: "25351743210202287", dataEntrada: "05/11/2023", assunto: "FITOTERÁPICO - Registro de Medicamento", empresa: "Natulab Laboratório", categoria: "Fitoterápico", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 8, processo: "25351732109202276", dataEntrada: "01/11/2023", assunto: "GENÉRICO - Registro de Medicamento", empresa: "Sandoz do Brasil", categoria: "Genérico", priorizado, situacao: "Em exigência" },
    ],
    "medicamentos-pos-registro": [
      { posicao: 1, processo: "25351699887202265", dataEntrada: "20/10/2023", assunto: "GENÉRICO - Alteração Pós-Registro Grau I", empresa: "EMS S.A.", categoria: "Genérico", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351688776202254", dataEntrada: "15/10/2023", assunto: "SIMILAR - Alteração Pós-Registro Grau II", empresa: "Medley Farmacêutica", categoria: "Similar", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351677665202243", dataEntrada: "10/10/2023", assunto: "BIOLÓGICO - Variação Pós-Registro", empresa: "Roche Brasil", categoria: "Biológico", priorizado, situacao: "Aguardando análise" },
      { posicao: 4, processo: "25351666554202232", dataEntrada: "05/10/2023", assunto: "MEDICAMENTO NOVO - Inclusão de Indicação", empresa: "Novartis Brasil", categoria: "Novo", priorizado, situacao: "Em exigência" },
      { posicao: 5, processo: "25351655443202221", dataEntrada: "01/10/2023", assunto: "GENÉRICO - Alteração de Fabricante", empresa: "Eurofarma Laboratórios", categoria: "Genérico", priorizado, situacao: "Distribuído para a área responsável" },
    ],
    "medicamentos-renovacao": [
      { posicao: 1, processo: "25351544332202110", dataEntrada: "15/09/2023", assunto: "GENÉRICO - Renovação de Registro", empresa: "Sandoz do Brasil", categoria: "Genérico", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351533221202099", dataEntrada: "10/09/2023", assunto: "SIMILAR - Renovação de Registro", empresa: "Medley Farmacêutica", categoria: "Similar", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351522110202088", dataEntrada: "05/09/2023", assunto: "BIOLÓGICO - Renovação de Registro", empresa: "AstraZeneca Brasil", categoria: "Biológico", priorizado, situacao: "Aguardando análise" },
      { posicao: 4, processo: "25351511009202077", dataEntrada: "01/09/2023", assunto: "FITOTERÁPICO - Renovação de Registro", empresa: "Natulab Laboratório", categoria: "Fitoterápico", priorizado, situacao: "Em exigência" },
    ],
    "empresas-afe-ae": [
      { posicao: 1, processo: "25351400998201966", dataEntrada: "20/08/2023", assunto: "Autorização de Funcionamento de Empresa - Fabricante", empresa: "Laboratório Teuto Brasileiro", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351389887201955", dataEntrada: "15/08/2023", assunto: "Autorização Especial - Substâncias Sujeitas a Controle Especial", empresa: "Cristália Produtos Químicos", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351378776201944", dataEntrada: "10/08/2023", assunto: "Autorização de Funcionamento de Empresa - Importador", empresa: "Janssen-Cilag Farmacêutica", priorizado, situacao: "Aguardando análise" },
      { posicao: 4, processo: "25351367665201933", dataEntrada: "05/08/2023", assunto: "Autorização de Funcionamento de Empresa - Distribuidor", empresa: "Distribuidora Farmacêutica Panarello", priorizado, situacao: "Em exigência" },
    ],
    "empresas-cbpf-nacional": [
      { posicao: 1, processo: "25351256554201822", dataEntrada: "20/07/2023", assunto: "CBPF Nacional - Medicamentos Sintéticos", empresa: "EMS S.A.", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351245443201811", dataEntrada: "15/07/2023", assunto: "CBPF Nacional - Produtos Biológicos", empresa: "Biocon Biologics", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351234332201800", dataEntrada: "10/07/2023", assunto: "CBPF Nacional - Fitoterápicos", empresa: "Natulab Laboratório", priorizado, situacao: "Aguardando análise" },
    ],
    "empresas-cbpf-internacional": [
      { posicao: 1, processo: "25351123221201789", dataEntrada: "20/06/2023", assunto: "CBPF Internacional - Medicamentos Sintéticos", empresa: "Pfizer Inc. (EUA)", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351112110201778", dataEntrada: "15/06/2023", assunto: "CBPF Internacional - Produtos Biológicos", empresa: "Roche AG (Suíça)", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351101009201767", dataEntrada: "10/06/2023", assunto: "CBPF Internacional - IFA", empresa: "BASF SE (Alemanha)", priorizado, situacao: "Em exigência" },
    ],
    "insumos-registro-ifa": [
      { posicao: 1, processo: "25351990887201656", dataEntrada: "20/05/2023", assunto: "Registro de IFA - Substância Sintética", empresa: "Cristália Produtos Químicos", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351979776201645", dataEntrada: "15/05/2023", assunto: "Registro de IFA - Substância Biológica", empresa: "Biocon Biologics", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351968665201634", dataEntrada: "10/05/2023", assunto: "Registro de IFA - Substância Vegetal", empresa: "Natulab Laboratório", priorizado, situacao: "Aguardando análise" },
      { posicao: 4, processo: "25351957554201623", dataEntrada: "05/05/2023", assunto: "Registro de IFA - Alteração Pós-Registro", empresa: "BASF SE (Alemanha)", priorizado, situacao: "Em exigência" },
    ],
    "insumos-cbpf-ifa": [
      { posicao: 1, processo: "25351846443201512", dataEntrada: "20/04/2023", assunto: "CBPF de IFA Nacional - Substância Sintética", empresa: "Cristália Produtos Químicos", priorizado, situacao: "Distribuído para a área responsável" },
      { posicao: 2, processo: "25351835332201501", dataEntrada: "15/04/2023", assunto: "CBPF de IFA Internacional - Substância Sintética", empresa: "BASF SE (Alemanha)", priorizado, situacao: "Em análise" },
      { posicao: 3, processo: "25351824221201490", dataEntrada: "10/04/2023", assunto: "CBPF de IFA Nacional - Substância Biológica", empresa: "Biocon Biologics", priorizado, situacao: "Aguardando análise" },
    ],
  };

  const key = `${area}-${fila}`;
  const items = base[key] ?? [];
  return priorizado ? items.filter((_, i) => i % 2 === 0).map((item, i) => ({ ...item, posicao: i + 1, priorizado: true })) : items;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function situacaoBadge(s: FilaItem["situacao"]) {
  const map: Record<FilaItem["situacao"], { bg: string; color: string; bdr: string }> = {
    "Distribuído para a área responsável": { bg: C.blueLt, color: C.blue, bdr: C.blueBdr },
    "Em análise":                          { bg: C.greenLt, color: C.green, bdr: C.greenBdr },
    "Em exigência":                        { bg: C.redLt, color: C.red, bdr: C.redBdr },
    "Aguardando análise":                  { bg: C.amberLt, color: C.amber, bdr: C.amberBdr },
  };
  const { bg, color, bdr } = map[s];
  return (
    <span style={{ background: bg, color, border: `1px solid ${bdr}`, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {s}
    </span>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function FilasPage() {
  const [, navigate] = useLocation();
  const [areaId, setAreaId] = useState<string>("medicamentos");
  const [filaId, setFilaId] = useState<string>("registro");
  const [subfilaId, setSubfilaId] = useState<string>("ordinaria");
  const [busca, setBusca] = useState("");
  const [filaOpen, setFilaOpen] = useState(false);
  const [subfilaOpen, setSubfilaOpen] = useState(false);

  const area = AREAS.find(a => a.id === areaId) ?? AREAS[0];
  const fila = area.filas.find(f => f.id === filaId) ?? area.filas[0];
  const subfila = fila?.subfilas.find(s => s.id === subfilaId) ?? fila?.subfilas[0];

  const dados = gerarDados(areaId, fila.id, subfila.id);
  const filtrados = busca.trim()
    ? dados.filter(d =>
        d.processo.includes(busca) ||
        d.assunto.toLowerCase().includes(busca.toLowerCase()) ||
        d.empresa.toLowerCase().includes(busca.toLowerCase())
      )
    : dados;

  function handleAreaChange(id: string) {
    const novaArea = AREAS.find(a => a.id === id) ?? AREAS[0];
    setAreaId(novaArea.id);
    setFilaId(novaArea.filas[0]?.id ?? "");
    setSubfilaId(novaArea.filas[0]?.subfilas[0]?.id ?? "");
    setBusca("");
  }

  function handleFilaChange(id: string) {
    const novaFila = area.filas.find(f => f.id === id) ?? area.filas[0];
    setFilaId(novaFila.id);
    setSubfilaId(novaFila.subfilas[0]?.id ?? "");
    setFilaOpen(false);
    setBusca("");
  }

  function handleSubfilaChange(id: string) {
    setSubfilaId(id);
    setSubfilaOpen(false);
    setBusca("");
  }

  const kpis = [
    { label: "Total na Fila", value: dados.length, icon: Clock, color: C.blue },
    { label: "Em Análise", value: dados.filter(d => d.situacao === "Em análise").length, icon: Activity, color: C.green },
    { label: "Em Exigência", value: dados.filter(d => d.situacao === "Em exigência").length, icon: AlertTriangle, color: C.red },
    { label: "Priorizados", value: dados.filter(d => d.priorizado).length, icon: TrendingUp, color: C.amber },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── Header ── */}
      <header style={{ background: C.white, borderBottom: `1px solid ${C.gray3}`, padding: "12px 28px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 20 }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: `1px solid ${C.gray3}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: C.gray5, fontSize: 13, fontWeight: 500 }}
        >
          <ChevronLeft size={14} /> Voltar
        </button>
        <div style={{ width: 1, height: 24, background: C.gray3 }} />
        <div>
          <div style={{ fontSize: 11, color: C.gray4, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 }}>RIGI AI</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: -0.3 }}>Filas de Análise ANVISA</div>
        </div>
      </header>

      <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Seleção de Área ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.gray4, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Área de Interesse</div>
          <div style={{ display: "flex", gap: 12 }}>
            {AREAS.map(a => {
              const Icon = a.icone;
              const ativo = a.id === areaId;
              return (
                <button
                  key={a.id}
                  onClick={() => handleAreaChange(a.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 20px", borderRadius: 10, cursor: "pointer",
                    border: ativo ? `2px solid ${C.blue}` : `2px solid ${C.gray3}`,
                    background: ativo ? C.blueLt : C.white,
                    color: ativo ? C.blue : C.gray5,
                    fontWeight: ativo ? 700 : 500,
                    fontSize: 14, transition: "all .15s",
                    boxShadow: ativo ? `0 4px 12px rgba(37,99,235,.15)` : "0 1px 3px rgba(0,0,0,.06)"
                  }}
                >
                  <Icon size={18} />
                  {a.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Filtros Fila + Subfila ── */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray3}`, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.navy, fontWeight: 700, fontSize: 13 }}>
            <Filter size={14} /> Filtros
          </div>
          <div style={{ width: 1, height: 24, background: C.gray3 }} />

          {/* Dropdown Fila */}
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, color: C.gray4, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>Fila</div>
            <button
              onClick={() => { setFilaOpen(o => !o); setSubfilaOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${filaOpen ? C.blue : C.gray3}`,
                background: filaOpen ? C.blueLt : C.white,
                color: C.navy, fontWeight: 600, fontSize: 13,
                minWidth: 200, justifyContent: "space-between"
              }}
            >
              {fila.nome}
              <ChevronDown size={13} style={{ transform: filaOpen ? "rotate(180deg)" : "none", transition: "transform .2s", color: C.gray4 }} />
            </button>
            {filaOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 30,
                background: C.white, border: `1px solid ${C.gray3}`, borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,.12)", minWidth: 220, overflow: "hidden"
              }}>
                {area.filas.map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleFilaChange(f.id)}
                    style={{
                      width: "100%", padding: "10px 16px", background: f.id === filaId ? C.blueLt : "none",
                      border: "none", cursor: "pointer", textAlign: "left",
                      color: f.id === filaId ? C.blue : C.navy, fontWeight: f.id === filaId ? 700 : 400,
                      fontSize: 13, transition: "background .1s"
                    }}
                    onMouseEnter={e => { if (f.id !== filaId) (e.currentTarget as HTMLButtonElement).style.background = C.gray1; }}
                    onMouseLeave={e => { if (f.id !== filaId) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    {f.nome}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Subfila */}
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, color: C.gray4, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>Subfila</div>
            <button
              onClick={() => { setSubfilaOpen(o => !o); setFilaOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${subfilaOpen ? C.blue : C.gray3}`,
                background: subfilaOpen ? C.blueLt : C.white,
                color: C.navy, fontWeight: 600, fontSize: 13,
                minWidth: 160, justifyContent: "space-between"
              }}
            >
              {subfila.nome}
              <ChevronDown size={13} style={{ transform: subfilaOpen ? "rotate(180deg)" : "none", transition: "transform .2s", color: C.gray4 }} />
            </button>
            {subfilaOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 30,
                background: C.white, border: `1px solid ${C.gray3}`, borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,.12)", minWidth: 180, overflow: "hidden"
              }}>
                {fila.subfilas.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSubfilaChange(s.id)}
                    style={{
                      width: "100%", padding: "10px 16px", background: s.id === subfilaId ? C.blueLt : "none",
                      border: "none", cursor: "pointer", textAlign: "left",
                      color: s.id === subfilaId ? C.blue : C.navy, fontWeight: s.id === subfilaId ? 700 : 400,
                      fontSize: 13, transition: "background .1s"
                    }}
                    onMouseEnter={e => { if (s.id !== subfilaId) (e.currentTarget as HTMLButtonElement).style.background = C.gray1; }}
                    onMouseLeave={e => { if (s.id !== subfilaId) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    {s.nome}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }} />

          {/* Busca */}
          <div style={{ position: "relative" }}>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar processo, assunto ou empresa..."
              style={{
                padding: "8px 14px 8px 36px", borderRadius: 8, border: `1px solid ${C.gray3}`,
                fontSize: 13, color: C.navy, background: C.gray1, outline: "none",
                width: 280, fontFamily: "inherit"
              }}
            />
            <Filter size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.gray4 }} />
            {busca && (
              <button onClick={() => setBusca("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.gray4, display: "flex" }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>



        {/* ── Tabela ── */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.gray3}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          {/* Cabeçalho da tabela */}
          <div style={{ background: C.navy, padding: "14px 20px", display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.white, letterSpacing: 0.3 }}>
              Processos na Fila
            </div>
          </div>

          {/* Thead */}
          <div style={{ display: "grid", gridTemplateColumns: "56px 160px 100px 1fr 180px 80px", gap: 0, background: C.gray2, borderBottom: `1px solid ${C.gray3}`, padding: "0 20px" }}>
            {["Pos.", "Processo", "Data Entrada", "Assunto", "Empresa", "DHL"].map(h => (
              <div key={h} style={{ padding: "10px 8px", fontSize: 11, fontWeight: 700, color: C.gray5, letterSpacing: 0.5, textTransform: "uppercase", textAlign: h === "DHL" ? "center" : "left" }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtrados.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: C.gray4, fontSize: 14 }}>
              Nenhum expediente encontrado para os filtros selecionados.
            </div>
          ) : (
            filtrados.map((item, idx) => (
              <div
                key={item.processo}
                style={{
                  display: "grid", gridTemplateColumns: "56px 160px 100px 1fr 180px 80px",
                  gap: 0, padding: "0 20px",
                  background: idx % 2 === 0 ? C.white : C.gray1,
                  borderBottom: `1px solid ${C.gray3}`,
                  transition: "background .1s"
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.blueLt; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = idx % 2 === 0 ? C.white : C.gray1; }}
              >
                <div style={{ padding: "12px 8px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: item.priorizado ? C.amber : C.navy }}>{item.posicao}</span>
                  {item.priorizado && <span style={{ marginLeft: 4, fontSize: 10, color: C.amber }}>★</span>}
                </div>
                <div style={{ padding: "12px 8px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.blue, fontWeight: 600 }}>{item.processo}</span>
                </div>
                <div style={{ padding: "12px 8px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.gray5 }}>{item.dataEntrada}</span>
                </div>
                <div style={{ padding: "12px 8px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: C.navy, lineHeight: 1.4 }}>{item.assunto}</span>
                  {item.categoria && (
                    <span style={{ background: C.gray2, color: C.gray5, fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, whiteSpace: "nowrap", border: `1px solid ${C.gray3}` }}>
                      {item.categoria}
                    </span>
                  )}
                </div>
                <div style={{ padding: "12px 8px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: C.gray5 }}>{item.empresa}</span>
                </div>
                {/* DHL: tipo 1 (finalizado) = sólido azul | tipo 2 (em andamento) = contorno cinza */}
                <div style={{ padding: "12px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.situacao === "Distribuído para a área responsável" ? (
                    // Tipo 2 — Em andamento: contorno azul claro → rota /dhl2
                    <button
                      onClick={() => navigate(`/dhl2/${encodeURIComponent(item.processo)}`)}
                      title={`DHL em andamento: ${item.processo}`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, fontWeight: 600, color: "#3b82f6",
                        background: "#eff6ff", border: `1px solid #bfdbfe`,
                        borderRadius: 6, padding: "4px 8px", cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <ExternalLink size={11} /> DHL
                    </button>
                  ) : (
                    // Tipo 1 — Finalizado/Registrado: sólido azul
                    <button
                      onClick={() => navigate(`/dhl/${encodeURIComponent(item.processo)}`)}
                      title={`Ver DHL: ${item.processo}`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, fontWeight: 600, color: C.blue,
                        background: C.blueLt, border: `1px solid ${C.blueBdr}`,
                        borderRadius: 6, padding: "4px 8px", cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <ExternalLink size={11} /> DHL
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Nota de rodapé */}
        <div style={{ marginTop: 16, padding: "12px 16px", background: C.amberLt, border: `1px solid ${C.amberBdr}`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <AlertTriangle size={14} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: C.amber, lineHeight: 1.5 }}>
            <strong>Dados ilustrativos:</strong> Este painel exibe uma estrutura de filas baseada na documentação oficial da ANVISA
            (consultas.anvisa.gov.br). Os dados de expedientes são exemplos para validação do layout. A integração com os dados
            reais da ANVISA será implementada na próxima fase de desenvolvimento.
          </div>
        </div>
      </div>
    </div>
  );
}
