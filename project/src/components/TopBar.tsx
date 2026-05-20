import { Bell, Mail } from 'lucide-react';

const navItems = ['Dashboard', 'Processos', 'IFA Monitor', 'Tempos ANVISA', 'Medicamentos', 'Filas'];

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(113,157,190,0.2)', border: '1px solid rgba(113,157,190,0.3)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#719DBE"/>
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: '#000000' }}>RigiBlick</span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={
              item === 'Dashboard'
                ? { background: '#719DBE', color: '#FFFFFF' }
                : { color: '#000000', background: 'transparent' }
            }
            onMouseEnter={e => {
              if (item !== 'Dashboard') (e.currentTarget as HTMLElement).style.background = 'rgba(192,212,226,0.5)';
            }}
            onMouseLeave={e => {
              if (item !== 'Dashboard') (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' }}>
          <Mail size={14} style={{ color: '#719DBE' }} />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' }}>
          <Bell size={14} style={{ color: '#719DBE' }} />
        </button>
        <img
          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
          style={{ border: '2px solid rgba(255,255,255,0.7)' }}
        />
      </div>
    </div>
  );
}
