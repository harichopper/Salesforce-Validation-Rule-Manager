import { createContext, useContext, useState } from 'react';

const RulesContext = createContext(null);

export function RulesProvider({ children }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deployingIds, setDeployingIds] = useState(new Set());
  const [lastUpdated, setLastUpdated] = useState(null);

  // Optimistically toggle a rule in local state
  const optimisticToggle = (ruleName, active) => {
    setRules((prev) =>
      prev.map((r) => (r.name === ruleName ? { ...r, active } : r))
    );
  };

  // Optimistically toggle all rules
  const optimisticToggleAll = (active) => {
    setRules((prev) => prev.map((r) => ({ ...r, active })));
  };

  const setDeploying = (id, state) => {
    setDeployingIds((prev) => {
      const next = new Set(prev);
      state ? next.add(id) : next.delete(id);
      return next;
    });
  };

  return (
    <RulesContext.Provider value={{
      rules, setRules,
      loading, setLoading,
      error, setError,
      deployingIds,
      setDeploying,
      lastUpdated, setLastUpdated,
      optimisticToggle,
      optimisticToggleAll,
    }}>
      {children}
    </RulesContext.Provider>
  );
}

export const useRules = () => useContext(RulesContext);
