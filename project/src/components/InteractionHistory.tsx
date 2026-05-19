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
  variant: 'primary' | 'dark' | 'light' | 'secondary' | 'glass';
}

function DealCard({ date, name, subtitle, amount, variant }: DealCardProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'rgba(113,157,190,0.88)', backdropFilter: 'blur(18px)', border: '1px solid rgba(113,157,190,0.4)', color: '#fff' },
    dark: { background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' },
    light: { background: 'rgba(192,212,226,0.85)', backdropFilter: 'blur(18px)', border: '1px solid rgba(192,212,226,0.5)', color: '#000000' },
    secondary: { background: 'rgba(113,157,190,0.55)', backdropFilter: 'blur(18px)', border: '1px solid rgba(113,157,190,0.3)', color: '#fff' },
    glass: { background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.55)', color: '#000000', boxShadow: '0 8px 32px rgba(31,41,55,0.06)' },
  };

  const isLight = variant === 'light' || variant === 'glass';

  return (
    <div
      className="relative rounded-[22px] p-4 flex flex-col justify-between h-36 transition-transform duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden"
      style={styles[variant]}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium mb-1 opacity-70">{date}</div>
          <div className="text-sm font-semibold leading-tight">{name}</div>
          <div className="text-xs opacity-60 mt-0.5">{subtitle}</div>
        </div>
        <button className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)' }}>
          {variant === 'dark' ? <ArrowUpRight size={13} style={{ color: '#fff' }} /> : <MoreHorizontal size={13} style={{ color: isLight ? '#000' : '#fff' }} />}
        </button>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-lg font-bold">{amount}</span>
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
    <div className="relative rounded-[28px] p-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.45)', boxShadow: '0 20px 60px rgba(31,41,55,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: '#000000' }}>Registros e Destaques</h2>
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}><MoreHorizontal size={13} style={{ color: '#719DBE' }} /></button>
          <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}><ArrowUpRight size={13} style={{ color: '#719DBE' }} /></button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <DealCard date="Novo" name="Semaglutida" subtitle="Novo Nordisk" amount="Registro" variant="primary" />
        <DealCard date="Biológico" name="Denosumabe" subtitle="Amgen" amount="Registro" variant="secondary" />
        <DealCard date="5 dias" name="CP 1370" subtitle="Pesquisa Clínica" amount="Urgente" variant="dark" />
        <DealCard date="Genérico" name="Dipirona" subtitle="EMS" amount="Registro" variant="light" />
        <DealCard date="Biossimilar" name="Tiraglutida" subtitle="Biocon" amount="Registro" variant="glass" />
        <DealCard date="Fitoterápico" name="Senne" subtitle="Natulab" amount="Registro" variant="glass" />
      </div>
    </div>
  );
}
