/**
 * Monitoramento de IFA — Página Standalone
 * "Precision Navy" design: navy #1a2e4a | blue #2563eb
 * Dados reais: ANVISA — Lista de Princípios Ativos Pendentes de Análise — 13/Mar/2026
 */

import { useState, useMemo } from "react";
import {
  Search, Filter, ChevronRight, Info, ExternalLink,
  TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Activity, Calendar, AlertTriangle, Building2, Beaker, Bell
} from "lucide-react";
import { IFA_DATA, CATEGORIAS, CATEGORIA_COLORS, type IFAEntry } from "@/data/ifaData";

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

// ── Mock data for "today" movements ──────────────────────────────────────────
const ENTRARAM_HOJE: { ifa: string; categoria: string; quantidade: number }[] = [
  { ifa: "Semaglutida",            categoria: "Novo",      quantidade: 2 },
  { ifa: "Denosumabe",             categoria: "Biológico", quantidade: 1 },
  { ifa: "Empagliflozina",         categoria: "Genérico",  quantidade: 3 },
  { ifa: "Fumarato De Vonoprazana",categoria: "Similar",   quantidade: 1 },
];

const SAIRAM_HOJE: { ifa: string; categoria: string; quantidade: number }[] = [
  { ifa: "Linagliptina",           categoria: "Genérico",  quantidade: 2 },
  { ifa: "Bromidrato De Vortioxetina", categoria: "Similar", quantidade: 1 },
  { ifa: "Apixabana",              categoria: "Genérico",  quantidade: 1 },
];

const REGISTRADOS_DOU: { ifa: string; categoria: string; empresa: string; tipo: "Deferido" | "Indeferido"; processo: string }[] = [
  { ifa: "Rivaroxabana",     categoria: "Genérico",  empresa: "EMS S.A.",          tipo: "Deferido",    processo: "25351.800123/2025-01" },
  { ifa: "Trastuzumabe",     categoria: "Biológico", empresa: "Roche",             tipo: "Deferido",    processo: "25351.800456/2025-02" },
  { ifa: "Cloridrato De Metformina", categoria: "Similar", empresa: "Eurofarma",   tipo: "Indeferido",  processo: "25351.800789/2025-03" },
];

// ── Types ────────────────────────────────────────────────────────────────────
interface ProcessoLinha {
  data: string;          // ex: "02/12"
  empresas: string[];    // lista de possíveis empresas; [] = não identificada
  estimativa: string;    // ex: "Q4 2029"
  melhor: string;
  pior: string;
}

interface PredicaoEntry {
  identificado: boolean;
  // Caso 1: lista de processos individuais
  processos?: ProcessoLinha[];
  // Caso 2: empresa única identificada
  empresas?: string[];
  processo?: string;
  predicao?: string;
  melhor?: string;
  pior?: string;
}

// ── Mock prediction data (used when clicking an IFA) ─────────────────────────
const PREDICAO_MOCK: Record<string, PredicaoEntry> = {
  "Semaglutida": {
    identificado: false,
    processos: [
      { data: "02/12", empresas: ["Pfizer", "Eurofarma"],          estimativa: "Q4 2029", melhor: "Q2 2029", pior: "Q2 2030" },
      { data: "02/12", empresas: ["Novo Nordisk"],                  estimativa: "Q3 2029", melhor: "Q1 2029", pior: "Q4 2029" },
      { data: "05/12", empresas: [],                                estimativa: "Q2 2030", melhor: "Q4 2029", pior: "Q4 2030" },
      { data: "05/12", empresas: ["EMS S.A."],                      estimativa: "Q1 2030", melhor: "Q3 2029", pior: "Q3 2030" },
      { data: "09/12", empresas: ["Biolab"],                        estimativa: "Q2 2030", melhor: "Q4 2029", pior: "Q1 2031" },
      { data: "09/12", empresas: [],                                estimativa: "Q3 2030", melhor: "Q1 2030", pior: "Q1 2031" },
      { data: "11/12", empresas: ["Eurofarma", "Libbs"],            estimativa: "Q3 2030", melhor: "Q1 2030", pior: "Q2 2031" },
      { data: "11/12", empresas: [],                                estimativa: "Q4 2030", melhor: "Q2 2030", pior: "Q2 2031" },
      { data: "16/12", empresas: ["Cristália"],                     estimativa: "Q4 2030", melhor: "Q2 2030", pior: "Q3 2031" },
      { data: "16/12", empresas: [],                                estimativa: "Q1 2031", melhor: "Q3 2030", pior: "Q3 2031" },
      { data: "18/12", empresas: ["Pfizer"],                        estimativa: "Q1 2031", melhor: "Q3 2030", pior: "Q4 2031" },
      { data: "18/12", empresas: [],                                estimativa: "Q2 2031", melhor: "Q4 2030", pior: "Q4 2031" },
      { data: "20/12", empresas: ["Novo Nordisk", "Eurofarma"],     estimativa: "Q2 2031", melhor: "Q4 2030", pior: "Q1 2032" },
      { data: "20/12", empresas: [],                                estimativa: "Q3 2031", melhor: "Q1 2031", pior: "Q1 2032" },
    ],
  },
  "Denosumabe": {
    identificado: true,
    processo: "25351.100001/2026-01",
    empresas: ["Amgen"],
    predicao: "Q1 2027",
    melhor: "Q4 2026",
    pior: "Q2 2027",
  },
};

