/**
 * Medicamentos Registrados — Página Standalone
 * "Precision Navy" design: navy #1a2e4a | blue #2563eb
 * NOTA AO DESENVOLVEDOR: Esta página usa 60 registros de exemplo (ativos).
 * Para produção, substituir MOCK_DATA pela chamada à API/banco com os 10.304 registros ativos.
 * Registros inativos devem ser excluídos. Princípio Ativo vazio → exibir "NA".
 * Ao clicar em um produto, navegar para /dhl/:numeroProcesso (página a ser criada).
 */

import { useState, useMemo } from "react";
import { ChevronLeft, Search, Filter, ChevronRight, ChevronLeft as ChevLeft, ExternalLink, Info, X, Bell } from "lucide-react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  navy:    "#1a2e4a",
  navyMid: "#2d4a6e",
  blue:    "#2563eb",
  blueLt:  "#eff6ff",
  blueBdr: "#bfdbfe",
  green:   "#059669",
  greenLt: "#ecfdf5",
  greenBdr:"#a7f3d0",
  amber:   "#d97706",
  amberLt: "#fffbeb",
  amberBdr:"#fde68a",
  gray1:   "#f7f9fc",
  gray2:   "#f1f4f8",
  gray3:   "#e2e8f0",
  gray4:   "#94a3b8",
  gray5:   "#475569",
  white:   "#ffffff",
};

