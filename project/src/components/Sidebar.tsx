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
      className="flex flex-col py-4 gap-1 rounded-[28px] flex-shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: expanded ? 180 : 48,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-xl transition-all duration-200"
        style={{ background: 'rgba(113,157,190,0.3)', color: '#FFFFFF' }}
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Nav items */}
      {navItems.map(({ icon: Icon, label }, i) => (
        <button
          key={i}
          className="flex items-center gap-3 rounded-xl transition-all duration-200 mx-2"
          style={{
            padding: expanded ? '8px 12px' : '8px',
            justifyContent: expanded ? 'flex-start' : 'center',
            background: i === 1 ? 'rgba(113,157,190,0.4)' : 'transparent',
            color: i === 1 ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
            minHeight: 36,
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
