import { motion, AnimatePresence } from 'framer-motion';

/**
 * Animated toggle switch with glow effect
 */
export default function Toggle({ checked, onChange, disabled = false, size = 'md' }) {
  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-4' },
    md: { track: 'w-12 h-6', thumb: 'w-4.5 h-4.5', translate: 'translate-x-6' },
    lg: { track: 'w-14 h-7', thumb: 'w-5 h-5', translate: 'translate-x-7' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent ${s.track} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        background: checked
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
          : 'rgba(255,255,255,0.1)',
        boxShadow: checked ? '0 0 16px rgba(99,102,241,0.5)' : 'none',
      }}
    >
      <motion.span
        layout
        className="absolute rounded-full bg-white shadow-lg"
        style={{ width: 18, height: 18, left: 3 }}
        animate={{ x: checked ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
