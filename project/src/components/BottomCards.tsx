import { useState, useMemo } from 'react';
import { MoreHorizontal, ArrowUpRight, TrendingUp, BarChart2, Package, Microscope, Newspaper, FileText, Building2 } from 'lucide-react';

// ── Shared card wrapper ───────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.30)',
  backdropFilter: 'blur(32px) saturate(140%)',
  WebkitBackdropFilter: 'blur(32px) saturate(140%)',
  border: '1px solid rgba(255,255,255,0.58)',
  boxShadow: '0 24px 70px rgba(38,66,88,0.09), inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -1px 0 rgba(255,255,255,0.20)',
  overflow: 'hidden',
};

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div>
        <h2 className="text-sm font-semibold" style={{ color: '#111827' }}>{title}</h2>
        <div className="text-xs" style={{ color: '#9CA3AF' }}>{subtitle}</div>
      </div>
      <div className="flex gap-1.5">
        <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <ArrowUpRight size={13} style={{ color: '#9CA3AF' }} />
        </button>
        <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <MoreHorizontal size={13} style={{ color: '#9CA3AF' }} />
        </button>
      </div>
    </div>
  );
}

// ── 1. Tempos Médios ANVISA ───────────────────────────────────────────────────
function TemposMedios() {
  const months = ['Jan', 'Mar', 'Mai', 'Jul', 'Set', 'Nov'];
  const points = [18, 20, 22, 25, 28, 32];
  const max = 40;
  const w = 240;
  const h = 60;
  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / max) * h;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      {/* Decorative glows */}
      <div className="absolute pointer-events-none" style={{ top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(113,157,190,0.20), transparent 65%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-15%', left: '-5%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(192,212,226,0.18), transparent 65%)', filter: 'blur(35px)', zIndex: 0 }} />
      <div className="relative z-10">
      <CardHeader title="Tempos médios ANVISA" subtitle="Comparativo 2025 vs 2024" />
      <div className="flex items-end gap-3 mt-3 mb-3">
        <span className="text-3xl font-bold" style={{ color: '#111827' }}>32</span>
        <span className="text-sm" style={{ color: '#6B7280' }}>meses · genéricos</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full ml-2" style={{ background: 'rgba(113,157,190,0.12)', color: '#719DBE' }}>+4 vs 2024</span>
      </div>
      <div style={{ height: 60 }}>
        <svg width="100%" height="60" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke="#719DBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={w} cy={h - (points[points.length - 1] / max) * h} r="4" fill="#719DBE" />
        </svg>
      </div>
      <div className="flex justify-between mt-1">
        {months.map(m => <span key={m} className="text-[10px]" style={{ color: '#9CA3AF' }}>{m}</span>)}
      </div>
      </div>{/* close z-10 */}
    </div>
  );
}

