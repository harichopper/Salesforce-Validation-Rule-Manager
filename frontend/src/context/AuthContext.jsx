import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuthStatus, logout as apiLogout } from '../api/auth';
import { fetchOrgInfo } from '../api/rules';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await getAuthStatus();
      const isAuth = res.data?.data?.authenticated;
      setAuthenticated(isAuth);

      if (isAuth) {
        const orgRes = await fetchOrgInfo();
        setOrgInfo(orgRes.data?.data || null);
      }
    } catch {
      setAuthenticated(false);
      setOrgInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const logout = async () => {
    try { await apiLogout(); } catch {}
    setAuthenticated(false);
    setOrgInfo(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, orgInfo, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
