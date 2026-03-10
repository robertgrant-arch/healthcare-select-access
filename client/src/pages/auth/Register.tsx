// Healthcare Select Access — Registration Page (Phase 1)
// Design: Secure Clarity | 3-phase registration flow

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const STEP_LABELS = ['Email & Password', 'Verify Email', 'Identity Proof', 'Setup MFA'];

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (password.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Very Weak', color: '#EF4444' };
  if (score === 2) return { score, label: 'Weak', color: '#F97316' };
  if (score === 3) return { score, label: 'Fair', color: '#EAB308' };
  if (score === 4) return { score, label: 'Strong', color: '#22C55E' };
  return { score, label: 'Very Strong', color: '#0E7490' };
}

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = getPasswordStrength(password);

  const passwordRequirements = [
    { label: 'At least 12 characters', met: password.length >= 12 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await register({ email, password, firstName, lastName });
      toast.success('Account created! Check your email for a verification code.');
      navigate(`/auth/verify-email?userId=${result.userId}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Step 1 of 4: Email and password setup"
      step={1}
      totalSteps={4}
      stepLabels={STEP_LABELS}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" className="pl-9" disabled={isLoading} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" disabled={isLoading} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane.doe@example.com" className="pl-9" autoComplete="email" disabled={isLoading} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="pl-9 pr-9"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {passwordRequirements.map(req => (
                  <div key={req.label} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle className="w-3 h-3" style={{ color: req.met ? '#22C55E' : '#D1D5DB' }} />
                    <span style={{ color: req.met ? '#374151' : '#9CA3AF' }}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="pl-9"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {confirmPassword && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {password === confirmPassword
                  ? <CheckCircle className="w-4 h-4 text-green-500" />
                  : <AlertCircle className="w-4 h-4 text-red-400" />
                }
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded"
            style={{ accentColor: '#0E7490' }}
          />
          <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="underline" style={{ color: '#0E7490' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline" style={{ color: '#0E7490' }}>Privacy Policy</a>.
            I understand this portal handles Protected Health Information (PHI) under HIPAA.
          </label>
        </div>

        <Button
          type="submit"
          className="w-full text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
          disabled={isLoading}
        >
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : 'Create Account & Continue'}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium hover:underline" style={{ color: '#0E7490' }}>Sign in</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