// ── 2. Atividade Regulatória (GitHub contribution graph) ──────────────────────
function AtividadeRegulatoria() {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Stable data
  const data = useMemo(() => {
    const weeks = 20;
    const result: { date: string; count: number }[][] = [];
    const today = new Date();
    const values = [0,2,1,3,0,4,2,1,3,5,2,0,1,4,3,2,5,1,0,3,4,2,1,0,5,3,2,4,1,0,2,3,5,1,4,2,0,3,1,2,4,5,0,1,3,2,4,1,5,0,2,3,1,4,2,5,3,0,4,1,2,5,3,1,0,4,2,3,5,1,4,0,2,3,1,5,4,2,0,3,1,5,2,4,0,3,5,1,2,4,3,0,5,2,1,4,3,2,0,5,1,3,4,2,0,1,5,3,2,4,1,0,3,5,2,4,1,3,0,5,2,1,4,3,5,0,2,1,4,3,5,2,0,1,4,3,2,5,1,0];
    let idx = 0;
    for (let w = weeks - 1; w >= 0; w--) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dayOffset = w * 7 + (6 - d);
        const date = new Date(today);
        date.setDate(date.getDate() - dayOffset);
        week.push({
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          count: values[idx % values.length],
        });
        idx++;
      }
      result.push(week);
    }
    return result;
  }, []);

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(113,157,190,0.06)';
    const colors = ['rgba(113,157,190,0.18)', 'rgba(113,157,190,0.32)', 'rgba(113,157,190,0.48)', 'rgba(113,157,190,0.65)', 'rgba(113,157,190,0.85)'];
    return colors[Math.min(count - 1, 4)];
  };

  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      {/* Decorative glows */}
      <div className="absolute pointer-events-none" style={{ top: '20%', left: '-10%', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(113,157,190,0.22), transparent 60%)', filter: 'blur(45px)', zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-10%', right: '-5%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(192,212,226,0.20), transparent 65%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ top: '5%', right: '20%', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(113,157,190,0.12), transparent 65%)', filter: 'blur(35px)', zIndex: 0 }} />
      {/* Large blue glow behind heatmap area */}
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '20%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(113,157,190,0.10), transparent 70%)', filter: 'blur(30px)', zIndex: 0 }} />
      <div className="relative z-10">
      <style>{`
        @keyframes cell-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .heatmap-cell:hover { animation: cell-pulse 0.3s ease; box-shadow: 0 0 0 2px #719DBE; z-index: 10; position: relative; }
      `}</style>
      <CardHeader title="Atividade regulatória" subtitle="Últimas 20 semanas" />
      <div className="flex items-end gap-3 mt-3 mb-3">
        <span className="text-3xl font-bold" style={{ color: '#111827' }}>187</span>
        <span className="text-sm" style={{ color: '#6B7280' }}>publicações</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full ml-2" style={{ background: 'rgba(113,157,190,0.12)', color: '#719DBE' }}>+12%</span>
      </div>

      {/* Contribution graph — compact */}
      <div className="relative" data-heatmap>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 2, width: '100%' }}>
          {data.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  className="heatmap-cell"
                  style={{
                    width: '100%',
                    height: '10px',
                    borderRadius: 2,
                    background: getColor(day.count),
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parent = (e.currentTarget.closest('[data-heatmap]') as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      text: `${day.count} publicações — ${day.date}`,
                      x: rect.left - parent.left + rect.width / 2,
                      y: rect.top - parent.top - 4,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {tooltip && (
          <div
            className="absolute pointer-events-none px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap"
            style={{
              background: 'rgba(0,0,0,0.88)',
              color: '#fff',
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 50,
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-2">
        <span className="text-[10px]" style={{ color: '#9CA3AF' }}>S-20</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px]" style={{ color: '#9CA3AF' }}>menos</span>
          {[0, 1, 2, 3, 4, 5].map(v => (
            <div key={v} className="w-[10px] h-[10px] rounded-sm" style={{ background: getColor(v) }} />
          ))}
          <span className="text-[10px]" style={{ color: '#9CA3AF' }}>mais</span>
        </div>
        <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Atual</span>
      </div>
      </div>{/* close z-10 */}
    </div>
  );
}

// ── 3. Meus Painéis ───────────────────────────────────────────────────────────
function MeusPaineis() {
  const panels = [
    { icon: TrendingUp, label: 'Análise de Tempos' },
    { icon: Package, label: 'Medicamentos Registrados' },
    { icon: BarChart2, label: 'Estatísticas ANVISA' },
    { icon: Microscope, label: 'Pipeline Regulatório' },
  ];

  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      {/* Decorative glows */}
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(236,234,60,0.15), transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-10%', left: '-10%', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(113,157,190,0.15), transparent 65%)', filter: 'blur(35px)', zIndex: 0 }} />
      <div className="relative z-10">
      <CardHeader title="Meus painéis" subtitle="Atalhos personalizados" />
      <div className="grid grid-cols-2 gap-3 mt-4">
        {panels.map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(113,157,190,0.1)' }}>
              <Icon size={15} style={{ color: '#719DBE' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#111827' }}>{label}</span>
          </div>
        ))}
      </div>
      </div>{/* close z-10 */}
    </div>
  );
}

// ── 4. Notícias ANVISA (ticker marquee) ───────────────────────────────────────
function NoticiasAnvisa() {
  const noticias = [
    { title: "Novas indicações aprovadas para Keytruda e Imfinzi no tratamento de câncer", date: "23 Fev 2026", cat: "Registro" },
    { title: "ANVISA aprova regras para produção de Cannabis Medicinal no Brasil", date: "28 Jan 2026", cat: "Regulatório" },
    { title: "Receituários controlados: nova norma RDC 1.000 entra em vigor", date: "13 Fev 2026", cat: "RDC" },
    { title: "Aprovado medicamento inédito para tratamento da doença de Alzheimer", date: "08 Jan 2026", cat: "Registro" },
    { title: "Nova indicação de medicamento para prevenção do HIV-1", date: "12 Jan 2026", cat: "Registro" },
  ];

  const catColor: Record<string, string> = { Registro: '#719DBE', Regulatório: '#719DBE', RDC: '#D97706' };

  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      <style>{`
        @keyframes ticker { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .ticker-track { animation: ticker 20s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper size={14} style={{ color: '#719DBE' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#111827' }}>Notícias ANVISA</h2>
        </div>
        <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <ArrowUpRight size={13} style={{ color: '#9CA3AF' }} />
        </button>
      </div>

      {/* Vertical ticker — scrolls up continuously, pauses on hover */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        {/* Fade edges */}
        <div className="absolute top-0 left-0 right-0 h-6 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)', zIndex: 2 }} />
        <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.3), transparent)', zIndex: 2 }} />

        <div className="ticker-track flex flex-col gap-2">
          {/* Duplicate for seamless loop */}
          {[...noticias, ...noticias].map((n, i) => (
            <div key={i} className="rounded-xl p-3 cursor-pointer transition-all duration-200 hover:scale-[1.01] flex-shrink-0" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
              <div className="text-xs font-semibold leading-tight" style={{ color: '#111827' }}>{n.title}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{n.date}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${catColor[n.cat]}15`, color: catColor[n.cat] }}>{n.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 5. Expedientes / Processos ────────────────────────────────────────────────
function Expedientes() {
  const processos = [
    { processo: "25351.100002/2026-02", data: "07/03/2026", status: "Em análise", changed: false },
    { processo: "25351.100003/2026-03", data: "12/03/2026", status: "Exigência", changed: true },
    { processo: "25351.100004/2026-04", data: "15/03/2026", status: "Em análise", changed: false },
  ];

  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={14} style={{ color: '#719DBE' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#111827' }}>Processos que Sigo</h2>
        </div>
        <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <ArrowUpRight size={13} style={{ color: '#9CA3AF' }} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {processos.map((p, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: '#111827' }}>{p.processo}</div>
              <div className="text-[10px]" style={{ color: '#9CA3AF' }}>{p.data}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                background: p.status === 'Exigência' ? 'rgba(217,119,6,0.12)' : 'rgba(113,157,190,0.1)',
                color: p.status === 'Exigência' ? '#D97706' : '#719DBE',
              }}>{p.status}</span>
              {p.changed && <span className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} />}
            </div>
          </div>
        ))}
      </div>
      <div className="text-[10px] mt-2 font-medium" style={{ color: '#D97706' }}>1 processo(s) com mudança de status</div>
    </div>
  );
}

