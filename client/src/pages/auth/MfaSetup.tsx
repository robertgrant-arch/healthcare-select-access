// Healthcare Select Access — MFA Setup Page (Phase 3)
// TOTP enrollment with QR code and backup codes

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Copy, CheckCircle, Download, Shield } from 'lucide-react';

const STEP_LABELS = ['Email & Password', 'Verify Email', 'Identity Proof', 'Setup MFA'];

export default function MfaSetup() {
  const [, navigate] = useLocation();
  const { setupMfa, confirmMfaSetup } = useAuth();

  const [setupData, setSetupData] = useState<{
    secret: string;
    uri: string;
    qrDataUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupLoading, setIsSetupLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [backupAcknowledged, setBackupAcknowledged] = useState(false);

  useEffect(() => {
    setupMfa().then(data => {
      setSetupData(data);
      setIsSetupLoading(false);
    });
  }, [setupMfa]);

  const handleCopySecret = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleCopyBackupCodes = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
      toast.success('Backup codes copied to clipboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length < 6) {
      setError('Please enter the 6-digit code from your authenticator app.');
      return;
    }
    if (!backupAcknowledged) {
      setError('Please confirm you have saved your backup codes.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await confirmMfaSetup(verifyCode);
      toast.success('MFA enabled successfully! Your account is now fully protected.');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid code. Please check your authenticator app and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a simple QR code SVG (simplified representation)
  const QRCodeDisplay = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="w-40 h-40 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-white p-2">
        {/* Simplified QR code visual */}
        <div className="w-full h-full grid grid-cols-8 gap-0.5">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                background: Math.random() > 0.5 ? '#1B3A6B' : 'transparent',
                aspectRatio: '1',
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Scan with Google Authenticator, Authy, or any TOTP-compatible app
      </p>
    </div>
  );

  return (
    <AuthLayout
      title="Set Up Two-Factor Authentication"
      subtitle="Step 4 of 4: Mandatory TOTP MFA enrollment"
      step={4}
      totalSteps={4}
      stepLabels={STEP_LABELS}
    >
      {isSetupLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#0E7490' }} />
          <span className="ml-2 text-sm text-gray-500">Generating secure TOTP secret...</span>
        </div>
      ) : setupData ? (
        <div className="space-y-5">
          {/* PHI notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: '#FFF7ED', borderColor: '#FED7AA', border: '1px solid' }}>
            <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#9A3412' }} />
            <span style={{ color: '#9A3412' }}>
              <strong>Required:</strong> MFA is mandatory for all accounts accessing Protected Health Information (PHI) under HIPAA.
            </span>
          </div>

          {/* Step 1: Scan QR */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">1. Scan QR Code or Enter Secret</div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'qr' ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                style={activeTab === 'qr' ? { background: '#0E7490' } : {}}
              >
                QR Code
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'manual' ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                style={activeTab === 'manual' ? { background: '#0E7490' } : {}}
              >
                Manual Entry
              </button>
            </div>

            {activeTab === 'qr' ? (
              <QRCodeDisplay />
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-lg font-mono text-sm text-center tracking-widest select-all" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {setupData.secret}
                </div>
                <button
                  onClick={handleCopySecret}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs rounded-md border transition-colors hover:bg-gray-50"
                >
                  {copiedSecret ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  {copiedSecret ? 'Copied!' : 'Copy secret key'}
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Backup Codes */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">2. Save Your Backup Codes</div>
            <div className="grid grid-cols-2 gap-1.5 p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
              {setupData.backupCodes.map(code => (
                <div key={code} className="text-xs font-mono text-center py-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#374151' }}>
                  {code}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCopyBackupCodes}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md border hover:bg-gray-50 transition-colors"
              >
                {copiedBackup ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                {copiedBackup ? 'Copied!' : 'Copy all'}
              </button>
              <button
                onClick={() => toast.info('Download feature available in production')}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-md border hover:bg-gray-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-gray-400" />
                Download
              </button>
            </div>
          </div>

          {/* Step 3: Verify */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-sm font-semibold text-gray-700">3. Verify Setup</div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="verify-code" className="text-sm font-medium text-gray-700">Enter code from authenticator app</Label>
              <Input
                id="verify-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-xl tracking-[0.5em] font-mono h-12"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="backup-ack"
                checked={backupAcknowledged}
                onChange={e => setBackupAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4"
                style={{ accentColor: '#0E7490' }}
              />
              <label htmlFor="backup-ack" className="text-xs text-gray-600">
                I have saved my backup codes in a secure location. I understand I cannot recover my account without them.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
              disabled={isLoading || verifyCode.length < 6}
            >
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enabling MFA...</> : 'Enable MFA & Access Portal'}
            </Button>
          </form>
        </div>
      ) : null}
    </AuthLayout>
  );
}
