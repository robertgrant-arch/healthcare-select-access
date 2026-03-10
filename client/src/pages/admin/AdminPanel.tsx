// Healthcare Select Access — Admin Panel
// Design: Secure Clarity | User management + audit logs + system status

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Users, Activity, Shield, Search, Filter, RefreshCw,
  CheckCircle, AlertCircle, Clock, Lock, Eye, Ban,
  UserCheck, Database, Key, Server, ChevronDown, ChevronUp
} from 'lucide-react';
import { MOCK_ADMIN_USERS, MOCK_AUDIT_LOGS } from '@/lib/mock-data';
import type { User, AuditLogEntry } from '@/lib/types';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: '#DCFCE7', text: '#166534', label: 'Active' },
  PENDING_EMAIL_VERIFICATION: { bg: '#FEF9C3', text: '#854D0E', label: 'Pending Email' },
  PENDING_IDENTITY_VERIFICATION: { bg: '#FEF9C3', text: '#854D0E', label: 'Pending ID' },
  PENDING_MFA_ENROLLMENT: { bg: '#FEF9C3', text: '#854D0E', label: 'Pending MFA' },
  SUSPENDED: { bg: '#FEE2E2', text: '#991B1B', label: 'Suspended' },
  LOCKED: { bg: '#FEE2E2', text: '#991B1B', label: 'Locked' },
};

const SEVERITY_COLORS: Record<string, string> = {
  INFO: '#0E7490',
  WARNING: '#D97706',
  ERROR: '#DC2626',
  CRITICAL: '#7C3AED',
};