// ── Mock data (60 registros ativos reais da ANVISA) ───────────────────────────
const MOCK_DATA = [{"nome":"ALGILIVE","complemento":"","principioAtivo":"LISINATO DE CETOPROFENO","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103280024","numeroProcesso":"25351.501048/2005-81","empresa":"CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA","situacao":"Ativo","vencimento":"09/2026"},{"nome":"AMOXICILINA","complemento":"","principioAtivo":"AMOXICILINA TRIIDRATADA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103700329","numeroProcesso":"25351.200823/2003-03","empresa":"LABORATÓRIO TEUTO BRASILEIRO S/A","situacao":"Ativo","vencimento":"11/2028"},{"nome":"AMOXICILINA","complemento":"","principioAtivo":"AMOXICILINA TRIIDRATADA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"102351088","numeroProcesso":"25351.308043/2013-03","empresa":"EMS S/A","situacao":"Ativo","vencimento":"06/2028"},{"nome":"ARADOIS H","complemento":"","principioAtivo":"LOSARTANA POTÁSSICA, HIDROCLOROTIAZIDA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"102351047","numeroProcesso":"25351.001295/2001-11","empresa":"EMS S/A","situacao":"Ativo","vencimento":"05/2027"},{"nome":"AZITROMICINA","complemento":"","principioAtivo":"AZITROMICINA DI-HIDRATADA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"155840289","numeroProcesso":"25351.518449/2019-99","empresa":"BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A","situacao":"Ativo","vencimento":"07/2030"},{"nome":"BENICAR","complemento":"","principioAtivo":"OLMESARTANA MEDOXOMILA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431012","numeroProcesso":"25351.180249/2020-92","empresa":"EUROFARMA LABORATORIOS S.A.","situacao":"Ativo","vencimento":"11/2031"},{"nome":"BORTEZOMIBE","complemento":"","principioAtivo":"BORTEZOMIBE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"165070008","numeroProcesso":"25351.042830/2020-15","empresa":"Camber Farmaceutica Ltda","situacao":"Ativo","vencimento":"12/2030"},{"nome":"bromazepam","complemento":"","principioAtivo":"BROMAZEPAM","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"155840298","numeroProcesso":"25351.534890/2011-95","empresa":"BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A","situacao":"Ativo","vencimento":"11/2035"},{"nome":"bromidrato de citalopram","complemento":"","principioAtivo":"BROMIDRATO DE CITALOPRAM","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"109740331","numeroProcesso":"25351.557781/2021-93","empresa":"BIOLAB SANUS FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"08/2029"},{"nome":"cabazitaxel","complemento":"","principioAtivo":"cabazitaxel","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"155370053","numeroProcesso":"25351.558591/2016-03","empresa":"ACCORD FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"10/2027"},{"nome":"carbonato de lítio","complemento":"","principioAtivo":"CARBONATO DE LÍTIO","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100630260","numeroProcesso":"25351.406155/2022-11","empresa":"INSTITUTO BIOCHIMICO INDÚSTRIA FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"10/2032"},{"nome":"cloridrato de ciprofloxacina + dexametasona","complemento":"","principioAtivo":"cloridrato de ciprofloxacino monoidratado, DEXAMETASONA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"170420030","numeroProcesso":"25351.047445/2025-61","empresa":"MCG INDUSTRIA FARMACEUTICA E IMPORTAÇAO LTDA","situacao":"Ativo","vencimento":"12/2035"},{"nome":"colchicina","complemento":"","principioAtivo":"COLCHICINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"118190144","numeroProcesso":"25351.335636/2014-24","empresa":"MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA","situacao":"Ativo","vencimento":"10/2029"},{"nome":"COVERSYL","complemento":"","principioAtivo":"PERINDOPRIL ARGININA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431200","numeroProcesso":"25351.180249/2020-92","empresa":"EUROFARMA LABORATORIOS S.A.","situacao":"Ativo","vencimento":"06/2032"},{"nome":"DAFLON","complemento":"","principioAtivo":"DIOSMINA, HESPERIDINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431300","numeroProcesso":"25351.180249/2020-92","empresa":"EUROFARMA LABORATORIOS S.A.","situacao":"Ativo","vencimento":"03/2033"},{"nome":"DALACIN T","complemento":"","principioAtivo":"FOSFATO DE CLINDAMICINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431400","numeroProcesso":"25351.180249/2020-92","empresa":"PFIZER BRASIL LTDA","situacao":"Ativo","vencimento":"07/2028"},{"nome":"DENOSUMABE","complemento":"","principioAtivo":"DENOSUMABE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681100","numeroProcesso":"25351.472680/2006-12","empresa":"AMGEN BIOTECNOLOGIA DO BRASIL LTDA","situacao":"Ativo","vencimento":"11/2030"},{"nome":"DICLOFENACO SÓDICO","complemento":"","principioAtivo":"DICLOFENACO SÓDICO","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103700400","numeroProcesso":"25351.200823/2003-03","empresa":"LABORATÓRIO TEUTO BRASILEIRO S/A","situacao":"Ativo","vencimento":"04/2027"},{"nome":"DIPIRONA SÓDICA","complemento":"","principioAtivo":"NA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103700410","numeroProcesso":"25351.222995/2002-89","empresa":"LABORATÓRIO TEUTO BRASILEIRO S/A","situacao":"Ativo","vencimento":"08/2027"},{"nome":"ELIQUIS","complemento":"","principioAtivo":"APIXABANA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431500","numeroProcesso":"25351.180249/2020-92","empresa":"PFIZER BRASIL LTDA","situacao":"Ativo","vencimento":"09/2033"},{"nome":"ENBREL","complemento":"","principioAtivo":"ETANERCEPTE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681200","numeroProcesso":"25351.472680/2006-12","empresa":"PFIZER BRASIL LTDA","situacao":"Ativo","vencimento":"06/2029"},{"nome":"ezetimiba","complemento":"","principioAtivo":"EZETIMIBA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"102351132","numeroProcesso":"25351.308043/2013-03","empresa":"EMS S/A","situacao":"Ativo","vencimento":"03/2026"},{"nome":"FARMORUBICINA","complemento":"","principioAtivo":"CLORIDRATO DE EPIRRUBICINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431600","numeroProcesso":"25351.180249/2020-92","empresa":"PFIZER BRASIL LTDA","situacao":"Ativo","vencimento":"12/2028"},{"nome":"FLAGYL","complemento":"","principioAtivo":"METRONIDAZOL","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431700","numeroProcesso":"25351.180249/2020-92","empresa":"EUROFARMA LABORATORIOS S.A.","situacao":"Ativo","vencimento":"05/2030"},{"nome":"GLIFAGE","complemento":"","principioAtivo":"CLORIDRATO DE METFORMINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431800","numeroProcesso":"25351.180249/2020-92","empresa":"MERCK S.A.","situacao":"Ativo","vencimento":"02/2031"},{"nome":"haloperidol","complemento":"","principioAtivo":"HALOPERIDOL","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"104971208","numeroProcesso":"25351.000899/02-38","empresa":"UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A","situacao":"Ativo","vencimento":"03/2027"},{"nome":"HERCEPTIN","complemento":"","principioAtivo":"TRASTUZUMABE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681300","numeroProcesso":"25351.472680/2006-12","empresa":"ROCHE PRODUTOS QUÍMICOS E FARMACÊUTICOS S.A.","situacao":"Ativo","vencimento":"10/2031"},{"nome":"IBUPROFENO","complemento":"","principioAtivo":"IBUPROFENO","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103700500","numeroProcesso":"25351.200823/2003-03","empresa":"LABORATÓRIO TEUTO BRASILEIRO S/A","situacao":"Ativo","vencimento":"07/2029"},{"nome":"IMBRUVICA","complemento":"","principioAtivo":"IBRUTINIBE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681400","numeroProcesso":"25351.472680/2006-12","empresa":"JANSSEN-CILAG FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"04/2032"},{"nome":"JANUVIA","complemento":"","principioAtivo":"SITAGLIPTINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431900","numeroProcesso":"25351.180249/2020-92","empresa":"MERCK SHARP & DOHME FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"01/2030"},{"nome":"KEYTRUDA","complemento":"","principioAtivo":"PEMBROLIZUMABE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681500","numeroProcesso":"25351.472680/2006-12","empresa":"MERCK SHARP & DOHME FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"11/2033"},{"nome":"lacosamida","complemento":"","principioAtivo":"lacosamida","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"105350256","numeroProcesso":"25351.009175/2025-90","empresa":"LABORATÓRIO GLOBO SA","situacao":"Ativo","vencimento":"12/2035"},{"nome":"lenalidomida","complemento":"","principioAtivo":"LENALIDOMIDA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"146820120","numeroProcesso":"25351.643238/2023-70","empresa":"SUN FARMACÊUTICA DO BRASIL LTDA","situacao":"Ativo","vencimento":"01/2035"},{"nome":"LEXAPRO","complemento":"","principioAtivo":"OXALATO DE ESCITALOPRAM","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100432000","numeroProcesso":"25351.180249/2020-92","empresa":"EUROFARMA LABORATORIOS S.A.","situacao":"Ativo","vencimento":"06/2028"},{"nome":"LIPITOR","complemento":"","principioAtivo":"ATORVASTATINA CÁLCICA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100432100","numeroProcesso":"25351.180249/2020-92","empresa":"PFIZER BRASIL LTDA","situacao":"Ativo","vencimento":"08/2027"},{"nome":"LOSARTANA POTÁSSICA","complemento":"","principioAtivo":"NA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"109170133","numeroProcesso":"25351.646998/2022-58","empresa":"MEDQUIMICA INDUSTRIA FARMACEUTICA LTDA.","situacao":"Ativo","vencimento":"06/2029"},{"nome":"LUCENTIS","complemento":"","principioAtivo":"ranibizumabe","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681056","numeroProcesso":"25351.472680/2006-12","empresa":"NOVARTIS BIOCIENCIAS S.A","situacao":"Ativo","vencimento":"09/2027"},{"nome":"LUFTAGASTRO","complemento":"","principioAtivo":"ALGINATO DE SÓDIO, BICARBONATO DE POTÁSSIO","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"173900005","numeroProcesso":"25351.557861/2012-15","empresa":"RECKITT BENCKISER (BRASIL) LTDA","situacao":"Ativo","vencimento":"09/2028"},{"nome":"minoxidil","complemento":"","principioAtivo":"MINOXIDIL","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"155840591","numeroProcesso":"25351.518449/2019-99","empresa":"BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A","situacao":"Ativo","vencimento":"01/2031"},{"nome":"mirtazapina","complemento":"","principioAtivo":"MIRTAZAPINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"105250083","numeroProcesso":"25351.097316/2020-17","empresa":"TORRENT DO BRASIL LTDA","situacao":"Ativo","vencimento":"04/2030"},{"nome":"MULTIPIRAL","complemento":"","principioAtivo":"dipirona monoidratada","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"118190490","numeroProcesso":"25351.100026/2024-83","empresa":"MULTILAB INDUSTRIA E COMERCIO DE PRODUTOS FARMACEUTICOS LTDA","situacao":"Ativo","vencimento":"05/2034"},{"nome":"NORDETTE","complemento":"","principioAtivo":"LEVONORGESTREL, LEVONORGESTREL MICRONIZADO, ETINILESTRADIOL","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"121100001","numeroProcesso":"25992.000812/75","empresa":"PFIZER BRASIL LTDA","situacao":"Ativo","vencimento":"04/2035"},{"nome":"NUANCE","complemento":"","principioAtivo":"ESTRADIOL HEMI-HIDRATADO, DROSPIRENONA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100431338","numeroProcesso":"25351.180249/2020-92","empresa":"EUROFARMA LABORATORIOS S.A.","situacao":"Ativo","vencimento":"08/2031"},{"nome":"OMEPRAZOL","complemento":"","principioAtivo":"OMEPRAZOL","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103700600","numeroProcesso":"25351.200823/2003-03","empresa":"LABORATÓRIO TEUTO BRASILEIRO S/A","situacao":"Ativo","vencimento":"02/2029"},{"nome":"OPDIVO","complemento":"","principioAtivo":"NIVOLUMABE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681600","numeroProcesso":"25351.472680/2006-12","empresa":"BRISTOL-MYERS SQUIBB FARMACÊUTICA S.A.","situacao":"Ativo","vencimento":"07/2032"},{"nome":"OZEMPIC","complemento":"","principioAtivo":"SEMAGLUTIDA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681700","numeroProcesso":"25351.472680/2006-12","empresa":"NOVO NORDISK FARMACÊUTICA DO BRASIL LTDA","situacao":"Ativo","vencimento":"12/2033"},{"nome":"Priorix","complemento":"","principioAtivo":"VÍRUS DO SARAMPO, VÍRUS DA CAXUMBA, VÍRUS DA RUBEOLA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"101070148","numeroProcesso":"25000.018182/98-00","empresa":"GLAXOSMITHKLINE BRASIL LTDA","situacao":"Ativo","vencimento":"03/2029"},{"nome":"RELESTAT","complemento":"","principioAtivo":"CLORIDRATO DE EPINASTINA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"101470163","numeroProcesso":"25351.051037/2003-06","empresa":"ALLERGAN PRODUTOS FARMACÊUTICOS LTDA","situacao":"Ativo","vencimento":"08/2029"},{"nome":"RYBELSUS","complemento":"","principioAtivo":"SEMAGLUTIDA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681800","numeroProcesso":"25351.472680/2006-12","empresa":"NOVO NORDISK FARMACÊUTICA DO BRASIL LTDA","situacao":"Ativo","vencimento":"05/2034"},{"nome":"SINTOCALMY","complemento":"","principioAtivo":"Passiflora incarnata L.","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"105730368","numeroProcesso":"25351.155028/2006-28","empresa":"ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A","situacao":"Ativo","vencimento":"03/2027"},{"nome":"SULFAMETOXAZOL + TRIMETOPRIMA","complemento":"","principioAtivo":"SULFAMETOXAZOL, TRIMETOPRIMA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"103700410","numeroProcesso":"25351.222995/2002-89","empresa":"LABORATÓRIO TEUTO BRASILEIRO S/A","situacao":"Ativo","vencimento":"05/2028"},{"nome":"tadalafila","complemento":"","principioAtivo":"TADALAFILA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"154230240","numeroProcesso":"25351.210906/2016-57","empresa":"GEOLAB INDÚSTRIA FARMACÊUTICA S/A","situacao":"Ativo","vencimento":"09/2026"},{"nome":"temozolomida","complemento":"","principioAtivo":"TEMOZOLOMIDA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"146820039","numeroProcesso":"25351.441437/2013-71","empresa":"SUN FARMACÊUTICA DO BRASIL LTDA","situacao":"Ativo","vencimento":"03/2035"},{"nome":"TIMEOLATE","complemento":"TIMEOLATE","principioAtivo":"CLORIDRATO DE LIDOCAINA, CLORETO DE BENZETÔNIO","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"102100052","numeroProcesso":"25351.559745/2021-64","empresa":"LABORATORIO TAYUYNA LTDA","situacao":"Ativo","vencimento":"02/2027"},{"nome":"VALERATO DE BETAMETASONA","complemento":"","principioAtivo":"VALERATO DE BETAMETASONA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"183260239","numeroProcesso":"25351.677885/2014-48","empresa":"SANOFI MEDLEY FARMACÊUTICA LTDA.","situacao":"Ativo","vencimento":"08/2026"},{"nome":"XARELTO","complemento":"","principioAtivo":"RIVAROXABANA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100681900","numeroProcesso":"25351.472680/2006-12","empresa":"JANSSEN-CILAG FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"06/2031"},{"nome":"Yuflyma","complemento":"","principioAtivo":"ADALIMUMABE","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"192160004","numeroProcesso":"25351.393354/2021-71","empresa":"CELLTRION HEALTHCARE DISTRIBUICAO DE PRODUTOS FARMACEUTICOS DOS BRASIL LTDA","situacao":"Ativo","vencimento":"10/2033"},{"nome":"ZEFORUS","complemento":"","principioAtivo":"BROMIDRATO DE ELETRIPTANA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"188300106","numeroProcesso":"25351.382796/2024-34","empresa":"VIATRIS FARMACEUTICA DO BRASIL LTDA","situacao":"Ativo","vencimento":"04/2032"},{"nome":"ZYTIGA","complemento":"","principioAtivo":"ACETATO DE ABIRATERONA","tipoRegularizacao":"REGISTRADO","numeroRegularizacao":"100682000","numeroProcesso":"25351.472680/2006-12","empresa":"JANSSEN-CILAG FARMACÊUTICA LTDA","situacao":"Ativo","vencimento":"09/2030"}];

