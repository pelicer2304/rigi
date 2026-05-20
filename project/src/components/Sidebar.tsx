import { useState } from 'react';
import { Search, BarChart2, FileText, List, Microscope, Package, TrendingUp, Radio, Globe, ClipboardList, ChevronRight, ChevronLeft } from 'lucide-react';

const navItems = [
  { icon: Search, label: 'Buscar' },
  { icon: BarChart2, label: 'Dashboard' },
  { icon: FileText, label: 'Processos' },
  { icon: List, label: 'Filas' },
  { icon: Microscope, label: 'IFA Monitor' },
  { icon: Package, label: 'Medicamentos' },
  { icon: TrendingUp, label: 'Tempos ANVISA' },
  { icon: Radio, label: 'Webcasts' },
  { icon: Globe, label: 'Notícias' },
  { icon: ClipboardList, label: 'Consultas' },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="flex flex-col py-3 gap-1 rounded-[22px] flex-shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: expanded ? 170 : 44,
        background: 'linear-gradient(180deg, rgba(13,15,18,0.96), rgba(42,46,50,0.90))',
        backdropFilter: 'blur(28px) saturate(140%)',
        WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-7 h-7 mx-auto mb-1.5 flex items-center justify-center rounded-lg transition-all duration-200"
        style={{ background: 'rgba(113,157,190,0.3)', color: '#FFFFFF' }}
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Nav items */}
      {navItems.map(({ icon: Icon, label }, i) => (
        <button
          key={i}
          className="flex items-center gap-2.5 rounded-lg transition-all duration-200 mx-1.5"
          style={{
            padding: expanded ? '6px 10px' : '6px',
            justifyContent: expanded ? 'flex-start' : 'center',
            background: i === 1 ? 'rgba(113,157,190,0.4)' : 'transparent',
            color: i === 1 ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
            minHeight: 32,
          }}
          onMouseEnter={e => {
            if (i !== 1) (e.currentTarget as HTMLElement).style.background = 'rgba(113,157,190,0.25)';
          }}
          onMouseLeave={e => {
            if (i !== 1) (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <Icon size={15} style={{ flexShrink: 0 }} />
          {expanded && (
            <span className="text-xs font-medium whitespace-nowrap overflow-hidden" style={{ opacity: expanded ? 1 : 0, transition: 'opacity 0.2s' }}>
              {label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
