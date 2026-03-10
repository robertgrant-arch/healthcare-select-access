// Healthcare Select Access — Login Page
// Design: Secure Clarity | Auth card with gradient background

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [, navigate] = useLocation();
  const { login, verifyMfa } = useAuth();

  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await login(email, password);
      setUserId(result.userId);
      if (result.requiresMfa) {
        setStep('mfa');
        toast.info('Enter your authenticator code to continue.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setError('Please enter your 6-digit authenticator code.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await verifyMfa(userId, mfaCode);
      toast.success('Signed in successfully.');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid code. Please check your authenticator app and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 'credentials' ? 'Sign In to Your Account' : 'Two-Factor Authentication'}
      subtitle={step === 'credentials'
        ? 'Access your Medicare records securely'
        : 'Enter the 6-digit code from your authenticator app'
      }
    >
      {step === 'credentials' ? (
        <form onSubmit={handleCredentials} className="space-y-4">
          {/* Demo hint */}
          <div className="p-3 rounded-lg text-xs" style={{ background: '#E0F2FE', color: '#0C4A6E' }}>
            <strong>Demo:</strong> Use any email/password to proceed. MFA code: <span className="font-mono font-semibold">123456</span>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane.doe@example.com"
                className="pl-9"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <a href="#" className="text-xs hover:underline" style={{ color: '#0E7490' }}>Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-9 pr-9"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
            disabled={isLoading}
          >
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : 'Sign In'}
          </Button>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium hover:underline" style={{ color: '#0E7490' }}>
              Create account
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
              <Lock className="w-3 h-3" />
              <span>Protected by HIPAA-grade security • Session expires after 30 min idle</span>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMfa} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#E0F2FE' }}>
              <Lock className="w-8 h-8" style={{ color: '#0E7490' }} />
            </div>
            <p className="text-sm text-gray-500">
              Signed in as <strong className="text-gray-700">{email}</strong>
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mfa-code" className="text-sm font-medium text-gray-700">Authenticator Code</Label>
            <Input
              id="mfa-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="text-center text-2xl tracking-[0.5em] font-mono h-14"
              autoComplete="one-time-code"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-400 text-center">
              Open your authenticator app and enter the 6-digit code
            </p>
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
            disabled={isLoading || mfaCode.length < 6}
          >
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify & Sign In'}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              className="text-sm hover:underline"
              style={{ color: '#0E7490' }}
              onClick={() => toast.info('Use a backup code: ALPHA-BRAVO-1234')}
            >
              Use a backup code instead
            </button>
            <div className="block">
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-gray-600"
                onClick={() => { setStep('credentials'); setMfaCode(''); setError(''); }}
              >
                ← Back to sign in
              </button>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
