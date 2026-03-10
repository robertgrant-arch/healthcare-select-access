// Healthcare Select Access — Auth Layout
// Design: Secure Clarity | Centered card with branded header

import { Link } from 'wouter';
import { Shield, Lock } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  stepLabels?: string[];
}

export default function AuthLayout({ children, title, subtitle, step, totalSteps, stepLabels }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0F2D5C 0%, #0E7490 100%)',
      }}
    >
      {/* Top bar */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
            Healthcare Select Access
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-white/70">
          <Lock className="w-3 h-3" />
          <span>256-bit encrypted</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Step indicator */}
          {step !== undefined && totalSteps !== undefined && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className={`step-dot ${i < step ? 'completed' : i === step - 1 ? 'active' : 'pending'}`}>
                      {i < step ? (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                        </svg>
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    {i < totalSteps - 1 && (
                      <div className={`step-line ${i < step - 1 ? 'completed' : ''}`} />
                    )}
                  </div>
                ))}
              </div>
              {stepLabels && (
                <div className="flex justify-between">
                  {stepLabels.map((label, i) => (
                    <span
                      key={i}
                      className="text-xs text-white/60 text-center"
                      style={{ width: `${100 / totalSteps}%`, fontSize: '10px' }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Card */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Card header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>

            {/* Card body */}
            <div className="px-6 py-6">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-white/50 space-y-1">
            <p>Protected by HIPAA-grade security • AES-256-GCM encryption</p>
            <p>
              <Link href="/" className="hover:text-white/80 underline">Privacy Policy</Link>
              {' · '}
              <Link href="/" className="hover:text-white/80 underline">Terms of Service</Link>
              {' · '}
              <Link href="/" className="hover:text-white/80 underline">Accessibility</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
