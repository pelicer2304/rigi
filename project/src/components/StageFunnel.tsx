import { MoreHorizontal, ArrowUpRight, RefreshCw } from 'lucide-react';

const stages = [
  { label: 'Denosumabe (+2)', amount: 'Em análise', pct: 92 },
  { label: 'Semaglutida (+1)', amount: 'Em análise', pct: 67 },
  { label: 'Empagliflozino (+1)', amount: 'Em análise', pct: 45 },
];

const barColors = ['rgba(47,91,224,0.16)', 'rgba(64,141,153,0.16)', 'rgba(226,232,48,0.14)'];
const trackColors = ['rgba(47,91,224,0.62)', 'rgba(64,141,153,0.58)', 'rgba(200,205,40,0.60)'];

export default function StageFunnel() {
  return (
    <div className="relative rounded-[22px] p-4 overflow-hidden flex-1 glass-panel" style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(32px) saturate(140%)', border: '1px solid rgba(255,255,255,0.58)', boxShadow: '0 24px 70px rgba(38,66,88,0.09), inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -1px 0 rgba(255,255,255,0.20)' }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold" style={{ color: '#000000' }}>IFAs em Análise</h2>
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}><MoreHorizontal size={13} style={{ color: '#719DBE' }} /></button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}><ArrowUpRight size={13} style={{ color: '#719DBE' }} /></button>
        </div>
      </div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-2xl font-bold" style={{ color: '#000000' }}>+7 novos</div>
          <div className="text-xs" style={{ color: '#719DBE' }}>Processos hoje</div>
        </div>
        <div className="flex rounded-full p-0.5 gap-0.5" style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(255,255,255,0.5)' }}>
          <button className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.8)', color: '#000000' }}>Hoje</button>
          <button className="px-3 py-1 rounded-full text-xs font-medium" style={{ color: '#719DBE' }}>Semana</button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium" style={{ color: '#000000' }}>{stage.label}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-9 rounded-full relative overflow-hidden" style={{ background: barColors[i] }}>
                <div className="h-full rounded-full" style={{ width: `${stage.pct}%`, background: trackColors[i], backdropFilter: 'blur(8px)' }} />
                <div className="absolute inset-0 flex items-center px-3"><span className="text-sm font-semibold" style={{ color: '#000000' }}>{stage.amount}</span></div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)' }}>
                <RefreshCw size={12} style={{ color: '#719DBE' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
