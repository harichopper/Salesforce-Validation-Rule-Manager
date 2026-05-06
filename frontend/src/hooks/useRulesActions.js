import { useCallback } from 'react';
import { useRules } from '../context/RulesContext';
import { fetchValidationRules, toggleRule as apiToggle, toggleAllRules as apiToggleAll, deployRule as apiDeploy } from '../api/rules';
import toast from 'react-hot-toast';

export function useRulesActions(objectName = 'Account') {
  const {
    setRules, setLoading, setError, setLastUpdated,
    setDeploying, optimisticToggle, optimisticToggleAll,
  } = useRules();

  const loadRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchValidationRules(objectName);
      setRules(res.data?.data?.rules || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch rules: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [objectName, setRules, setLoading, setError, setLastUpdated]);

  const toggleRule = useCallback(async (ruleName, active) => {
    // Optimistic update first
    optimisticToggle(ruleName, active);
    setDeploying(ruleName, true);
    try {
      await apiToggle(ruleName, active, objectName);
      toast.success(`Rule "${ruleName}" ${active ? 'enabled' : 'disabled'}`);
    } catch (err) {
      // Revert on failure
      optimisticToggle(ruleName, !active);
      toast.error(`Failed: ${err.message}`);
    } finally {
      setDeploying(ruleName, false);
    }
  }, [objectName, optimisticToggle, setDeploying]);

  const toggleAllRules = useCallback(async (active) => {
    optimisticToggleAll(active);
    setDeploying('__all__', true);
    const toastId = toast.loading(`${active ? 'Enabling' : 'Disabling'} all rules...`);
    try {
      const res = await apiToggleAll(active, objectName);
      const data = res.data?.data;
      toast.success(
        `${data?.updated} rule(s) ${active ? 'enabled' : 'disabled'}${data?.failed > 0 ? `, ${data.failed} failed` : ''}`,
        { id: toastId }
      );
      // Reload to get real state
      await loadRules();
    } catch (err) {
      optimisticToggleAll(!active);
      toast.error(`Failed: ${err.message}`, { id: toastId });
    } finally {
      setDeploying('__all__', false);
    }
  }, [objectName, optimisticToggleAll, setDeploying, loadRules]);

  const deployRule = useCallback(async (ruleName, active) => {
    setDeploying(ruleName, true);
    const toastId = toast.loading(`Deploying "${ruleName}"...`);
    try {
      await apiDeploy(ruleName, active, objectName);
      toast.success(`"${ruleName}" deployed to Salesforce!`, { id: toastId });
    } catch (err) {
      toast.error(`Deploy failed: ${err.message}`, { id: toastId });
    } finally {
      setDeploying(ruleName, false);
    }
  }, [objectName, setDeploying]);

  return { loadRules, toggleRule, toggleAllRules, deployRule };
}