// ── 6. Atualizações de Bula ───────────────────────────────────────────────────
function AtualizacoesBula() {
  const bulas = [
    { medicamento: "Semaglutida 1mg/mL Sol. Inj.", data: "20/03/2026" },
    { medicamento: "Denosumabe 60mg/mL Sol. Inj.", data: "18/03/2026" },
    { medicamento: "Empagliflozina 10mg Comp.", data: "15/03/2026" },
    { medicamento: "Levetiracetam 500mg Comp.", data: "10/03/2026" },
  ];

  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      <CardHeader title="Atualizações de Bula" subtitle="Últimas alterações" />
      <div className="flex flex-col gap-2 mt-3">
        {bulas.map((b, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <span className="text-xs font-semibold truncate" style={{ color: '#111827' }}>{b.medicamento}</span>
            <span className="text-[10px] flex-shrink-0 ml-2" style={{ color: '#9CA3AF' }}>{b.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 7. Painel Pfizer ──────────────────────────────────────────────────────────
function PainelPfizer() {
  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={cardStyle}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 size={14} style={{ color: '#719DBE' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#111827' }}>Painel Pfizer</h2>
        </div>
        <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <ArrowUpRight size={13} style={{ color: '#9CA3AF' }} />
        </button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: 'Total Registros', value: '130' },
          { label: 'Em Análise', value: '25' },
          { label: 'Pós-Registro', value: '75' },
          { label: 'Renovação 2026', value: '30' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <div className="text-lg font-bold" style={{ color: '#111827' }}>{m.value}</div>
            <div className="text-[10px]" style={{ color: '#9CA3AF' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-medium mb-1.5" style={{ color: '#6B7280' }}>Gestores Regulatórios</div>
      <div className="text-xs mb-3" style={{ color: '#111827' }}>Claudia Scordamaglia · Juliana Rocha</div>

      <div className="text-[10px] font-medium mb-1.5" style={{ color: '#6B7280' }}>Renovações de Registro em 2026</div>
      <div className="flex flex-col gap-1.5">
        {[
          { produto: 'Produto A', status: '6 meses', processo: '25351.001234/2026-01', exp: '12/03/2026' },
          { produto: 'Produto B', status: 'Ok', processo: '25351.005678/2026-02', exp: '04/08/2026' },
          { produto: 'Produto C', status: 'Urgente', processo: '25351.009012/2026-03', exp: '15/01/2026' },
        ].map(r => (
          <div key={r.processo} className="flex items-center justify-between rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <div>
              <div className="text-[10px] font-semibold" style={{ color: '#111827' }}>{r.produto}</div>
              <div className="text-[9px]" style={{ color: '#9CA3AF' }}>{r.processo}</div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold" style={{ color: r.status === 'Urgente' ? '#D97706' : r.status === 'Ok' ? '#719DBE' : '#D97706' }}>{r.status}</span>
              <div className="text-[9px]" style={{ color: '#9CA3AF' }}>Exp: {r.exp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export default function BottomCards() {
  return (
    <div className="flex flex-col gap-4">
      {/* Row 1 — Atividade limited to same height as siblings */}
      <div className="flex gap-4" style={{ maxHeight: '320px' }}>
        <TemposMedios />
        <AtividadeRegulatoria />
        <MeusPaineis />
      </div>
      {/* Row 2 */}
      <div className="flex gap-4">
        <NoticiasAnvisa />
        <Expedientes />
        <AtualizacoesBula />
        <PainelPfizer />
      </div>
    </div>
  );
}
