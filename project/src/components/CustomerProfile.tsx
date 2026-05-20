import { MoreHorizontal, ArrowUpRight, Pencil, Mail, Phone, Plus, Calendar, FileText } from 'lucide-react';

const actionIcons = [
  { Icon: Pencil, label: 'Edit' },
  { Icon: Mail, label: 'Email' },
  { Icon: Phone, label: 'Call' },
  { Icon: Plus, label: 'Add' },
  { Icon: Calendar, label: 'Schedule' },
  { Icon: FileText, label: 'File' },
];

export default function CustomerProfile() {
  return (
    <div className="relative rounded-[22px] p-4 overflow-hidden glass-panel" style={{ background: 'rgba(255,255,255,0.30)', backdropFilter: 'blur(32px) saturate(140%)', border: '1px solid rgba(255,255,255,0.58)', boxShadow: '0 24px 70px rgba(38,66,88,0.09), inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -1px 0 rgba(255,255,255,0.20)' }}>
      {/* Decorative glows */}
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(113,157,190,0.35), transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-20px', right: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(192,212,226,0.40), transparent 65%)', filter: 'blur(50px)', zIndex: 0 }} />
      <div className="absolute pointer-events-none" style={{ top: '50%', left: '-30px', width: '140px', height: '140px', background: 'radial-gradient(circle, rgba(113,157,190,0.20), transparent 65%)', filter: 'blur(35px)', zIndex: 0 }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)' }}><ArrowUpRight size={13} style={{ color: '#719DBE', transform: 'rotate(180deg) scaleX(-1)' }} /></button>
            <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)' }}><ArrowUpRight size={13} style={{ color: '#719DBE' }} /></button>
          </div>
          <div className="flex gap-1.5">
            <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)' }}><MoreHorizontal size={13} style={{ color: '#719DBE' }} /></button>
            <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)' }}><ArrowUpRight size={13} style={{ color: '#719DBE' }} /></button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(113,157,190,0.45) 0%, transparent 70%)', filter: 'blur(16px)', transform: 'scale(1.3)' }} />
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #719DBE, #C0D4E2)', border: '3px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 32px rgba(113,157,190,0.25)' }}>
              <span className="text-white text-2xl font-bold">R</span>
            </div>
          </div>
          <h3 className="text-base font-bold mb-0.5" style={{ color: '#000000' }}>RIGI AI</h3>
          <p className="text-xs text-center" style={{ color: '#719DBE', maxWidth: '140px' }}>Inteligência Regulatória ANVISA</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          {actionIcons.map(({ Icon, label }) => (
            <button key={label} title={label} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.55)'; }}
            >
              <Icon size={13} style={{ color: '#719DBE' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
