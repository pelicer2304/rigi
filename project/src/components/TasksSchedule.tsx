import { ChevronLeft, ChevronRight, Maximize2, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const avatarSm = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
];

const calendarDays: (number | null)[] = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, null,
];

interface CellHighlight {
  day: number;
  variant: 'blue' | 'yellow' | 'teal';
  avatarIdx?: number;
}

const highlights: CellHighlight[] = [
  { day: 5, variant: 'blue', avatarIdx: 0 },
  { day: 11, variant: 'yellow', avatarIdx: 1 },
  { day: 20, variant: 'teal', avatarIdx: 2 },
];

const variantColors: Record<string, string> = {
  blue: 'rgba(113,157,190,0.85)',
  yellow: 'rgba(192,212,226,0.92)',
  teal: 'rgba(0,0,0,0.75)',
};

const variantText: Record<string, string> = {
  blue: '#fff',
  yellow: '#000000',
  teal: '#fff',
};

export default function TasksSchedule() {
  return (
    <div
      className="relative rounded-[28px] p-5 overflow-hidden flex-1"
      style={{
        background: 'rgba(255,255,255,0.28)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: '1px solid rgba(255,255,255,0.45)',
        boxShadow: '0 20px 60px rgba(31,41,55,0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: '#000000' }}>Prazos Regulatórios</h2>
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <MoreHorizontal size={13} style={{ color: '#719DBE' }} />
          </button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <ArrowUpRight size={13} style={{ color: '#719DBE' }} />
          </button>
        </div>
      </div>

      {/* Calendar nav */}
      <div className="flex items-center justify-between mb-3">
        <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <ChevronLeft size={12} style={{ color: '#719DBE' }} />
        </button>
        <span className="text-base font-bold" style={{ color: '#000000' }}>Março</span>
        <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <ChevronRight size={12} style={{ color: '#719DBE' }} />
        </button>
        <button className="w-6 h-6 rounded-full flex items-center justify-center ml-2" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>
          <Maximize2 size={11} style={{ color: '#719DBE' }} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-medium" style={{ color: '#719DBE' }}>{d}</div>
        ))}
      </div>

      {/* Avatar overlay row */}
      <div className="grid grid-cols-7 gap-1 mb-1 relative">
        {Array.from({ length: 7 }).map((_, i) => {
          const dayNum = i + 1;
          const highlight = highlights.find(h => h.day === dayNum);
          return (
            <div key={i} className="h-5 flex items-center justify-center">
              {highlight && highlight.avatarIdx !== undefined && (
                <img
                  src={avatarSm[highlight.avatarIdx]}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover"
                  style={{ border: '1.5px solid rgba(255,255,255,0.8)' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (!day) return <div key={i} className="h-9" />;
          const highlight = highlights.find(h => h.day === day);
          return (
            <div
              key={i}
              className="h-9 rounded-xl flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-all duration-150"
              style={
                highlight
                  ? {
                      background: variantColors[highlight.variant],
                      color: variantText[highlight.variant],
                      backdropFilter: 'blur(10px)',
                    }
                  : {
                      background: 'transparent',
                      color: '#000000',
                    }
              }
              onMouseEnter={e => {
                if (!highlight) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={e => {
                if (!highlight) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
