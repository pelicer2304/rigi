import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

const avatars = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop',
];

interface DealCardProps {
  date: string;
  name: string;
  subtitle: string;
  amount: string;
  variant: 'blue' | 'teal' | 'black' | 'yellow' | 'white';
}

function DealCard({ date, name, subtitle, amount, variant }: DealCardProps) {
  const styles: Record<string, React.CSSProperties> = {
    blue: { background: 'linear-gradient(135deg, rgba(55,95,230,0.88), rgba(125,155,242,0.66))', backdropFilter: 'blur(18px) saturate(130%)', border: '1px solid rgba(255,255,255,0.32)', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -20px 40px rgba(255,255,255,0.06), 0 16px 38px rgba(55,95,230,0.16)' },
    teal: { background: 'linear-gradient(135deg, rgba(70,150,162,0.82), rgba(170,218,220,0.58))', backdropFilter: 'blur(18px) saturate(130%)', border: '1px solid rgba(255,255,255,0.34)', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -20px 40px rgba(255,255,255,0.06), 0 16px 38px rgba(70,150,162,0.13)' },
    black: { background: 'linear-gradient(135deg, rgba(13,15,18,0.94), rgba(48,53,58,0.88))', backdropFilter: 'blur(18px) saturate(120%)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 42px rgba(0,0,0,0.20)' },
    yellow: { background: 'linear-gradient(135deg, rgba(226,233,48,0.84), rgba(245,248,125,0.62))', backdropFilter: 'blur(18px) saturate(130%)', border: '1px solid rgba(255,255,255,0.36)', color: '#1a1a1a', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -20px 40px rgba(255,255,255,0.08), 0 16px 34px rgba(180,185,38,0.13)' },
    white: { background: 'rgba(255,255,255,0.38)', backdropFilter: 'blur(22px) saturate(130%)', border: '1px solid rgba(255,255,255,0.52)', color: '#1a2a3a', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.62), 0 12px 28px rgba(40,65,85,0.05)' },
  };

  const isLight = variant === 'yellow' || variant === 'white';

  return (
    <div
      className={`relative rounded-[18px] p-3.5 flex flex-col justify-between h-[118px] transition-transform duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden ${variant === 'black' ? 'urgent-card' : ''}`}
      style={styles[variant]}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: isLight ? 'rgba(14,24,34,0.60)' : 'rgba(255,255,255,0.75)' }}>{date}</div>
          <div className="text-sm font-bold leading-tight" style={{ color: isLight ? 'rgba(14,24,34,0.94)' : 'rgba(255,255,255,0.96)', textShadow: isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.10)' }}>{name}</div>
          <div className="text-xs mt-0.5" style={{ color: isLight ? 'rgba(50,72,88,0.68)' : 'rgba(255,255,255,0.65)' }}>{subtitle}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {variant === 'black' && <span className="urgent-pulse" />}
          <button className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)' }}>
            {variant === 'black' ? <ArrowUpRight size={13} style={{ color: '#fff' }} /> : <MoreHorizontal size={13} style={{ color: isLight ? '#374151' : '#fff' }} />}
          </button>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-lg font-extrabold ${variant === 'black' ? 'urgent-badge' : ''}`} style={variant === 'black' ? {} : { color: isLight ? 'rgba(14,24,34,0.94)' : 'rgba(255,255,255,0.96)' }}>{amount}</span>
        <div className="flex -space-x-2">
          {avatars.map((src, i) => (
            <img key={i} src={src} alt="" className="w-6 h-6 rounded-full object-cover" style={{ border: `2px solid ${isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)'}` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InteractionHistory() {
  return (
    <div className="relative rounded-[22px] p-4 overflow-hidden glass-panel" style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(32px) saturate(140%)', border: '1px solid rgba(255,255,255,0.58)', boxShadow: '0 24px 70px rgba(38,66,88,0.09), inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -1px 0 rgba(255,255,255,0.20)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold" style={{ color: 'rgba(14,24,34,0.94)' }}>Registros e Destaques</h2>
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}><MoreHorizontal size={13} style={{ color: '#719DBE' }} /></button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}><ArrowUpRight size={13} style={{ color: '#719DBE' }} /></button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <DealCard date="Novo" name="Semaglutida" subtitle="Novo Nordisk" amount="Registro" variant="blue" />
        <DealCard date="Biológico" name="Denosumabe" subtitle="Amgen" amount="Registro" variant="teal" />
        <DealCard date="5 dias" name="CP 1370" subtitle="Pesquisa Clínica" amount="Urgente" variant="black" />
        <DealCard date="Genérico" name="Dipirona" subtitle="EMS" amount="Registro" variant="white" />
        <DealCard date="Biossimilar" name="Tiraglutida" subtitle="Biocon" amount="Registro" variant="white" />
        <DealCard date="Fitoterápico" name="Senne" subtitle="Natulab" amount="Registro" variant="teal" />
      </div>
    </div>
  );
}
