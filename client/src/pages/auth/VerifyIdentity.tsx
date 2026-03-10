// Healthcare Select Access — Identity Verification Page (Phase 2)
// MBI-based identity proofing

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Shield, Info } from 'lucide-react';

const STEP_LABELS = ['Email & Password', 'Verify Email', 'Identity Proof', 'Setup MFA'];

export default function VerifyIdentity() {
  const [, navigate] = useLocation();
  const { verifyIdentity } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId') || '';

  const [mbi, setMbi] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Format MBI as user types: 1EG4-TE5-MK72
  const formatMbi = (value: string) => {
    const clean = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 11);
    if (clean.length <= 4) return clean;
    if (clean.length <= 7) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
    return `${clean.slice(0, 4)}-${clean.slice(4, 7)}-${clean.slice(7)}`;
  };

  const handleMbiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMbi(formatMbi(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMbi = mbi.replace(/-/g, '');
    if (cleanMbi.length < 11) {
      setError('Please enter your complete 11-character Medicare Beneficiary Identifier.');
      return;
    }
    if (!dateOfBirth) {
      setError('Please enter your date of birth.');
      return;
    }
    if (!lastName) {
      setError('Please enter your last name as it appears on your Medicare card.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await verifyIdentity({ mbi: cleanMbi, dateOfBirth, lastName });
      toast.success('Identity verified successfully!');
      navigate(`/auth/mfa/setup?userId=${userId}`);
    } catch (err) {
      setError('Identity verification failed. Please check your MBI, date of birth, and last name.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Identity"
      subtitle="Step 3 of 4: Medicare identity proofing"
      step={3}
      totalSteps={4}
      stepLabels={STEP_LABELS}
    >
      <div className="space-y-5">
        {/* Info box */}
        <div className="flex items-start gap-3 p-3 rounded-lg border" style={{ background: '#E0F2FE', borderColor: '#BAE6FD' }}>
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0369A1' }} />
          <div className="text-xs" style={{ color: '#0C4A6E' }}>
            <strong>Why we need this:</strong> Federal law requires identity verification before accessing Medicare records. Your MBI is used only for verification and stored as a one-way hash — never in plaintext.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="mbi" className="text-sm font-medium text-gray-700">
              Medicare Beneficiary Identifier (MBI)
            </Label>
            <Input
              id="mbi"
              value={mbi}
              onChange={handleMbiChange}
              placeholder="1EG4-TE5-MK72"
              className="font-mono text-base tracking-wider uppercase"
              style={{ fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em' }}
              disabled={isLoading}
              maxLength={13}
            />
            <p className="text-xs text-gray-400">
              Found on your red, white, and blue Medicare card. Format: XXXXXXXXX-XXX-XXXX
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name (as on Medicare card)
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="DOE"
              className="uppercase"
              disabled={isLoading}
            />
          </div>

          {/* PHI warning */}
          <div className="phi-warning text-xs">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Protected Health Information:</strong> This information is transmitted over TLS 1.3 and verified against CMS eligibility records. Your MBI is stored as an HMAC-SHA256 hash only.
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying with CMS...</>
            ) : (
              'Verify Identity & Continue'
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Having trouble? <a href="#" className="underline" style={{ color: '#0E7490' }}>Contact Support</a>
        </div>
      </div>
    </AuthLayout>
  );
}
