import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { RiFlashlightLine, RiShieldCheckLine, RiArrowRightLine } from 'react-icons/ri';
import ParticleBackground from '../components/ui/ParticleBackground';
import { loginWithSalesforce } from '../api/auth';

export default function LoginPage() {
  const location = useLocation();
  const error = new URLSearchParams(location.search).get('error');

  const errorMessages = {
    no_code: 'Authorization code not received from Salesforce. Please try again.',
    auth_failed: 'Authentication failed. Please check your Connected App credentials.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'var(--bg-primary)' }}>
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong relative z-10 p-10 w-full max-w-md mx-4"
        style={{ boxShadow: '0 30px 80px rgba(99,102,241,0.15)' }}
      >
        {/* Top gradient bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)', borderRadius: '4px 4px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }} />

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 pulse-glow" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <RiFlashlightLine size={26} color="white" />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Connect Your Org
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            Authenticate with Salesforce to start managing validation rules
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
          >
            {errorMessages[error] || 'An error occurred. Please try again.'}
          </motion.div>
        )}

        {/* Feature list */}
        <div className="mb-8 flex flex-col gap-3">
          {[
            'Secure OAuth 2.0 — no passwords stored',
            'Read & write validation rules via Metadata API',
            'Deploy changes directly to your org',
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <RiShieldCheckLine size={15} color="#10b981" className="flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 40px rgba(99,102,241,0.5)' }}
          whileTap={{ scale: 0.97 }}
          onClick={loginWithSalesforce}
          className="btn btn-primary w-full py-3 text-base justify-center"
        >
          <RiFlashlightLine size={18} /> Login with Salesforce <RiArrowRightLine size={16} />
        </motion.button>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
          You'll be redirected to Salesforce to authorize access.
        </p>
      </motion.div>
    </div>
  );
}
