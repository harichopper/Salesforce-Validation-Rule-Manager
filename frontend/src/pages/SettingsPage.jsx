import { motion } from 'framer-motion';
import { RiSettings4Line, RiExternalLinkLine, RiShieldLine, RiGlobalLine, RiCodeLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { orgInfo } = useAuth();

  const Section = ({ title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 mb-5"
    >
      <h2 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>{title}</h2>
      {children}
    </motion.div>
  );

  const Row = ({ label, value, mono = false }) => (
    <div className="flex items-start justify-between py-3 gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className={`text-sm text-right break-all ${mono ? 'font-mono' : 'font-medium'}`} style={{ color: 'var(--text-primary)', maxWidth: '60%' }}>
        {value || '—'}
      </span>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <RiSettings4Line size={24} color="#818cf8" />
          <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Settings</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connected org details and application configuration</p>
      </motion.div>

      {orgInfo && (
        <Section title="Connected Org">
          <Row label="Org Name" value={orgInfo.orgName} />
          <Row label="Org ID" value={orgInfo.orgId} mono />
          <Row label="Org Type" value={orgInfo.orgType} />
          <Row label="Instance" value={orgInfo.instanceName} />
          <Row label="Environment" value={orgInfo.isSandbox ? 'Sandbox' : 'Production'} />
          <Row label="Instance URL" value={orgInfo.instanceUrl} mono />
          <div className="pt-3">
            <a
              href={orgInfo.instanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-sm"
            >
              <RiExternalLinkLine size={15} /> Open in Salesforce
            </a>
          </div>
        </Section>
      )}

      {orgInfo && (
        <Section title="Authenticated User">
          <Row label="Username" value={orgInfo.username} mono />
          <Row label="Display Name" value={orgInfo.displayName} />
          <Row label="Email" value={orgInfo.email} />
          <Row label="User ID" value={orgInfo.userId} mono />
        </Section>
      )}

      <Section title="Application Info">
        <Row label="API Version" value="v58.0" mono />
        <Row label="Target Object" value="Account" />
        <Row label="Auth Method" value="OAuth 2.0" />
        <Row label="Integration" value="JSForce + Tooling API + Metadata API" />
        <Row label="Frontend" value="React + Vite + TailwindCSS + Framer Motion" />
        <Row label="Backend" value="Node.js + Express" />
      </Section>

      <Section title="Helpful Links">
        <div className="flex flex-col gap-3 pt-1">
          {[
            { label: 'Salesforce Setup', url: orgInfo ? `${orgInfo.instanceUrl}/lightning/setup/SetupOneHome/home` : 'https://login.salesforce.com', icon: RiGlobalLine },
            { label: 'Validation Rules Docs', url: 'https://help.salesforce.com/s/articleView?id=sf.fields_about_field_validation.htm', icon: RiShieldLine },
            { label: 'Metadata API Docs', url: 'https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/', icon: RiCodeLine },
          ].map(({ label, url, icon: Icon }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2 text-sm"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Icon size={16} />
              {label}
              <RiExternalLinkLine size={13} className="ml-auto" />
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
