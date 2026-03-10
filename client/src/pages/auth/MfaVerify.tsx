// Healthcare Select Access — MFA Verify Page (standalone)

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Lock } from 'lucide-react';

export default function MfaVerify() {
  const [, navigate] = useLocation();
  const { verifyMfa } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId') || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Please enter your 6-digit authenticator code.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await verifyMfa(userId, code);
      toast.success('Verified successfully.');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Identity"
      subtitle="Enter your authenticator code to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#E0F2FE' }}>
            <Lock className="w-7 h-7" style={{ color: '#0E7490' }} />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="mfa-code" className="text-sm font-medium text-gray-700">6-Digit Authenticator Code</Label>
          <Input
            id="mfa-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="text-center text-2xl tracking-[0.5em] font-mono h-14"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            autoFocus
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
          disabled={isLoading || code.length < 6}
        >
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            className="text-sm hover:underline"
            style={{ color: '#0E7490' }}
            onClick={() => toast.info('Use a backup code: ALPHA-BRAVO-1234')}
          >
            Use a backup code
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
