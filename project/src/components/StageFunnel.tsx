import { MoreHorizontal, ArrowUpRight, RefreshCw } from 'lucide-react';

const stages = [
  { label: 'Denosumabe (+2)', amount: 'Em análise', pct: 92 },
  { label: 'Semaglutida (+1)', amount: 'Em análise', pct: 67 },
  { label: 'Empagliflozino (+1)', amount: 'Em análise', pct: 45 },
];

const barColors = ['rgba(113,157,190,0.22)', 'rgba(192,212,226,0.35)', 'rgba(113,157,190,0.18)'];
const trackColors = ['rgba(113,157,190,0.7)', 'rgba(113,157,190,0.55)', 'rgba(192,212,226,0.8)'];

export default function StageFunnel() {
  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden flex-1" style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.45)', boxShadow: '0 20px 60px rgba(31,41,55,0.08)' }}>
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
