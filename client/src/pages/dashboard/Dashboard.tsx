// Healthcare Select Access — Dashboard
// Design: Secure Clarity | Stats cards, BB2 status, recent activity

import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  FileText, Share2, Activity, Shield, RefreshCw, ExternalLink,
  CheckCircle, AlertCircle, Clock, Lock, ArrowRight, Zap,
  TrendingUp, Eye, Download
} from 'lucide-react';
import { MOCK_DASHBOARD_STATS, MOCK_EOBS, MOCK_COVERAGE } from '@/lib/mock-data';
import React from 'react';
import type { AuditLogEntry } from '@/lib/types';

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  AUTH_LOGIN_SUCCESS: Lock,
  AUTH_LOGOUT: Lock,
  FHIR_READ: FileText,
  BB2_TOKEN_REFRESH: RefreshCw,
  SHARE_CREATE: Share2,
  PHI_EXPORT: Download,
  AUTH_MFA_VERIFY: Shield,
};

const EVENT_COLORS: Record<string, string> = {
  INFO: '#0E7490',
  WARNING: '#D97706',
  ERROR: '#DC2626',
  CRITICAL: '#7C3AED',
};

function AuditItem({ entry }: { entry: AuditLogEntry }) {
  const Icon = EVENT_ICONS[entry.eventType] || Activity;
  const color = EVENT_COLORS[entry.severity];

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const formatEventType = (type: string) =>
    type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="audit-chain-item">
      <div
        className="audit-chain-dot"
        style={{ background: color, borderColor: 'white' }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: color + '15' }}>
            <Icon className="w-3 h-3" style={{ color }} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{formatEventType(entry.eventType)}</div>
            {entry.resourceType && (
              <div className="text-xs text-gray-400 font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {entry.resourceType}/{entry.resourceId}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400 flex-shrink-0">{formatTime(entry.createdAt)}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const stats = MOCK_DASHBOARD_STATS;

  const handleBB2Connect = () => {
    toast.info('Redirecting to CMS Blue Button 2.0 authorization...');
    // In production: initiate BB2 OAuth flow
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
    toast.success('Records synced successfully from CMS Blue Button 2.0');
  };

  const formatCurrency = (amount?: number) =>
    amount !== undefined ? `$${amount.toFixed(2)}` : '—';

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <AppLayout
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Your Medicare records portal • Last login: {formatDate(user?.lastLoginAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing || stats.bb2Status !== 'CONNECTED'}
              className="text-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Records'}
            </Button>
            <Link href="/records">
              <Button size="sm" className="text-sm text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                View Records
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* BB2 Connection Banner */}
        {stats.bb2Status === 'NOT_CONNECTED' && (
          <div className="rounded-xl p-5 border" style={{ background: 'linear-gradient(135deg, #EFF6FF, #E0F2FE)', borderColor: '#BAE6FD' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1B3A6B' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Connect to CMS Blue Button 2.0</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Authorize access to your complete Medicare claims history via FHIR R4 API
                  </div>
                </div>
              </div>
              <Button
                onClick={handleBB2Connect}
                className="text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
              >
                Connect Now
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {stats.bb2Status === 'CONNECTED' && (
          <div className="rounded-xl p-4 border flex items-center justify-between" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-semibold text-green-800">Blue Button 2.0 Connected</div>
                <div className="text-xs text-green-600">
                  Last synced: {formatDate(stats.lastSyncAt)} • Patient ID isolated • Tokens encrypted AES-256-GCM
                </div>
              </div>
            </div>
            <button
              onClick={() => toast.info('BB2 connection management available in Settings')}
              className="text-xs text-green-600 hover:underline"
            >
              Manage
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Claims',
              value: stats.totalClaims,
              icon: FileText,
              color: '#1B3A6B',
              bg: '#EFF6FF',
              href: '/records',
            },
            {
              label: 'Coverage Plans',
              value: stats.totalCoverage,
              icon: Shield,
              color: '#0E7490',
              bg: '#E0F2FE',
              href: '/records',
            },
            {
              label: 'Active Sessions',
              value: stats.activeSessions,
              icon: Activity,
              color: '#7C3AED',
              bg: '#F5F3FF',
              href: '/settings',
            },
            {
              label: 'Active Shares',
              value: stats.pendingShares,
              icon: Share2,
              color: '#D97706',
              bg: '#FFFBEB',
              href: '/share/create',
            },
          ].map((stat, i) => (
            <Link key={stat.label} href={stat.href}>
              <div
                className={`p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer animate-fade-in-up stagger-${i + 1}`}
                style={{ background: 'white' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color } as React.CSSProperties} />
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Claims */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Recent Claims</h2>
              <Link href="/records" className="text-xs font-medium hover:underline" style={{ color: '#0E7490' }}>
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_EOBS.slice(0, 4).map(eob => (
                <Link key={eob.id} href={`/records/${eob.id}`}>
                  <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
                        <FileText className="w-4 h-4" style={{ color: '#1B3A6B' }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {eob.type?.coding?.[0]?.display || 'Claim'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {eob.diagnosis?.[0]?.diagnosisCodeableConcept?.coding?.[0]?.display?.slice(0, 40) || 'No diagnosis'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-sm font-semibold text-gray-800">
                        {formatCurrency(eob.payment?.amount?.value)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {eob.billablePeriod?.start ? new Date(eob.billablePeriod.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar: Activity + Coverage */}
          <div className="space-y-4">
            {/* Coverage */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Coverage</h2>
              </div>
              <div className="p-4 space-y-2">
                {MOCK_COVERAGE.map(cov => (
                  <div key={cov.id} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: '#F8FAFC' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22C55E' }} />
                    <div>
                      <div className="text-xs font-medium text-gray-700">
                        {cov.class?.[0]?.value || 'Coverage'}
                      </div>
                      <div className="text-xs text-gray-400">{cov.payor?.[0]?.display?.slice(0, 25)}</div>
                    </div>
                    <span className="ml-auto badge-active text-xs">Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Audit Activity</h2>
                <Link href="/admin" className="text-xs hover:underline" style={{ color: '#0E7490' }}>View all</Link>
              </div>
              <div className="p-4">
                {stats.recentActivity.slice(0, 4).map(entry => (
                  <AuditItem key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Share Records',
              desc: 'Create a time-limited share link for your provider',
              icon: Share2,
              href: '/share/create',
              color: '#0E7490',
            },
            {
              title: 'Export Data',
              desc: 'Download your records as FHIR JSON or PDF',
              icon: Download,
              href: '/records',
              color: '#1B3A6B',
            },
            {
              title: 'View Audit Log',
              desc: 'See every access to your protected health information',
              icon: Eye,
              href: '/admin',
              color: '#7C3AED',
            },
          ].map(action => (
            <Link key={action.title} href={action.href}>
              <div className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer bg-white">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: action.color + '15' }}>
                  <action.icon className="w-5 h-5" style={{ color: action.color } as React.CSSProperties} />
                </div>
                <div className="font-medium text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{action.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Security Status */}
        <div className="rounded-xl p-4 border" style={{ background: '#F8FAFC', borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4" style={{ color: '#0E7490' }} />
            <span className="text-sm font-semibold text-gray-700">Security Status</span>
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { label: 'MFA', status: user?.mfaEnabled ? 'Active' : 'Disabled', ok: user?.mfaEnabled },
              { label: 'Session', status: 'Secure', ok: true },
              { label: 'BB2 Tokens', status: 'Encrypted', ok: true },
              { label: 'Audit Log', status: 'Intact', ok: true },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                {item.ok
                  ? <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  : <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                }
                <span className="text-xs text-gray-600">{item.label}: <strong>{item.status}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
