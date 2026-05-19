import { ChevronLeft, BarChart2, Users, CheckSquare } from 'lucide-react';

export default function PageHeader() {
  return (
    <div className="flex items-center gap-8 px-6 py-4">
      <div className="flex items-center gap-4 flex-shrink-0">
        <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' }}>
          <ChevronLeft size={15} style={{ color: '#719DBE' }} />
        </button>
        <h1 className="text-3xl font-bold leading-tight" style={{ color: '#000000' }}>
          Painel<br />Regulatório
        </h1>
      </div>

      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <BarChart2 size={16} style={{ color: '#719DBE' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold" style={{ color: '#000000' }}>3 prazos</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#C0D4E2', color: '#000000' }}>urgentes</span>
            </div>
            <div className="text-xs" style={{ color: '#719DBE' }}>Destaques Esta Semana</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <Users size={16} style={{ color: '#719DBE' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold" style={{ color: '#000000' }}>+5</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#719DBE', color: '#FFFFFF' }}>abertas</span>
            </div>
            <div className="text-xs" style={{ color: '#719DBE' }}>Consultas Públicas</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)' }}>
            <CheckSquare size={16} style={{ color: '#719DBE' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold" style={{ color: '#000000' }}>+7</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.7)', color: '#000000', border: '1px solid rgba(0,0,0,0.08)' }}>hoje</span>
            </div>
            <div className="text-xs" style={{ color: '#719DBE' }}>IFAs Monitorados</div>
          </div>
        </div>
      </div>
    </div>
  );
}
