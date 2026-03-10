// Healthcare Select Access — Settings Page
// Design: Secure Clarity | Profile, security, sessions, BB2 management

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  User, Lock, Shield, Activity, Smartphone, Globe,
  CheckCircle, AlertCircle, Trash2, RefreshCw, Key,
  Bell, Download, LogOut, Eye, EyeOff, Loader2
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'sessions', label: 'Sessions', icon: Activity },
  { id: 'bb2', label: 'BB2.0 Connection', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Privacy', icon: Shield },
] as const;

type TabId = typeof TABS[number]['id'];

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile form
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);

  // Notifications
  const [emailOnLogin, setEmailOnLogin] = useState(true);
  const [emailOnShare, setEmailOnShare] = useState(true);
  const [emailOnExport, setEmailOnExport] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 12) {
      toast.error('New password must be at least 12 characters');
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed successfully. All other sessions have been invalidated.');
  };

  const handleRevokeMfa = () => {
    toast.info('MFA revocation requires identity re-verification. Contact support.');
  };

  const handleRevokeSession = (sessionId: string) => {
    toast.success(`Session ${sessionId.slice(0, 8)}... revoked`);
  };

  const handleDisconnectBB2 = () => {
    toast.success('Blue Button 2.0 connection revoked. Your tokens have been deleted.');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email with a download link within 24 hours.');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires contacting support. This action cannot be undone.');
  };

  const mockSessions = [
    { id: 'sess_abc123', device: 'Chrome on macOS', ip: '192.168.1.100', location: 'San Francisco, CA', lastActive: new Date().toISOString(), current: true },
    { id: 'sess_def456', device: 'Safari on iPhone', ip: '10.0.0.50', location: 'San Francisco, CA', lastActive: new Date(Date.now() - 3600000).toISOString(), current: false },
    { id: 'sess_ghi789', device: 'Firefox on Windows', ip: '203.0.113.5', location: 'New York, NY', lastActive: new Date(Date.now() - 86400000).toISOString(), current: false },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' },
      ]}
    >
      <div className="p-4 lg:p-6 max-w-5xl mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Account Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your profile, security, and privacy preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-48 flex-shrink-0">
            <nav className="space-y-0.5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left"
                  style={{
                    background: activeTab === tab.id ? '#EFF6FF' : 'transparent',
                    color: activeTab === tab.id ? '#1B3A6B' : '#6B7280',
                  }}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Profile Information</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                      {firstName[0]}{lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{firstName} {lastName}</div>
                      <div className="text-sm text-gray-500">{email}</div>
                      <div className="text-xs mt-1">
                        <span className="badge-active">Verified</span>
                        {user?.mfaEnabled && <span className="badge-active ml-1.5">MFA Active</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <p className="text-xs text-gray-400">Changing email requires re-verification</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                    <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600">
                      {user?.role || 'BENEFICIARY'}
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="text-white"
                    style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
                  >
                    {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                {/* Change Password */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Change Password</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPw ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">New Password</Label>
                      <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 12 characters" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                      <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isSaving} variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>

                {/* MFA */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Two-Factor Authentication</h2>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: user?.mfaEnabled ? '#F0FDF4' : '#FEF9C3' }}>
                          <Smartphone className="w-5 h-5" style={{ color: user?.mfaEnabled ? '#166534' : '#854D0E' }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">Authenticator App (TOTP)</div>
                          <div className="text-xs text-gray-500">
                            {user?.mfaEnabled ? 'Active — TOTP codes required at login' : 'Not configured — Required for PHI access'}
                          </div>
                        </div>
                      </div>
                      {user?.mfaEnabled ? (
                        <div className="flex items-center gap-2">
                          <span className="badge-active">Active</span>
                          <Button variant="outline" size="sm" onClick={handleRevokeMfa} className="text-red-500 border-red-200 hover:bg-red-50">
                            Revoke
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" className="text-white" style={{ background: '#0E7490' }}>
                          Enable MFA
                        </Button>
                      )}
                    </div>

                    {user?.mfaEnabled && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm font-medium text-gray-700 mb-2">Backup Codes</div>
                        <div className="text-xs text-gray-500 mb-2">You have backup codes configured. Store them securely.</div>
                        <Button variant="outline" size="sm" onClick={() => toast.info('Backup codes regeneration requires MFA confirmation')}>
                          <Key className="w-3.5 h-3.5 mr-1.5" />
                          Regenerate Backup Codes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Active Sessions</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => toast.success('All other sessions revoked')}
                  >
                    Revoke All Others
                  </Button>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockSessions.map(session => (
                    <div key={session.id} className="px-5 py-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: session.current ? '#EFF6FF' : '#F8FAFC' }}>
                          <Activity className="w-4 h-4" style={{ color: session.current ? '#1B3A6B' : '#9CA3AF' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">{session.device}</span>
                            {session.current && <span className="badge-active text-xs">Current</span>}
                          </div>
                          <div className="text-xs text-gray-400">
                            {session.location} • {session.ip} • Last active {new Date(session.lastActive).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeSession(session.id)}
                          className="text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0"
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BB2 Tab */}
            {activeTab === 'bb2' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>CMS Blue Button 2.0 Connection</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-green-800">Connected</div>
                        <div className="text-xs text-green-600">Access token expires: Mar 15, 2026 • Auto-refresh enabled</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Authorized Scopes', value: 'patient/Patient.read, patient/ExplanationOfBenefit.read, patient/Coverage.read' },
                        { label: 'Token Storage', value: 'AES-256-GCM encrypted at rest' },
                        { label: 'Patient ID', value: 'Isolated — not stored in plaintext' },
                        { label: 'Last Sync', value: 'Mar 10, 2026 at 6:45 PM' },
                      ].map(item => (
                        <div key={item.label} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                          <span className="text-gray-500 w-36 flex-shrink-0">{item.label}</span>
                          <span className="text-gray-800 font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => toast.success('Records synced from BB2.0')}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDisconnectBB2}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Email Notifications</h2>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { label: 'Login alerts', desc: 'Get notified when your account is accessed from a new device', value: emailOnLogin, onChange: setEmailOnLogin },
                    { label: 'Share link activity', desc: 'Notifications when providers access your shared records', value: emailOnShare, onChange: setEmailOnShare },
                    { label: 'Data export', desc: 'Confirmation when your records are exported', value: emailOnExport, onChange: setEmailOnExport },
                  ].map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={item.value}
                          onChange={e => item.onChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 rounded-full peer transition-colors" style={{ background: item.value ? '#0E7490' : '#D1D5DB' }}>
                          <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform" style={{ transform: item.value ? 'translateX(16px)' : 'translateX(0)' }} />
                        </div>
                      </label>
                    </div>
                  ))}
                  <Button onClick={() => toast.success('Notification preferences saved')} className="text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>Your Data</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    <p className="text-sm text-gray-600">
                      Under HIPAA, you have the right to access, export, and request deletion of your Protected Health Information.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export All My Data (FHIR Bundle)
                      </Button>
                      <Button variant="outline" onClick={() => toast.info('Audit log export started')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Audit Log
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-red-100">
                    <h2 className="font-semibold text-red-700" style={{ fontFamily: 'Sora, sans-serif' }}>Danger Zone</h2>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">Delete Account</div>
                        <div className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all associated data. This action cannot be undone.</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAccount}
                        className="text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