// ── Components ────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: C.white, borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.04)",
    overflow: "hidden", ...style
  }}>{children}</div>
);

const SectionHeader = ({ title, sub, count }: { title: string; sub?: string; count?: number }) => (
  <div style={{ padding: "12px 18px", background: C.navy, borderBottom: "2px solid rgba(37,99,235,.4)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: 0.3 }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
    </div>
    {count !== undefined && (
      <span style={{ fontSize: 13, fontWeight: 800, color: "#93c5fd", background: "rgba(37,99,235,.2)", border: "1px solid rgba(37,99,235,.3)", borderRadius: 20, padding: "2px 10px" }}>{count}</span>
    )}
  </div>
);

function CategoriaBadge({ cat }: { cat: string }) {
  const cfg = CATEGORIA_COLORS[cat] || { color: C.gray5, bg: C.gray2, bdr: C.gray3 };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.bdr}`, whiteSpace: "nowrap" }}>
      {cat}
    </span>
  );
}

function MovimentoCard({ item, tipo }: { item: typeof ENTRARAM_HOJE[0]; tipo: "entrada" | "saida" }) {
  const isEntrada = tipo === "entrada";
  const cfg = CATEGORIA_COLORS[item.categoria] || { color: C.gray5, bg: C.gray2, bdr: C.gray3 };
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "9px 12px",
      background: isEntrada ? C.blueLt : C.gray2,
      border: `1px solid ${isEntrada ? C.blueBdr : C.gray3}`,
      borderLeft: `3px solid ${isEntrada ? C.blue : C.gray4}`,
      borderRadius: 7, gap: 8
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.ifa}</div>
        <CategoriaBadge cat={item.categoria} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: isEntrada ? C.blue : C.gray5 }}>+{item.quantidade}</span>
        {isEntrada
          ? <TrendingUp size={14} color={C.blue} />
          : <TrendingDown size={14} color={C.gray4} />
        }
      </div>
    </div>
  );
}

// ── IFA Row (clickable) ───────────────────────────────────────────────────────
function IFARow({ entry, onSelect }: { entry: IFAEntry; onSelect: (e: IFAEntry) => void }) {
  const [hovered, setHovered] = useState(false);
  const [seguindo, setSeguindo] = useState(false);
  const cfg = CATEGORIA_COLORS[entry.categoria] || { color: C.gray5, bg: C.gray2, bdr: C.gray3 };
  const pred = PREDICAO_MOCK[entry.ifa];

  return (
    <tr
      onClick={() => onSelect(entry)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.blueLt : "transparent", cursor: "pointer", transition: "background .12s", borderBottom: `1px solid ${C.gray3}` }}
    >
      <td style={{ padding: "10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* DEV: conectar ao sistema de alertas do usuário */}
          <button
            onClick={e => { e.stopPropagation(); setSeguindo(s => !s); }}
            title={seguindo ? "Deixar de seguir" : "Seguir este IFA"}
            style={{
              background: seguindo ? "#eff6ff" : "transparent",
              border: `1px solid ${seguindo ? C.blue : C.gray3}`,
              borderRadius: 6, padding: "3px 5px", cursor: "pointer",
              display: "flex", alignItems: "center", color: seguindo ? C.blue : C.gray4,
              transition: "all .15s", flexShrink: 0
            }}
          >
            <Bell size={12} fill={seguindo ? C.blue : "none"} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{entry.ifa}</span>
          {pred?.identificado && (
            <span style={{ fontSize: 9, fontWeight: 700, color: C.green, background: C.greenLt, border: `1px solid ${C.greenBdr}`, borderRadius: 4, padding: "1px 5px" }}>ID</span>
          )}
        </div>
      </td>
      <td style={{ padding: "10px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: cfg.color }}>{entry.quantidade}</span>
      </td>
      <td style={{ padding: "10px 16px" }}>
        <CategoriaBadge cat={entry.categoria} />
      </td>
      <td style={{ padding: "10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: hovered ? C.blue : C.gray4, fontSize: 12, fontWeight: 600 }}>
          Ver predição
          <ChevronRight size={13} />
        </div>
      </td>
    </tr>
  );
}

// ── Prediction Modal ──────────────────────────────────────────────────────────
function PredictionModal({ entry, onClose }: { entry: IFAEntry; onClose: () => void }) {
  const pred = PREDICAO_MOCK[entry.ifa];
  const cfg = CATEGORIA_COLORS[entry.categoria] || { color: C.gray5, bg: C.gray2, bdr: C.gray3 };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,30,48,.6)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24
    }} onClick={onClose}>
      <div style={{
        background: C.white, borderRadius: 14, maxWidth: 560, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)", overflow: "hidden"
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: C.navy, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Predição Regulatória</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.white }}>{entry.ifa}</div>
            <CategoriaBadge cat={entry.categoria} />
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.1)", border: "none", color: C.white, borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>✕ Fechar</button>
        </div>

        <div style={{ padding: "20px" }}>
          {pred ? (
            pred.identificado ? (
              /* Caso 2: empresa identificada */
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.greenLt, border: `1px solid ${C.greenBdr}`, borderRadius: 8, marginBottom: 16 }}>
                  <CheckCircle2 size={16} color={C.green} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>Empresa identificada — redirecionamento disponível</span>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4, marginBottom: 6 }}>Empresa</div>
                  {(pred.empresas ?? []).map(e => (
                    <div key={e} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: C.gray2, borderRadius: 7, marginBottom: 4 }}>
                      <Building2 size={13} color={C.navy} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{e}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4, marginBottom: 6 }}>Nº Processo</div>
                  <span style={{ fontFamily: "monospace", fontSize: 13, color: C.gray4, background: C.gray2, padding: "6px 10px", borderRadius: 6, display: "inline-block" }}>{pred.processo}</span>
                </div>

                {/* TODO: DHL link — dev marker */}
                <div style={{ padding: "12px 14px", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#854d0e", marginBottom: 4 }}>🚧 Para o desenvolvedor</div>
                  <div style={{ fontSize: 12, color: "#713f12" }}>
                    Quando empresa/processo identificado: redirecionar para a página DHL do IFA baseada no número de processo ANVISA.<br />
                    <strong>Rota sugerida:</strong> <code>/ifa/dhl/{pred.processo}</code>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Predição",       val: pred.predicao, color: C.navy  },
                    { label: "Melhor cenário", val: pred.melhor,   color: C.green },
                    { label: "Pior cenário",   val: pred.pior,     color: C.red   },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign: "center", padding: "12px 8px", background: C.gray2, borderRadius: 8, border: `1px solid ${C.gray3}` }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
                      <div style={{ fontSize: 10, color: C.gray4, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Caso 1: lista de processos por data */
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.amberLt, border: `1px solid ${C.amberBdr}`, borderRadius: 8, marginBottom: 14 }}>
                  <AlertTriangle size={15} color={C.amber} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.amber }}>
                    {pred.processos?.filter(p => p.empresas.length === 0).length} de {pred.processos?.length} processos ainda sem empresa identificada
                  </span>
                </div>

                {/* Column headers */}
                <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 110px", gap: 8, padding: "6px 10px", background: C.gray2, borderRadius: "7px 7px 0 0", borderBottom: `1px solid ${C.gray3}` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4 }}>Data</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4 }}>Possíveis Empresas</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4, textAlign: "right" }}>Estimativa</span>
                </div>

                {/* Process rows */}
                <div style={{ border: `1px solid ${C.gray3}`, borderTop: "none", borderRadius: "0 0 7px 7px", overflow: "hidden", marginBottom: 14, maxHeight: 320, overflowY: "auto" }}>
                  {pred.processos?.map((proc, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "56px 1fr 110px", gap: 8,
                      padding: "9px 10px",
                      background: i % 2 === 0 ? C.white : C.gray1,
                      borderBottom: i < (pred.processos?.length ?? 0) - 1 ? `1px solid ${C.gray3}` : "none",
                      alignItems: "center"
                    }}>
                      {/* Data */}
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, fontFamily: "monospace" }}>{proc.data}</span>

                      {/* Empresas */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {proc.empresas.length > 0
                          ? proc.empresas.map(emp => (
                              <span key={emp} style={{ fontSize: 11, fontWeight: 600, color: C.navy, background: C.blueLt, border: `1px solid ${C.blueBdr}`, borderRadius: 5, padding: "2px 7px", display: "flex", alignItems: "center", gap: 4 }}>
                                <Building2 size={10} color={C.blue} />{emp}
                              </span>
                            ))
                          : <span style={{ fontSize: 11, color: C.gray4, fontStyle: "italic" }}>Não identificada</span>
                        }
                      </div>

                      {/* Estimativa com range */}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{proc.estimativa}</div>
                        <div style={{ fontSize: 10, color: C.gray4, marginTop: 1 }}>
                          <span style={{ color: C.green }}>{proc.melhor}</span>
                          <span style={{ margin: "0 3px", color: C.gray3 }}>|</span>
                          <span style={{ color: C.red }}>{proc.pior}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 11, color: C.gray5 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.green, display: "inline-block" }} />Melhor cenário</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.red, display: "inline-block" }} />Pior cenário</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.navy, display: "inline-block" }} />Estimativa central</span>
                </div>

                {/* Dev marker */}
                <div style={{ padding: "10px 14px", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#854d0e", marginBottom: 3 }}>🚧 Para o desenvolvedor</div>
                  <div style={{ fontSize: 11, color: "#713f12", lineHeight: 1.6 }}>
                    Rota sugerida para página completa: <code>/ifa/predicao/{entry.ifa.toLowerCase().replace(/\s/g, "-")}</code><br />
                    Incluir vídeo explicativo sobre predição de empresa × IFA e predição de tempo por princípio ativo.
                  </div>
                </div>
              </div>
            )
          ) : (
            /* IFA sem dados de predição ainda */
            <div>
              <div style={{ textAlign: "center", padding: "24px 16px" }}>
                <Beaker size={36} color={C.gray3} style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Predição em desenvolvimento</div>
                <div style={{ fontSize: 12, color: C.gray4, lineHeight: 1.6 }}>
                  A RIGI AI está processando os dados históricos para este IFA.<br />
                  A predição estará disponível em breve.
                </div>
              </div>
              <div style={{ padding: "12px 14px", background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#854d0e", marginBottom: 4 }}>🚧 Para o desenvolvedor</div>
                <div style={{ fontSize: 12, color: "#713f12" }}>
                  Implementar lógica de predição: verificar se empresa está identificada (caso 2 → DHL) ou não (caso 1 → lista de processos com predição).<br />
                  Fonte: lista de ciclo de vida ANVISA, 5–15 dias úteis antes da entrada na fila.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IFAMonitoramento() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [selectedIFA, setSelectedIFA] = useState<IFAEntry | null>(null);
  const [pagina, setPagina] = useState(1);
  const POR_PAGINA = 30;

  const dadosFiltrados = useMemo(() => {
    return IFA_DATA.filter(row => {
      const matchCat = categoriaFiltro === "Todos" || row.categoria === categoriaFiltro;
      const matchBusca = busca === "" || row.ifa.toLowerCase().includes(busca.toLowerCase());
      return matchCat && matchBusca;
    });
  }, [busca, categoriaFiltro]);

  const totalPaginas = Math.ceil(dadosFiltrados.length / POR_PAGINA);
  const dadosPagina = dadosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const totalProcessos = IFA_DATA.reduce((s, r) => s + r.quantidade, 0);

  const handleFiltroChange = (cat: string) => {
    setCategoriaFiltro(cat);
    setPagina(1);
  };

  const handleBusca = (v: string) => {
    setBusca(v);
    setPagina(1);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}`}</style>

      {/* Header */}
      <header style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%)`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 38, height: 38, background: "rgba(37,99,235,.3)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(37,99,235,.5)" }}>
            <Activity size={19} color="#93c5fd" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -.3 }}>
              Rigi<span style={{ color: "#93c5fd" }}>Blick</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b", marginLeft: 10 }}>/ Monitoramento de IFA</span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>Fila de Princípios Ativos Pendentes de Análise — ANVISA</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: "#64748b", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 7, padding: "5px 10px", display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar size={11} color="#64748b" />
            13/03/2026
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", background: "rgba(37,99,235,.2)", border: "1px solid rgba(37,99,235,.3)", borderRadius: 7, padding: "5px 12px" }}>
            {IFA_DATA.length} IFAs · {totalProcessos} processos
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 40px" }}>

        {/* ── SEÇÃO 1: MOVIMENTAÇÕES DO DIA ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 4, height: 20, background: C.blue, borderRadius: 2 }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: 0 }}>Movimentações do Dia — 13/Mar/2026</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            {/* Entraram hoje */}
            <Card>
              <SectionHeader title="IFAs que Entraram na Lista Hoje" count={ENTRARAM_HOJE.reduce((s, i) => s + i.quantidade, 0)} />
              <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                {ENTRARAM_HOJE.map(item => (
                  <MovimentoCard key={item.ifa} item={item} tipo="entrada" />
                ))}
                <div style={{ fontSize: 10, color: C.gray4, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Info size={10} color={C.blue} />
                  Dados mockados — integração com ANVISA em desenvolvimento
                </div>
              </div>
            </Card>

            {/* Registrados/Indeferidos DOU */}
            <Card>
              <SectionHeader title="Registrados / Indeferidos Hoje (DOU)" count={REGISTRADOS_DOU.length} />
              <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                {REGISTRADOS_DOU.map(item => {
                  const isDeferido = item.tipo === "Deferido";
                  return (
                    <div key={item.processo} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 12px",
                      background: isDeferido ? C.greenLt : C.redLt,
                      border: `1px solid ${isDeferido ? C.greenBdr : C.redBdr}`,
                      borderLeft: `3px solid ${isDeferido ? C.green : C.red}`,
                      borderRadius: 7, gap: 8
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.ifa}</div>
                        <div style={{ fontSize: 11, color: C.gray5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{item.empresa}</div>
                        <CategoriaBadge cat={item.categoria} />
                      </div>
                      {/* DEV: ao clicar, navegar para /dhl/:processo com os dados deste item */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: isDeferido ? C.green : C.red }}>
                          {isDeferido ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                          {item.tipo}
                        </span>
                        <span
                          title="[DEV] Conectar ao DHL do processo"
                          style={{
                            fontSize: 10, fontWeight: 700, color: C.blue,
                            background: C.blueLt, border: `1px dashed ${C.blueBdr}`,
                            borderRadius: 5, padding: "2px 6px", cursor: "not-allowed",
                            display: "flex", alignItems: "center", gap: 3,
                          }}
                        >
                          <ExternalLink size={9} /> DHL
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ fontSize: 10, color: C.gray4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Info size={10} color={C.gray4} />
                  Dados mockados — integração com DOU em desenvolvimento
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ── SEÇÃO 2: LISTA COMPLETA DE IFAs ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 4, height: 20, background: C.blue, borderRadius: 2 }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: 0 }}>Lista Completa de IFAs em Análise</h2>
            <span style={{ fontSize: 11, color: C.gray5, background: C.gray2, border: `1px solid ${C.gray3}`, borderRadius: 6, padding: "3px 9px", display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={11} color={C.gray4} />
              13/03/2026
            </span>
            <span style={{ fontSize: 12, color: C.gray4 }}>— clique em um IFA para ver a predição</span>
          </div>

          <Card>
            {/* Filtros */}
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.gray3}`, background: C.gray2 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                {/* Busca */}
                <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
                  <Search size={14} color={C.gray4} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="Buscar IFA..."
                    value={busca}
                    onChange={e => handleBusca(e.target.value)}
                    style={{
                      width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                      fontSize: 13, border: `1px solid ${C.gray3}`, borderRadius: 8,
                      background: C.white, color: C.navy, outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
                {/* Categoria filters */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                  <Filter size={13} color={C.gray4} />
                  {CATEGORIAS.map(cat => {
                    const cfg = cat !== "Todos" ? CATEGORIA_COLORS[cat] : null;
                    const isActive = categoriaFiltro === cat;
                    return (
                      <button key={cat} onClick={() => handleFiltroChange(cat)} style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 11px", borderRadius: 20,
                        border: `1px solid ${isActive ? (cfg?.color || C.navy) : C.gray3}`,
                        background: isActive ? (cfg?.bg || C.navy) : C.white,
                        color: isActive ? (cfg?.color || C.white) : C.gray5,
                        cursor: "pointer", transition: "all .15s"
                      }}>{cat}</button>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: C.gray4 }}>
                {dadosFiltrados.length} IFAs encontrados · {dadosFiltrados.reduce((s, r) => s + r.quantidade, 0)} processos no total
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: C.gray2, borderBottom: `1px solid ${C.gray3}` }}>
                    {["Nome do IFA", "Quantidade", "Categoria Regulatória", ""].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: h === "Quantidade" ? "center" : "left", fontSize: 11, fontWeight: 700, color: C.gray5, textTransform: "uppercase", letterSpacing: .4 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dadosPagina.map((entry, i) => (
                    <IFARow key={`${entry.ifa}-${entry.categoria}`} entry={entry} onSelect={setSelectedIFA} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPaginas > 1 && (
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.gray3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.gray4 }}>
                  Página {pagina} de {totalPaginas} · {dadosFiltrados.length} resultados
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 7, border: `1px solid ${C.gray3}`, background: pagina === 1 ? C.gray2 : C.white, color: pagina === 1 ? C.gray4 : C.navy, cursor: pagina === 1 ? "default" : "pointer" }}>← Anterior</button>
                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    const p = pagina <= 3 ? i + 1 : pagina - 2 + i;
                    if (p < 1 || p > totalPaginas) return null;
                    return (
                      <button key={p} onClick={() => setPagina(p)} style={{ padding: "5px 10px", fontSize: 12, borderRadius: 7, border: `1px solid ${p === pagina ? C.blue : C.gray3}`, background: p === pagina ? C.blue : C.white, color: p === pagina ? C.white : C.navy, cursor: "pointer", fontWeight: p === pagina ? 700 : 400 }}>{p}</button>
                    );
                  })}
                  <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 7, border: `1px solid ${C.gray3}`, background: pagina === totalPaginas ? C.gray2 : C.white, color: pagina === totalPaginas ? C.gray4 : C.navy, cursor: pagina === totalPaginas ? "default" : "pointer" }}>Próxima →</button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── DISCLAIMERS ── */}
        <div style={{ background: C.white, border: `1px solid ${C.gray3}`, borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Info size={16} color={C.navy} />
            <span style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Disclaimers e Notas Metodológicas</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                when: "Dados históricos de IFA",
                text: "A RIGI AI fornece informação relativa a datas de entrada de IFA na lista a partir de NOV/2025. Dados anteriores a esse período podem estar incompletos ou indisponíveis."
              },
              {
                when: "Predição de tempo (todos os casos)",
                text: "O racional da predição de tempo leva em consideração os tempos médios de processos com exigência, com priorização e processos com agrupamento de IFAs (PGA). Os intervalos de melhor/pior cenário refletem a variabilidade histórica dos processos ANVISA."
              },
              {
                when: "Medicamentos de interesse público",
                text: "Quando um medicamento desta lista constar na lista de medicamentos de interesse público do governo ou da ANVISA, será exibido um indicador com link para a publicação oficial."
              },
              {
                when: "Processos com análise grupal (PGA)",
                text: "Processos com mais de determinado número de IFAs podem ser submetidos ao Plano de Gerenciamento de Avaliações Excepcional (PGA) para otimização de filas. Isso pode alterar significativamente o prazo estimado."
              },
              {
                when: "Atualização da lista ANVISA",
                text: "A ANVISA demora aproximadamente 2 dias úteis para atualizar a lista de pendentes após uma decisão. O painel de 'Registrados/Indeferidos Hoje' utiliza o Diário Oficial da União (DOU) como fonte primária para antecipar essas movimentações."
              },
            ].map(({ when, text }) => (
              <div key={when} style={{ padding: "10px 14px", background: C.gray2, borderRadius: 8, borderLeft: `3px solid ${C.gray4}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{when}</div>
                <div style={{ fontSize: 12, color: C.gray5, lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Prediction Modal */}
      {selectedIFA && (
        <PredictionModal entry={selectedIFA} onClose={() => setSelectedIFA(null)} />
      )}
    </div>
  );
}