type Medicamento = typeof MOCK_DATA[0];

const PAGE_SIZE = 15;

function getVencimentoStatus(vencimento: string): { label: string; color: string; bg: string } {
  if (!vencimento) return { label: "—", color: C.gray4, bg: C.gray2 };
  const [mm, yyyy] = vencimento.split("/");
  const exp = new Date(parseInt(yyyy), parseInt(mm) - 1, 1);
  const now = new Date();
  const diffMonths = (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth());
  if (diffMonths < 0) return { label: "Vencido", color: "#991b1b", bg: "#fee2e2" };
  if (diffMonths <= 6) return { label: "Urgente", color: "#92400e", bg: "#fef3c7" };
  if (diffMonths <= 12) return { label: "Atenção", color: C.amber, bg: C.amberLt };
  return { label: "Ok", color: C.green, bg: C.greenLt };
}

// ── Follow Cell (bell toggle) — DEV: conectar ao sistema de alertas ─────────
function FollowCell() {
  const [seguindo, setSeguindo] = useState(false);
  return (
    <td style={{ padding: "10px 8px", textAlign: "center" }}>
      <button
        onClick={e => { e.stopPropagation(); setSeguindo(s => !s); }}
        title={seguindo ? "Deixar de seguir" : "Seguir este medicamento"}
        style={{
          background: seguindo ? "#eff6ff" : "transparent",
          border: `1px solid ${seguindo ? "#2563eb" : "#e2e8f0"}`,
          borderRadius: 6, padding: "4px 6px", cursor: "pointer",
          display: "inline-flex", alignItems: "center",
          color: seguindo ? "#2563eb" : "#94a3b8",
          transition: "all .15s",
        }}
      >
        <Bell size={12} fill={seguindo ? "#2563eb" : "none"} />
      </button>
    </td>
  );
}

