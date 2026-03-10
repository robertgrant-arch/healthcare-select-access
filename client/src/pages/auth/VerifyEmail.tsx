// Healthcare Select Access — Email Verification Page (Phase 1 → 2)

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const STEP_LABELS = ['Email & Password', 'Verify Email', 'Identity Proof', 'Setup MFA'];

export default function VerifyEmail() {
  const [, navigate] = useLocation();
  const { verifyEmail } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId') || '';
  const email = params.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = text.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await verifyEmail(userId, code);
      toast.success('Email verified successfully!');
      navigate(`/auth/verify-identity?userId=${userId}`);
    } catch (err) {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResent(true);
    toast.success('A new verification code has been sent to your email.');
    setTimeout(() => setResent(false), 60000);
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We sent a 6-digit code to ${email || 'your email'}`}
      step={2}
      totalSteps={4}
      stepLabels={STEP_LABELS}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#E0F2FE' }}>
            <Mail className="w-7 h-7" style={{ color: '#0E7490' }} />
          </div>
          <p className="text-sm text-gray-500">
            Check your inbox at <strong className="text-gray-700">{email}</strong>
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              className="otp-input"
              style={{
                width: '3rem',
                height: '3.5rem',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 600,
                border: '2px solid',
                borderColor: digit ? '#0E7490' : '#E5E7EB',
                borderRadius: '0.5rem',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        <p className="text-xs text-center text-gray-400">
          Enter the 6-digit code from your email. Code expires in 15 minutes.
        </p>

        <Button
          type="submit"
          className="w-full text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
          disabled={isLoading || otp.join('').length < 6}
        >
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify Email'}
        </Button>

        <div className="text-center">
          {resent ? (
            <div className="flex items-center justify-center gap-1.5 text-sm" style={{ color: '#0E7490' }}>
              <CheckCircle className="w-4 h-4" />
              <span>Code resent! Check your email.</span>
            </div>
          ) : (
            <button type="button" onClick={handleResend} className="text-sm hover:underline" style={{ color: '#0E7490' }}>
              Didn't receive it? Resend code
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}
