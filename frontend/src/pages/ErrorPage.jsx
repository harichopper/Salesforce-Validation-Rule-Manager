import { motion } from 'framer-motion';
import { useNavigate, useRouteError } from 'react-router-dom';
import { RiErrorWarningLine, RiArrowLeftLine, RiHomeLine } from 'react-icons/ri';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'var(--bg-primary)' }}>
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong relative z-10 p-10 max-w-md w-full mx-4 text-center"
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg,#ef4444,#f97316)', borderRadius: '4px 4px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <RiErrorWarningLine size={30} color="#f87171" />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Something went wrong</h1>
        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
          {error?.statusText || error?.message || 'An unexpected error occurred.'}
        </p>
        {error?.status && (
          <p className="text-xs mb-6 font-mono" style={{ color: 'var(--text-muted)' }}>Error {error.status}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn btn-ghost">
            <RiArrowLeftLine size={15} /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            <RiHomeLine size={15} /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
