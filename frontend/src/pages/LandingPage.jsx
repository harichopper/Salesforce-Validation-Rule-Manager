import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RiFlashlightLine, RiShieldLine, RiRocketLine, RiArrowRightLine, RiCheckLine, RiCodeLine, RiCloudLine } from 'react-icons/ri';
import ParticleBackground from '../components/ui/ParticleBackground';
import { loginWithSalesforce } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const FEATURES = [
  { icon: RiShieldLine, title: 'Rule Management', desc: 'View, toggle, and manage all validation rules from one beautiful dashboard.' },
  { icon: RiRocketLine, title: 'Instant Deployment', desc: 'Deploy changes directly to Salesforce via Metadata API with one click.' },
  { icon: RiCloudLine, title: 'Real-time Sync', desc: 'Live status updates and optimistic UI ensure a smooth experience.' },
  { icon: RiCodeLine, title: 'Tooling API', desc: 'Powered by JSForce Tooling API for precise, reliable rule introspection.' },
];

const STATS = [
  { value: '100%', label: 'OAuth 2.0 Secure' },
  { value: '< 1s', label: 'Deploy Time' },
  { value: 'v58.0', label: 'API Version' },
  { value: '∞', label: 'Rules Supported' },
];

export default function LandingPage() {
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) navigate('/dashboard');
  }, [authenticated, navigate]);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <ParticleBackground />

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-glow" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <RiFlashlightLine size={18} color="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>SF Rule Manager</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={loginWithSalesforce}
          className="btn btn-primary text-sm"
        >
          Connect Salesforce <RiArrowRightLine size={15} />
        </motion.button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="badge badge-blue mb-6"
        >
          <RiFlashlightLine size={12} /> Salesforce Validation Rule Manager
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-7xl font-black leading-tight mb-6"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          Manage Salesforce
          <br />
          <span className="gradient-text">Validation Rules</span>
          <br />
          Like a Pro
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg max-w-xl mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          The ultra-modern dashboard to toggle, deploy, and manage all your Salesforce
          validation rules — with real-time Metadata API integration.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 40px rgba(99,102,241,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={loginWithSalesforce}
            className="btn btn-primary px-8 py-3 text-base"
          >
            <RiFlashlightLine size={18} /> Connect with Salesforce
          </motion.button>
          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <RiCheckLine size={14} color="#10b981" /> OAuth 2.0 secure — no password stored
          </span>
        </motion.div>

        {/* Floating glass preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="glass-strong mt-16 p-6 w-full max-w-2xl text-left float"
          style={{ boxShadow: '0 30px 80px rgba(99,102,241,0.15)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Account Validation Rules</span>
          </div>
          {[
            { name: 'RequirePhone_Account', active: true },
            { name: 'BlockDuplicateNames', active: false },
            { name: 'ValidateAnnualRevenue', active: true },
          ].map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <RiShieldLine size={16} color={r.active ? '#818cf8' : '#6b7280'} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
              </div>
              <span className={`badge ${r.active ? 'badge-active' : 'badge-inactive'}`}>
                <span className={`dot ${r.active ? 'dot-green' : 'dot-gray'}`} />
                {r.active ? 'Active' : 'Inactive'}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass p-5 text-center"
            >
              <p className="text-3xl font-black gradient-text mb-1">{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-28">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
          style={{ color: 'var(--text-primary)' }}
        >
          Everything you need to <span className="gradient-text">ship faster</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass p-6 flex gap-4"
            >
              <div className="p-3 rounded-xl flex-shrink-0" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', height: 'fit-content' }}>
                <Icon size={20} color="#818cf8" />
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t text-center py-8 px-6" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <p className="text-sm">Built with ❤️ using React, Node.js &amp; JSForce</p>
        <p className="text-xs mt-1">© {new Date().getFullYear()} SF Rule Manager</p>
      </footer>
    </div>
  );
}
