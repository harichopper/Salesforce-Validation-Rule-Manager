import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ParticleBackground from '../ui/ParticleBackground';

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <ParticleBackground />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
