import { motion } from 'framer-motion';
import { RiShieldLine, RiRocketLine, RiInformationLine } from 'react-icons/ri';
import Toggle from './Toggle';

/**
 * Validation Rule Card — single rule with toggle and deploy controls
 */
export default function RuleCard({ rule, index, onToggle, onDeploy, onDetail, deploying }) {
  return (
    <motion.div
      className="glass p-5 flex flex-col gap-4 cursor-default group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ borderColor: 'rgba(99,102,241,0.35)', scale: 1.005 }}
      style={{
        borderColor: rule.active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
        transition: 'border-color 0.3s, transform 0.2s',
      }}
    >
      {/* Active glow stripe */}
      {rule.active && (
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: 3,
            background: 'linear-gradient(180deg,#6366f1,#8b5cf6)',
            borderRadius: '16px 0 0 16px',
          }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="p-2 rounded-xl flex-shrink-0"
            style={{ background: rule.active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)' }}
          >
            <RiShieldLine size={18} color={rule.active ? '#818cf8' : '#6b7280'} />
          </div>
          <div className="min-w-0">
            <h3
              className="font-semibold text-sm truncate"
              style={{ color: 'var(--text-primary)' }}
              title={rule.name}
            >
              {rule.name}
            </h3>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {rule.entityName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`badge ${rule.active ? 'badge-active' : 'badge-inactive'}`}>
            <span className={`dot ${rule.active ? 'dot-green' : 'dot-gray'}`} />
            {rule.active ? 'Active' : 'Inactive'}
          </span>
          <Toggle
            checked={rule.active}
            onChange={(val) => onToggle(rule.name, val)}
            disabled={deploying}
          />
        </div>
      </div>

      {/* Error message */}
      {rule.errorMessage && (
        <p
          className="text-xs pl-1 leading-relaxed line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {rule.errorMessage}
        </p>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-1 pl-1" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          className="btn btn-ghost text-xs px-3 py-1.5"
          onClick={() => onDetail(rule)}
        >
          <RiInformationLine size={14} /> Details
        </button>
        <button
          className="btn btn-primary text-xs px-3 py-1.5"
          onClick={() => onDeploy(rule.name, rule.active)}
          disabled={deploying}
          style={{ marginLeft: 'auto' }}
        >
          {deploying
            ? <><span className="animate-spin inline-block border-2 border-white border-t-transparent rounded-full w-3 h-3" /> Deploying...</>
            : <><RiRocketLine size={14} /> Deploy</>
          }
        </button>
      </div>
    </motion.div>
  );
}
