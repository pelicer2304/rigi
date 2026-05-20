import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PageHeader from './components/PageHeader';
import InteractionHistory from './components/InteractionHistory';
import TasksSchedule from './components/TasksSchedule';
import StageFunnel from './components/StageFunnel';
import CustomerProfile from './components/CustomerProfile';
import DetailedInfo from './components/DetailedInfo';
import BottomCards from './components/BottomCards';

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: '#e8f0f2',
        backgroundImage: `
          radial-gradient(circle at 10% 12%, rgba(174,207,235,0.45), transparent 34%),
          radial-gradient(circle at 88% 10%, rgba(232,237,190,0.42), transparent 36%),
          radial-gradient(circle at 50% 70%, rgba(255,255,255,0.35), transparent 42%),
          linear-gradient(120deg, #dfeaf4 0%, #edf4f1 46%, #f1f3df 100%)
        `,
      }}
    >
      {/* Canvas — full width */}
      <div className="relative w-full min-h-screen" style={{ padding: '20px 24px 32px' }}>
        {/* Background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '8%', left: '-3%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(113,157,190,0.18), transparent 60%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '-2%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(192,212,226,0.25), transparent 60%)', filter: 'blur(55px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '25%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(113,157,190,0.12), transparent 60%)', filter: 'blur(55px)' }} />
          <div style={{ position: 'absolute', top: '45%', right: '12%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(229,236,190,0.18), transparent 55%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(113,157,190,0.14), transparent 55%)', filter: 'blur(60px)' }} />
        </div>

        {/* Content */}
        <div className="relative" style={{ zIndex: 10 }}>
          <TopBar />

          <div className="flex gap-3 mt-1">
            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <PageHeader />

              <div className="flex gap-3">
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <InteractionHistory />
                  <div className="flex gap-3">
                    <TasksSchedule />
                    <StageFunnel />
                  </div>
                </div>
                <div className="flex flex-col gap-3" style={{ width: '240px', flexShrink: 0 }}>
                  <CustomerProfile />
                  <DetailedInfo />
                </div>
              </div>

              <BottomCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
