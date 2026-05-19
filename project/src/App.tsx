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
      style={{ background: 'linear-gradient(135deg, #E8F1F6 0%, #F0F5F8 50%, #EDF3F7 100%)' }}
    >
      {/* Main panel — full screen */}
      <div className="relative w-full min-h-screen">
        {/* Background blobs — paleta RIGI */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(113,157,190,0.20), transparent 65%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '25%', right: '-3%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(192,212,226,0.30), transparent 65%)', filter: 'blur(55px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', left: '30%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(113,157,190,0.15), transparent 65%)', filter: 'blur(55px)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '10%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(192,212,226,0.25), transparent 60%)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: '30%', right: '25%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(113,157,190,0.12), transparent 60%)', filter: 'blur(48px)' }} />
          {/* Bottom area blobs */}
          <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(113,157,190,0.22), transparent 60%)', filter: 'blur(65px)' }} />
          <div style={{ position: 'absolute', bottom: '3%', right: '20%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(192,212,226,0.28), transparent 60%)', filter: 'blur(55px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '45%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(113,157,190,0.16), transparent 60%)', filter: 'blur(50px)' }} />
        </div>

        {/* Content */}
        <div className="relative" style={{ zIndex: 10 }}>
          <TopBar />

          <div className="flex gap-4 px-4 pb-5">
            <Sidebar />

            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <PageHeader />

              <div className="flex gap-4">
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <InteractionHistory />
                  <div className="flex gap-4">
                    <TasksSchedule />
                    <StageFunnel />
                  </div>
                </div>
                <div className="flex flex-col gap-4" style={{ width: '260px', flexShrink: 0 }}>
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
