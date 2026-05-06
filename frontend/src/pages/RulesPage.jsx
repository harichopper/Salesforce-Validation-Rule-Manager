import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiShieldLine, RiRefreshLine, RiCheckboxCircleLine,
  RiCloseCircleLine, RiSearchLine, RiFilterLine,
  RiToggleLine, RiRocketLine,
} from 'react-icons/ri';
import { useRules } from '../context/RulesContext';
import { useRulesActions } from '../hooks/useRulesActions';
import RuleCard from '../components/ui/RuleCard';
import RuleModal from '../components/ui/RuleModal';
import { RuleCardSkeleton } from '../components/ui/Skeleton';

const FILTERS = ['All', 'Active', 'Inactive'];

export default function RulesPage() {
  const { rules, loading, error, deployingIds, lastUpdated } = useRules();
  const { loadRules, toggleRule, toggleAllRules, deployRule } = useRulesActions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedRule, setSelectedRule] = useState(null);
  const [togglingAll, setTogglingAll] = useState(false);

  useEffect(() => { loadRules(); }, []);

  const filtered = rules.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.errorMessage.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || (filter === 'Active' ? r.active : !r.active);
    return matchSearch && matchFilter;
  });

  const handleToggleAll = async (active) => {
    setTogglingAll(true);
    await toggleAllRules(active);
    setTogglingAll(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Validation Rules
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Account object · {rules.length} rules
              {lastUpdated && (
                <span> · Updated {lastUpdated.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadRules} className="btn btn-ghost text-sm" disabled={loading}>
              <RiRefreshLine size={15} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={() => handleToggleAll(true)}
              className="btn btn-success text-sm"
              disabled={togglingAll || loading}
            >
              <RiCheckboxCircleLine size={15} /> Enable All
            </button>
            <button
              onClick={() => handleToggleAll(false)}
              className="btn btn-danger text-sm"
              disabled={togglingAll || loading}
            >
              <RiCloseCircleLine size={15} /> Disable All
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-4 flex flex-wrap gap-3 items-center mb-6"
      >
        <div className="relative flex-1 min-w-48">
          <RiSearchLine size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input pl-9"
            placeholder="Search rules by name or error message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <RiFilterLine size={14} style={{ color: 'var(--text-muted)' }} />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn text-xs py-1.5 px-3"
              style={{
                background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? '#818cf8' : 'var(--text-secondary)',
                border: filter === f ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} / {rules.length} rules
        </span>
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass p-5 mb-6 flex items-center gap-3"
          style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}
        >
          <RiCloseCircleLine size={20} color="#f87171" />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#f87171' }}>Failed to fetch rules</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{error}</p>
          </div>
          <button onClick={loadRules} className="btn btn-ghost text-xs ml-auto">Retry</button>
        </motion.div>
      )}

      {/* Rules grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <RuleCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass p-16 flex flex-col items-center text-center"
        >
          <RiShieldLine size={40} color="#6b7280" className="mb-4" />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No rules found</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {search ? `No rules match "${search}"` : 'No validation rules found for the Account object.'}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((rule, i) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                index={i}
                deploying={deployingIds.has(rule.name)}
                onToggle={toggleRule}
                onDeploy={deployRule}
                onDetail={setSelectedRule}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Rule detail modal */}
      <AnimatePresence>
        {selectedRule && (
          <RuleModal rule={selectedRule} onClose={() => setSelectedRule(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
