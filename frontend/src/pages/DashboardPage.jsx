import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiShieldLine, RiCheckboxCircleLine, RiCloseCircleLine,
  RiRocketLine, RiRefreshLine, RiOrganizationChart,
  RiUserLine, RiGlobalLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useRules } from '../context/RulesContext';
import { useRulesActions } from '../hooks/useRulesActions';
import StatCard from '../components/ui/StatCard';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { orgInfo } = useAuth();
  const { rules, loading } = useRules();
  const { loadRules } = useRulesActions();
  const navigate = useNavigate();

  useEffect(() => { loadRules(); }, []);

  const active = rules.filter((r) => r.active).length;
  const inactive = rules.filter((r) => !r.active).length;
  const total = rules.length;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-3xl font-black mb-1"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Overview of your Salesforce org and validation rule health
        </p>
      </motion.div>

      {/* Org Info Card */}
      {orgInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-5 mb-6 flex flex-wrap items-center gap-6"
          style={{ borderLeft: '3px solid #6366f1' }}
        >
          {[
            { icon: RiOrganizationChart, color: '#818cf8', bg: 'rgba(99,102,241,0.15)', label: 'Org Name', value: orgInfo.orgName },
            { icon: RiUserLine, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', label: 'Username', value: orgInfo.username },
            { icon: RiGlobalLine, color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Instance', value: orgInfo.instanceName },
          ].map(({ icon: Icon, color, bg, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <RiGlobalLine size={20} color="#10b981" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Environment</p>
              <span className={`badge ${orgInfo.isSandbox ? 'badge-blue' : 'badge-active'}`}>
                <span className={`dot ${orgInfo.isSandbox ? 'dot-blue' : 'dot-green'}`} />
                {orgInfo.isSandbox ? 'Sandbox' : 'Production'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Rules"  value={total}   icon={RiShieldLine}         color="#6366f1" delay={0.10} />
            <StatCard label="Active"       value={active}  icon={RiCheckboxCircleLine} color="#10b981" delay={0.15} />
            <StatCard label="Inactive"     value={inactive} icon={RiCloseCircleLine}   color="#6b7280" delay={0.20} />
            <StatCard
              label="Health"
              value={total > 0 ? `${Math.round((active / total) * 100)}%` : '—'}
              icon={RiRocketLine}
              color="#f59e0b"
              delay={0.25}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass p-6 mb-6"
      >
        <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/rules')}
            className="btn btn-primary"
          >
            <RiShieldLine size={16} /> Manage Rules
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={loadRules}
            className="btn btn-ghost"
            disabled={loading}
          >
            <RiRefreshLine size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Rules Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Recent Validation Rules
          </h2>
          <button onClick={() => navigate('/rules')} className="btn btn-ghost text-xs py-1.5 px-3">
            View All
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: 48 }} />
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-10">
            <RiShieldLine size={32} color="#6b7280" className="mx-auto mb-3" />
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">
              No validation rules found for the Account object.
            </p>
            <button onClick={() => navigate('/rules')} className="btn btn-ghost text-sm mt-4">
              Go to Rules Page
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {rules.slice(0, 5).map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="flex items-center justify-between py-3"
                style={{
                  borderBottom:
                    i < Math.min(rules.length, 5) - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <RiShieldLine
                    size={15}
                    color={rule.active ? '#818cf8' : '#6b7280'}
                    style={{ flexShrink: 0 }}
                  />
                  <span
                    className="text-sm truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {rule.name}
                  </span>
                </div>
                <span className={`badge ml-3 flex-shrink-0 ${rule.active ? 'badge-active' : 'badge-inactive'}`}>
                  <span className={`dot ${rule.active ? 'dot-green' : 'dot-gray'}`} />
                  {rule.active ? 'Active' : 'Inactive'}
                </span>
              </motion.div>
            ))}
            {rules.length > 5 && (
              <p className="text-xs text-center pt-4" style={{ color: 'var(--text-muted)' }}>
                +{rules.length - 5} more rules —{' '}
                <button
                  onClick={() => navigate('/rules')}
                  style={{ color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  View all
                </button>
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
