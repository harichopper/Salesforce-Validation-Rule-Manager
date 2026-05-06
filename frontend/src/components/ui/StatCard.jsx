import { motion } from 'framer-motion';

/**
 * Animated stat card for dashboard overview
 */
export default function StatCard({ label, value, icon: Icon, color = '#6366f1', delay = 0 }) {
  return (
    <motion.div
      className="glass p-5 flex items-center gap-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: `${color}20`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="p-3 rounded-xl flex-shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon size={22} color={color} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}
