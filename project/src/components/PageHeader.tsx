import { ChevronLeft, Clock, Users, Microscope } from 'lucide-react';

const kpiCardBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.34)',
  backdropFilter: 'blur(20px) saturate(130%)',
  WebkitBackdropFilter: 'blur(20px) saturate(130%)',
  border: '1px solid rgba(255,255,255,0.52)',
  boxShadow: '0 12px 30px rgba(35,60,80,0.07), inset 0 1px 0 rgba(255,255,255,0.60)',
  borderRadius: '18px',
  padding: '12px 16px',
};

const kpiCardUrgent: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0.24))',
  backgroundImage: 'radial-gradient(circle at 82% 22%, rgba(229,235,64,0.28), transparent 42%), linear-gradient(135deg, rgba(255,255,255,0.38), rgba(255,255,255,0.24))',
  backdropFilter: 'blur(20px) saturate(130%)',
  WebkitBackdropFilter: 'blur(20px) saturate(130%)',
  border: '1px solid rgba(229,235,64,0.55)',
  boxShadow: '0 0 0 1px rgba(229,235,64,0.08), 0 14px 34px rgba(35,60,80,0.08), 0 0 26px rgba(229,235,64,0.20), inset 0 1px 0 rgba(255,255,255,0.65)',
  borderRadius: '18px',
  padding: '12px 16px',
};

const iconBase: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  background: 'rgba(255,255,255,0.42)',
  border: '1px solid rgba(255,255,255,0.55)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
};

export default function PageHeader() {
  return (
    <div className="flex items-center gap-6 px-4 py-3">
      {/* Title */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.34)', border: '1px solid rgba(255,255,255,0.48)' }}>
          <ChevronLeft size={15} style={{ color: 'rgba(14,24,34,0.70)' }} />
        </button>
        <h1 className="text-2xl font-bold leading-tight" style={{ color: 'rgba(14,24,34,0.94)' }}>
          Painel<br />Regulatório
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="flex items-center gap-3 flex-1">
        {/* Urgente — farol */}
        <div className="flex items-center gap-3" style={kpiCardUrgent}>
          <div style={iconBase}>
            <Clock size={17} strokeWidth={2.2} style={{ color: 'rgba(14,24,34,0.80)' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(12,22,32,0.95)', letterSpacing: '-0.02em' }}>3</span>
              <span className="text-xs" style={{ color: 'rgba(14,24,34,0.70)', fontWeight: 600 }}>prazos</span>
              <span className="urgent-badge">urgentes</span>
              <span className="urgent-pulse" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(48,72,90,0.68)', marginTop: 2 }}>Destaques esta semana</div>
          </div>
        </div>

        {/* Consultas */}
        <div className="flex items-center gap-3" style={kpiCardBase}>
          <div style={iconBase}>
            <Users size={17} strokeWidth={2} style={{ color: 'rgba(113,157,190,0.90)' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(12,22,32,0.95)', letterSpacing: '-0.02em' }}>+5</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(113,157,190,0.85)', color: '#fff' }}>abertas</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(48,72,90,0.68)', marginTop: 2 }}>Consultas Públicas</div>
          </div>
        </div>

        {/* IFAs */}
        <div className="flex items-center gap-3" style={kpiCardBase}>
          <div style={iconBase}>
            <Microscope size={17} strokeWidth={2} style={{ color: 'rgba(113,157,190,0.90)' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 20, fontWeight: 800, color: 'rgba(12,22,32,0.95)', letterSpacing: '-0.02em' }}>+7</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.55)', color: 'rgba(14,24,34,0.80)', border: '1px solid rgba(255,255,255,0.6)' }}>hoje</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(48,72,90,0.68)', marginTop: 2 }}>IFAs Monitorados</div>
          </div>
        </div>
      </div>
    </div>
  );
}