function UserRow({ user, onAction }: { user: User; onAction: (action: string, userId: string) => void }) {
  const statusInfo = STATUS_COLORS[user.status] || { bg: '#F3F4F6', text: '#374151', label: user.status };

  return (
    <tr>
      <td>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusInfo.bg, color: statusInfo.text }}>
          {statusInfo.label}
        </span>
      </td>
      <td>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ background: '#F3F4F6', color: '#374151' }}>
          {user.role}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-1.5 text-xs">
          {user.mfaEnabled
            ? <><CheckCircle className="w-3 h-3 text-green-500" /><span className="text-gray-600">MFA On</span></>
            : <><AlertCircle className="w-3 h-3 text-amber-500" /><span className="text-gray-400">No MFA</span></>
          }
        </div>
      </td>
      <td>
        <div className="text-xs text-gray-500 font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAction('view', user.id)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            title="View user"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {user.status === 'ACTIVE' ? (
            <button
              onClick={() => onAction('suspend', user.id)}
              className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
              title="Suspend user"
            >
              <Ban className="w-3.5 h-3.5" />
            </button>
          ) : user.status === 'SUSPENDED' ? (
            <button
              onClick={() => onAction('activate', user.id)}
              className="p-1 rounded hover:bg-green-50 text-gray-400 hover:text-green-500"
              title="Activate user"
            >
              <UserCheck className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function AuditRow({ entry }: { entry: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false);
  const color = SEVERITY_COLORS[entry.severity];

  return (
    <>
      <tr className="cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(!expanded)}>
        <td>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs font-medium" style={{ color }}>{entry.severity}</span>
          </div>
        </td>
        <td>
          <span className="text-xs font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#374151' }}>
            {entry.eventType}
          </span>
        </td>
        <td>
          <div className="text-xs text-gray-600">{entry.userEmail || '—'}</div>
        </td>
        <td>
          <div className="text-xs text-gray-400 font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {entry.ipAddress}
          </div>
        </td>
        <td>
          <div className="text-xs text-gray-400">
            {new Date(entry.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </td>
        <td>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-4 pb-3">
            <div className="rounded-lg p-3 text-xs" style={{ background: '#F8FAFC' }}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><span className="text-gray-400">Chain Hash: </span><span className="font-mono text-gray-600" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{entry.chainHash.slice(0, 16)}...</span></div>
                <div><span className="text-gray-400">Prev Hash: </span><span className="font-mono text-gray-600" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{entry.prevHash.slice(0, 16)}...</span></div>
              </div>
              <div><span className="text-gray-400">Details: </span><span className="font-mono text-gray-600" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{JSON.stringify(entry.details)}</span></div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'system'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState('All');

  const handleUserAction = (action: string, userId: string) => {
    const user = MOCK_ADMIN_USERS.find(u => u.id === userId);
    if (action === 'view') toast.info(`Viewing user: ${user?.email}`);
    if (action === 'suspend') toast.success(`User ${user?.email} suspended`);
    if (action === 'activate') toast.success(`User ${user?.email} activated`);
  };

  const filteredUsers = MOCK_ADMIN_USERS.filter(u =>
    !userSearch ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const matchesSeverity = auditSeverity === 'All' || log.severity === auditSeverity;
    const matchesSearch = !auditSearch ||
      log.eventType.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.userEmail || '').toLowerCase().includes(auditSearch.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const TABS = [
    { id: 'users', label: 'User Management', icon: Users, count: MOCK_ADMIN_USERS.length },
    { id: 'audit', label: 'Audit Logs', icon: Activity, count: MOCK_AUDIT_LOGS.length },
    { id: 'system', label: 'System Status', icon: Server, count: null },
  ] as const;

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Admin Panel' },
      ]}
    >
      <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">System administration and audit monitoring</p>
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: '#FEF9C3', color: '#854D0E' }}>
            <Shield className="w-3.5 h-3.5" />
            Admin Access — All actions logged
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#F3F4F6' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 justify-center"
              style={{
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#1B3A6B' : '#6B7280',
                boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== null && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: activeTab === tab.id ? '#EFF6FF' : '#E5E7EB', color: activeTab === tab.id ? '#1B3A6B' : '#6B7280' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="pl-9 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Export feature available in production')}>
                Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>MFA</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <UserRow key={user.id} user={user} onAction={handleUserAction} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} shown
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  placeholder="Search by event type or email..."
                  className="pl-9 text-sm"
                />
              </div>
              <div className="flex gap-1">
                {['All', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setAuditSeverity(sev)}
                    className="px-2.5 py-1.5 rounded text-xs font-medium transition-colors"
                    style={{
                      background: auditSeverity === sev ? '#1B3A6B' : '#F3F4F6',
                      color: auditSeverity === sev ? 'white' : '#374151',
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Chain integrity notice */}
            <div className="px-5 py-2.5 border-b border-gray-50 flex items-center gap-2 text-xs" style={{ background: '#F0FDF4' }}>
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700">Audit chain integrity verified — SHA-256 tamper-evident log</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Event Type</th>
                    <th>User</th>
                    <th>IP Address</th>
                    <th>Timestamp</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <AuditRow key={log.id} entry={log} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              {filteredLogs.length} log entries shown • Click row to expand chain hash details
            </div>
          </div>
        )}

        {/* System Status Tab */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'OIDC Provider', status: 'Operational', icon: Key, color: '#22C55E' },
                { label: 'BB2.0 Connection', status: 'Connected', icon: Database, color: '#22C55E' },
                { label: 'FHIR Proxy', status: 'Operational', icon: Server, color: '#22C55E' },
                { label: 'Signing Key', status: 'Valid (RSA-4096)', icon: Lock, color: '#22C55E' },
                { label: 'Audit Chain', status: 'Intact', icon: Shield, color: '#22C55E' },
                { label: 'Rate Limiter', status: 'Active', icon: Activity, color: '#22C55E' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  </div>
                  <div className="text-xs font-medium" style={{ color: item.color }}>{item.status}</div>
                </div>
              ))}
            </div>

            {/* OIDC Endpoints */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>OIDC Endpoints</h2>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { method: 'GET', path: '/.well-known/openid-configuration', desc: 'Discovery document' },
                  { method: 'GET', path: '/api/oidc/authorize', desc: 'Authorization endpoint (PKCE required)' },
                  { method: 'POST', path: '/api/oidc/token', desc: 'Token endpoint' },
                  { method: 'GET', path: '/api/oidc/userinfo', desc: 'UserInfo endpoint' },
                  { method: 'GET', path: '/api/oidc/jwks', desc: 'JSON Web Key Set' },
                  { method: 'POST', path: '/api/oidc/revoke', desc: 'Token revocation' },
                  { method: 'POST', path: '/api/oidc/introspect', desc: 'Token introspection' },
                  { method: 'GET', path: '/api/oidc/logout', desc: 'End session endpoint' },
                ].map(ep => (
                  <div key={ep.path} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded font-mono" style={{ background: ep.method === 'GET' ? '#DBEAFE' : '#D1FAE5', color: ep.method === 'GET' ? '#1E40AF' : '#065F46', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono flex-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#374151' }}>{ep.path}</span>
                    <span className="text-xs text-gray-400 hidden sm:block">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key rotation status */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 text-sm mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>Cryptographic Key Status</h2>
              <div className="space-y-3">
                {[
                  { label: 'Active Signing Key', value: 'RSA-4096 • kid: key_2026_03_01', status: 'Active', expires: 'Mar 31, 2026' },
                  { label: 'Overlap Key (retiring)', value: 'RSA-4096 • kid: key_2026_02_01', status: 'Retiring', expires: 'Mar 8, 2026' },
                  { label: 'Next Key (scheduled)', value: 'RSA-4096 • kid: key_2026_04_01', status: 'Pending', expires: 'Apr 30, 2026' },
                ].map(key => (
                  <div key={key.label} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-700">{key.label}</div>
                      <div className="text-xs font-mono text-gray-400" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{key.value}</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${key.status === 'Active' ? 'badge-active' : key.status === 'Retiring' ? 'badge-pending' : 'badge-info'}`}>
                        {key.status}
                      </span>
                      <div className="text-xs text-gray-400 mt-0.5">Exp: {key.expires}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