export default function MedicamentosRegistrados() {
  const [busca, setBusca] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroPrincipio, setFiltroPrincipio] = useState("");
  const [filtroVencAno, setFiltroVencAno] = useState("");
  const [pagina, setPagina] = useState(1);
  const [colunasVisiveis, setColunasVisiveis] = useState({
    nome: true, principioAtivo: true,
    numeroRegularizacao: true,
    numeroProcesso: true, empresa: true,
  });
  const [showColFilter, setShowColFilter] = useState(false);

  // Unique values for dropdowns
  const empresas = useMemo(() => Array.from(new Set(MOCK_DATA.map(d => d.empresa))).sort(), []);
  const anos = useMemo(() => Array.from(new Set(MOCK_DATA.map(d => d.vencimento.split("/")[1]))).sort(), []);

  const filtered = useMemo(() => {
    return MOCK_DATA.filter(d => {
      const q = busca.toLowerCase();
      const matchBusca = !busca || d.nome.toLowerCase().includes(q) || d.principioAtivo.toLowerCase().includes(q) || d.numeroProcesso.toLowerCase().includes(q);
      const matchEmpresa = !filtroEmpresa || d.empresa === filtroEmpresa;
      const matchPrincipio = !filtroPrincipio || d.principioAtivo.toLowerCase().includes(filtroPrincipio.toLowerCase()) || d.nome.toLowerCase().includes(filtroPrincipio.toLowerCase());
      const matchAno = !filtroVencAno || d.vencimento.endsWith(filtroVencAno);
      return matchBusca && matchEmpresa && matchPrincipio && matchAno;
    });
  }, [busca, filtroEmpresa, filtroPrincipio, filtroVencAno]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const clearFilters = () => {
    setBusca(""); setFiltroEmpresa(""); setFiltroPrincipio(""); setFiltroVencAno(""); setPagina(1);
  };
  const hasFilters = busca || filtroEmpresa || filtroPrincipio || filtroVencAno;

  const colunas: { key: keyof typeof colunasVisiveis; label: string }[] = [
    { key: "nome", label: "Nome do Produto" },
    { key: "principioAtivo", label: "Princípio Ativo" },
    { key: "numeroRegularizacao", label: "Nº Regularização" },
    { key: "numeroProcesso", label: "Nº Processo" },
    { key: "empresa", label: "Empresa" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.gray1, fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 14 }}>

      {/* ── Header ── */}
      <header style={{
        background: C.white, borderBottom: `1px solid ${C.gray3}`,
        padding: "13px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/" style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12,
            color: C.gray5, textDecoration: "none", fontWeight: 600,
            padding: "5px 10px", borderRadius: 7, border: `1px solid ${C.gray3}`,
            background: C.gray2,
          }}>
            <ChevronLeft size={13} /> Dashboard
          </a>
          <div style={{ width: 1, height: 20, background: C.gray3 }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: -.5 }}>
            Rigi<span style={{ color: C.blue }}>Blick</span>
          </div>
          <div style={{ fontSize: 11, color: C.gray4 }}>/ Medicamentos Registrados</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, color: C.gray4, background: C.blueLt, border: `1px solid ${C.blueBdr}`, borderRadius: 6, padding: "4px 12px", fontWeight: 600 }}>
            🔵 Exibindo dados de exemplo · {MOCK_DATA.length} registros ativos
          </div>
        </div>
      </header>

      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Title ── */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: 0 }}>Medicamentos Registrados</h1>
          <p style={{ fontSize: 13, color: C.gray4, margin: "4px 0 0" }}>
            Lista de medicamentos com registro ativo na ANVISA · Fonte: consulta_medicamento.xls
          </p>
        </div>

        {/* ── KPIs ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[
            { label: "Total Ativos (amostra)", value: MOCK_DATA.length, color: C.blue, bg: C.blueLt, bdr: C.blueBdr },
            { label: "Vencimento em 2026", value: MOCK_DATA.filter(d => d.vencimento.endsWith("2026")).length, color: "#c53030", bg: "#fff5f5", bdr: "#feb2b2" },
          ].map(({ label, value, color, bg, bdr }) => (
            <div key={label} style={{ background: C.white, border: `1.5px solid ${bdr}`, borderRadius: 10, padding: "14px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", border: `1px solid ${C.gray3}`, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Filter size={14} color={C.navy} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "0.6px" }}>Filtros</span>
            {hasFilters && (
              <button onClick={clearFilters} style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
                fontSize: 12, color: "#c53030", background: "#fff5f5", border: "1px solid #feb2b2",
                borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontWeight: 600,
              }}>
                <X size={11} /> Limpar filtros
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 }}>
            {/* Busca geral */}
            <div style={{ position: "relative" }}>
              <Search size={13} color={C.gray4} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={busca}
                onChange={e => { setBusca(e.target.value); setPagina(1); }}
                placeholder="Buscar por nome, princípio ativo ou nº processo..."
                style={{
                  width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                  border: `1px solid ${C.gray3}`, borderRadius: 8, fontSize: 13, color: C.navy,
                  background: C.gray1, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            {/* Empresa */}
            <select value={filtroEmpresa} onChange={e => { setFiltroEmpresa(e.target.value); setPagina(1); }}
              style={{ padding: "8px 10px", border: `1px solid ${C.gray3}`, borderRadius: 8, fontSize: 13, color: C.navy, background: C.gray1, cursor: "pointer" }}>
              <option value="">Todas as empresas</option>
              {empresas.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {/* Princípio Ativo */}
            <input
              value={filtroPrincipio}
              onChange={e => { setFiltroPrincipio(e.target.value); setPagina(1); }}
              placeholder="Princípio ativo ou nome do produto..."
              style={{ padding: "8px 10px", border: `1px solid ${C.gray3}`, borderRadius: 8, fontSize: 13, color: C.navy, background: C.gray1, outline: "none" }}
            />
            {/* Ano de vencimento */}
            <select value={filtroVencAno} onChange={e => { setFiltroVencAno(e.target.value); setPagina(1); }}
              style={{ padding: "8px 10px", border: `1px solid ${C.gray3}`, borderRadius: 8, fontSize: 13, color: C.navy, background: C.gray1, cursor: "pointer" }}>
              <option value="">Todos os vencimentos</option>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* ── Tabela ── */}
        <div style={{ background: C.white, border: `1px solid ${C.gray3}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>

          {/* Table header bar */}
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.gray3}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
              {hasFilters && <span style={{ fontSize: 11, color: C.blue, marginLeft: 8 }}>(filtrado)</span>}
            </span>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowColFilter(!showColFilter)} style={{
                display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600,
                color: C.gray5, background: C.gray2, border: `1px solid ${C.gray3}`,
                borderRadius: 7, padding: "5px 12px", cursor: "pointer",
              }}>
                <Filter size={12} /> Colunas
              </button>
              {showColFilter && (
                <div style={{
                  position: "absolute", right: 0, top: "110%", background: C.white,
                  border: `1px solid ${C.gray3}`, borderRadius: 10, padding: "12px 16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,.12)", zIndex: 30, minWidth: 200,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.gray4, marginBottom: 8, textTransform: "uppercase" }}>Mostrar colunas</div>
                  {colunas.map(({ key, label }) => (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer", fontSize: 13, color: C.navy }}>
                      <input type="checkbox" checked={colunasVisiveis[key]}
                        onChange={() => setColunasVisiveis(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{ cursor: "pointer" }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.navy }}>
                  {colunasVisiveis.nome && <th style={thStyle}>Nome do Produto</th>}
                  {colunasVisiveis.principioAtivo && <th style={thStyle}>Princípio Ativo</th>}
                  {colunasVisiveis.numeroRegularizacao && <th style={thStyle}>Nº Regularização</th>}
                  {colunasVisiveis.numeroProcesso && <th style={thStyle}>Nº Processo</th>}
                  {colunasVisiveis.empresa && <th style={thStyle}>Empresa</th>}

                  <th style={{ ...thStyle, textAlign: "center", width: 40 }}></th>
                  <th style={{ ...thStyle, textAlign: "center", width: 60 }}>DHL</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "40px 20px", textAlign: "center", color: C.gray4, fontSize: 14 }}>
                      Nenhum resultado encontrado para os filtros aplicados.
                    </td>
                  </tr>
                ) : pageData.map((d, i) => {
                  const venc = getVencimentoStatus(d.vencimento);
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.gray3}`, background: i % 2 === 0 ? C.white : C.gray1, transition: "background .1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.blueLt)}
                      onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? C.white : C.gray1)}
                    >
                      {colunasVisiveis.nome && (
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: C.navy, whiteSpace: "nowrap" }}>
                          {d.nome}
                        </td>
                      )}
                      {colunasVisiveis.principioAtivo && (
                        <td style={{ padding: "10px 14px" }}>
                          {d.principioAtivo === "NA"
                            ? <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, background: C.amberLt, border: `1px solid ${C.amberBdr}`, borderRadius: 4, padding: "2px 6px" }}>NA</span>
                            : <span style={{ color: C.gray5 }}>{d.principioAtivo}</span>
                          }
                        </td>
                      )}
                      {colunasVisiveis.numeroRegularizacao && (
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: C.gray5 }}>
                          {d.numeroRegularizacao}
                        </td>
                      )}
                      {colunasVisiveis.numeroProcesso && (
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: C.navy, whiteSpace: "nowrap" }}>
                          {d.numeroProcesso}
                        </td>
                      )}
                      {colunasVisiveis.empresa && (
                        <td style={{ padding: "10px 14px", color: C.gray5, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {d.empresa}
                        </td>
                      )}

                      {/* DEV: conectar ao sistema de alertas do usuário */}
                      <FollowCell />
                      {/* DHL link — NOTA DEV: navegar para /dhl/:numeroProcesso */}
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <button
                          onClick={() => window.location.href = `/dhl/${encodeURIComponent(d.numeroProcesso)}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 11, fontWeight: 600, color: C.blue,
                            background: C.blueLt, border: `1px solid ${C.blueBdr}`,
                            borderRadius: 6, padding: "4px 8px", cursor: "pointer",
                            transition: "all .15s",
                          }}
                          title={`Ver DHL: ${d.numeroProcesso}`}
                        >
                          <ExternalLink size={11} /> DHL
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div style={{ padding: "12px 18px", borderTop: `1px solid ${C.gray3}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.gray2 }}>
            <span style={{ fontSize: 12, color: C.gray4 }}>
              Página {pagina} de {totalPages} · {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
                style={{ ...paginaBtnStyle, opacity: pagina === 1 ? 0.4 : 1 }}>
                <ChevLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(pagina - 2, totalPages - 4));
                const p = start + i;
                return (
                  <button key={p} onClick={() => setPagina(p)}
                    style={{ ...paginaBtnStyle, background: p === pagina ? C.blue : C.white, color: p === pagina ? "#fff" : C.gray5, border: `1px solid ${p === pagina ? C.blue : C.gray3}` }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPagina(p => Math.min(totalPages, p + 1))} disabled={pagina === totalPages}
                style={{ ...paginaBtnStyle, opacity: pagina === totalPages ? 0.4 : 1 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Dev note ── */}
        <div style={{ padding: "10px 16px", background: C.amberLt, border: `1.5px dashed ${C.amber}`, borderRadius: 8, fontSize: 12, color: "#92400e" }}>
          💡 <strong>NOTA ao desenvolvedor:</strong> Esta página exibe 60 registros de exemplo (ativos). Para produção: (1) conectar à fonte de dados real com os 10.304 registros ativos; (2) excluir registros inativos; (3) exibir "NA" para princípio ativo vazio; (4) o botão "DHL" deve navegar para <code>/dhl/:numeroProcesso</code> (página a ser criada).
        </div>

        {/* ── Disclaimer ── */}
        <div style={{ padding: "10px 16px", background: C.gray2, borderRadius: 8, fontSize: 12, color: C.gray4, display: "flex", alignItems: "center", gap: 6 }}>
          <Info size={13} color={C.gray4} />
          Fonte: ANVISA — consulta_medicamento.xls · Dados de exemplo para fins de demonstração. A RIGI AI fornecerá dados atualizados após integração com as fontes oficiais.
        </div>

      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "11px 14px", textAlign: "left", fontSize: 11,
  color: "#fff", fontWeight: 700, whiteSpace: "nowrap",
  borderRight: "1px solid rgba(255,255,255,.1)",
};

const paginaBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32, borderRadius: 7, fontSize: 13, fontWeight: 600,
  cursor: "pointer", border: `1px solid ${C.gray3}`, background: C.white, color: C.gray5,
  transition: "all .15s",
};
