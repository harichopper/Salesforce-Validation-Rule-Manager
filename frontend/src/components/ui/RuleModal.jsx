import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { RiCloseLine, RiShieldLine, RiErrorWarningLine, RiInformationLine } from 'react-icons/ri';

/**
 * Rule Detail Modal — shows full metadata of a validation rule
 */
export default function RuleModal({ rule, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!rule) return null;

  const Field = ({ label, value, mono = false }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span
        className={`text-sm break-words ${mono ? 'font-mono' : ''}`}
        style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}
      >
        {value || <em style={{ color: 'var(--text-muted)' }}>—</em>}
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          className="glass-strong w-full max-w-lg relative overflow-hidden"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient top border */}
          <div style={{ height: 3, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)' }} />

          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.15)' }}>
                  <RiShieldLine size={22} color="#818cf8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {rule.name}
                  </h2>
                  <span className={`badge ${rule.active ? 'badge-active' : 'badge-inactive'}`}>
                    <span className={`dot ${rule.active ? 'dot-green' : 'dot-gray'}`} />
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn btn-ghost p-2"
                style={{ minWidth: 'auto', borderRadius: 8 }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-4" style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <Field label="Object" value={rule.entityName} mono />
              <Field label="Full API Name" value={rule.fullName} mono />
              <Field label="Error Message" value={rule.errorMessage} />
              <Field label="Error Display Field" value={rule.errorDisplayField} mono />
              {rule.description && <Field label="Description" value={rule.description} />}
              {rule.namespacePrefix && <Field label="Namespace Prefix" value={rule.namespacePrefix} mono />}
              <Field label="Manageable State" value={rule.manageableState} />
              <Field label="Salesforce ID" value={rule.id} mono />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
