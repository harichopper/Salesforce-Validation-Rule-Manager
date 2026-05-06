import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiShieldLine, RiSettings4Line,
  RiLogoutBoxLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiFlashlightLine, RiOrganizationChart,
} from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/rules', icon: RiShieldLine, label: 'Validation Rules' },
  { to: '/settings', icon: RiSettings4Line, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { orgInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen flex-shrink-0 relative z-20"
      style={{
        background: 'rgba(6,6,17,0.9)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--border)', minHeight: 64 }}>
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center pulse-glow"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <RiFlashlightLine size={18} color="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="min-w-0"
            >
              <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>SF Rule</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manager</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  color: isActive ? '#818cf8' : 'var(--text-secondary)',
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Org info */}
      <AnimatePresence>
        {!collapsed && orgInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-2 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <RiOrganizationChart size={13} color="#6366f1" />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Connected Org</span>
            </div>
            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {orgInfo.orgName}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {orgInfo.username}
            </p>
            <span className={`badge mt-1 ${orgInfo.isSandbox ? 'badge-blue' : 'badge-active'}`}>
              {orgInfo.isSandbox ? 'Sandbox' : 'Production'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse + logout */}
      <div className="p-3 flex flex-col gap-1" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200"
          style={{ color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <RiLogoutBoxLine size={18} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl w-full transition-all duration-200"
          style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {collapsed ? <RiMenuUnfoldLine size={18} /> : <RiMenuFoldLine size={18} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs">
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
