import { User, Mail, Phone, Link2, Calendar, Pencil, Plus, ArrowUpRight } from 'lucide-react';

interface InfoRowProps { icon: React.ReactNode; label: string; value: React.ReactNode; action?: React.ReactNode; }

function InfoRow({ icon, label, value, action }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-medium mb-0.5" style={{ color: '#719DBE' }}>{label}</div>
        <div className="text-xs font-semibold truncate" style={{ color: '#000000' }}>{value}</div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

function SmallBtn({ children }: { children: React.ReactNode }) {
  return <button className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.7)' }}>{children}</button>;
}

export default function DetailedInfo() {
  return (
    <div className="relative rounded-[28px] p-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 60px rgba(31,41,55,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: '#000000' }}>Consultas Públicas</h2>
        <div className="flex gap-1.5">
          <SmallBtn><Pencil size={11} style={{ color: '#719DBE' }} /></SmallBtn>
          <SmallBtn><ArrowUpRight size={11} style={{ color: '#719DBE' }} /></SmallBtn>
        </div>
      </div>
      <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
        <InfoRow icon={<User size={12} style={{ color: '#719DBE' }} />} label="CP 105/25" value="ICH M4Q(R2) – CTD" action={<SmallBtn><ArrowUpRight size={11} style={{ color: '#719DBE' }} /></SmallBtn>} />
        <InfoRow icon={<Mail size={12} style={{ color: '#719DBE' }} />} label="CP 13/25" value="ICH Q3E – Extraíveis/Lixiviáveis" action={<SmallBtn><Plus size={11} style={{ color: '#719DBE' }} /></SmallBtn>} />
        <InfoRow icon={<Phone size={12} style={{ color: '#719DBE' }} />} label="CP 16/25" value="Revisão de Bula Padrão" action={<SmallBtn><Plus size={11} style={{ color: '#719DBE' }} /></SmallBtn>} />
        <InfoRow icon={<Link2 size={12} style={{ color: '#719DBE' }} />} label="CP 80/25" value="Guia PBBM Farmacocinética" action={<SmallBtn><Link2 size={11} style={{ color: '#719DBE' }} /></SmallBtn>} />
        <InfoRow icon={<Calendar size={12} style={{ color: '#719DBE' }} />} label="CP 81/25" value="Guia Produto-Específico Etanol" action={<SmallBtn><ArrowUpRight size={11} style={{ color: '#719DBE' }} /></SmallBtn>} />
      </div>
    </div>
  );
}
