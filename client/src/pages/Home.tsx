// Healthcare Select Access — Landing Page
// Design: Secure Clarity | Federal Blue + Medical Teal
// Hero with gradient background, feature cards, security badges

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Shield, Lock, FileText, Share2, Activity, CheckCircle,
  ArrowRight, ChevronRight, Zap, Eye, Key, Database
} from 'lucide-react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663319813187/n8eob4ANzegke7U6bFYfvo/hsa-hero-bg-f75AKrQvD4Hj2fCk4MqGco.webp';

const FEATURES = [
  {
    icon: Shield,
    title: 'HIPAA-Grade Security',
    description: 'AES-256-GCM encryption, RSA-4096 signing keys, and tamper-evident audit logs protect every record.',
    color: '#1B3A6B',
  },
  {
    icon: FileText,
    title: 'Blue Button 2.0 Integration',
    description: 'Securely connect to CMS to access your complete Medicare claims history via FHIR R4 API.',
    color: '#0E7490',
  },
  {
    icon: Lock,
    title: 'Multi-Factor Authentication',
    description: 'TOTP-based MFA with backup codes ensures only you can access your protected health information.',
    color: '#1B3A6B',
  },
  {
    icon: Share2,
    title: 'Secure Provider Sharing',
    description: 'Share time-limited, view-count-limited records with verified providers via NPI lookup.',
    color: '#0E7490',
  },
  {
    icon: Activity,
    title: 'Complete Audit Trail',
    description: 'Every access to your PHI is logged in a tamper-evident chain. You control who sees what.',
    color: '#1B3A6B',
  },
  {
    icon: Database,
    title: 'FHIR R4 Compliant',
    description: 'Patient, ExplanationOfBenefit, and Coverage resources available in standard FHIR JSON format.',
    color: '#0E7490',
  },
];

const SECURITY_BADGES = [
  { label: 'HIPAA Compliant', icon: Shield },
  { label: 'SOC 2 Type II', icon: CheckCircle },
  { label: 'FHIR R4', icon: Database },
  { label: 'PKCE OAuth 2.0', icon: Key },
  { label: 'RS256 JWT', icon: Lock },
  { label: 'Zero PHI in Logs', icon: Eye },
];

const FLOW_STEPS = [
  { step: '01', title: 'Create Account', desc: 'Register with email, verify your identity with your Medicare Beneficiary Identifier (MBI).' },
  { step: '02', title: 'Enable MFA', desc: 'Set up TOTP-based multi-factor authentication for HIPAA-compliant PHI access.' },
  { step: '03', title: 'Connect Blue Button', desc: 'Authorize Healthcare Select Access to retrieve your Medicare data from CMS securely.' },
  { step: '04', title: 'Access Your Records', desc: 'View claims, coverage, and share records with providers via time-limited secure links.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm leading-tight" style={{ fontFamily: 'Sora, sans-serif', color: '#1B3A6B' }}>Healthcare Select Access</div>
                <div className="text-xs text-gray-400 leading-tight">Medicare Beneficiary Portal</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
              <Link href="/docs/oidc" className="text-gray-600 hover:text-gray-900 transition-colors">OIDC Docs</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="text-sm text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-16 min-h-screen flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F2D5C 0%, #0E7490 100%)',
        }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                <Zap className="w-3 h-3" />
                CMS Blue Button 2.0 Certified
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                Your Medicare Records,
                <span className="block" style={{ color: '#7DD3FC' }}>Secured & Accessible</span>
              </h1>

              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
                Healthcare Select Access is a HIPAA-grade patient portal that lets Medicare beneficiaries securely access, manage, and share their complete medical records via the CMS Blue Button 2.0 FHIR API.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto text-base font-semibold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #0E7490, #0891B2)', border: 'none' }}>
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold text-white border-white/30 bg-white/10 hover:bg-white/20">
                    Sign In to Portal
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4">
                {['HIPAA Compliant', 'Zero PHI Exposure', 'SOC 2 Type II', 'FHIR R4'].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5 text-xs text-white/70">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview card */}
            <div className="hidden lg:block animate-fade-in-up stagger-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
                {/* Mini dashboard preview */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Patient Dashboard</div>
                    <div className="text-white/60 text-xs">Jane Doe • MBI: ****-7A94</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    BB2 Connected
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Claims', value: '5' },
                    { label: 'Coverage Plans', value: '2' },
                    { label: 'Active Shares', value: '1' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{stat.value}</div>
                      <div className="text-xs text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="space-y-2">
                  {[
                    { type: 'Login', time: '2 min ago', icon: '🔐' },
                    { type: 'Record Viewed', time: '5 min ago', icon: '📄' },
                    { type: 'BB2 Sync', time: '10 min ago', icon: '🔄' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/10 last:border-0">
                      <span className="text-base">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs text-white/80">{item.type}</div>
                      </div>
                      <div className="text-xs text-white/40">{item.time}</div>
                    </div>
                  ))}
                </div>

                {/* Security footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
                  <Lock className="w-3 h-3" />
                  <span>Session secured with TOTP MFA • AES-256-GCM encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" style={{ display: 'block' }}>
            <path d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Security Badges */}
      <section id="security" className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {SECURITY_BADGES.map(badge => (
              <div key={badge.label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <badge.icon className="w-4 h-4" style={{ color: '#0E7490' }} />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4" style={{ background: '#E0F2FE', color: '#0C4A6E' }}>
              Enterprise-Grade Features
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif', color: '#1B3A6B' }}>
              Built for Security, Designed for Patients
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every feature is designed with HIPAA compliance and patient privacy as the foundation, not an afterthought.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 animate-fade-in-up stagger-${i + 1}`}
                style={{ background: 'white' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: feature.color + '15' }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif', color: '#1B3A6B' }}>
              Get Started in 4 Steps
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              From registration to accessing your complete Medicare history — secure and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < FLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 z-0" style={{ background: 'linear-gradient(to right, #0E7490, #E5E7EB)', width: 'calc(100% - 3rem)', left: '3rem' }} />
                )}
                <div className="relative z-10 bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4"
                    style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)', fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4" style={{ background: '#E0F2FE', color: '#0C4A6E' }}>
                Technical Architecture
              </div>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Sora, sans-serif', color: '#1B3A6B' }}>
                Production-Grade Infrastructure
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Custom OIDC Provider', desc: 'Full authorization code flow with PKCE, RS256 JWT, 30-day key rotation' },
                  { label: 'Envelope Encryption', desc: 'Per-user DEK for PHI with AES-256-GCM, KMS integration' },
                  { label: 'RBAC Permission Matrix', desc: 'Beneficiary, Provider, Admin roles with PHI-touching MFA requirement' },
                  { label: 'Tamper-Evident Audit Logs', desc: 'SHA-256 chained hash logs with 40+ event types' },
                  { label: 'FHIR Proxy', desc: 'Patient ID isolation, resource filtering, BB2.0 token management' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0E7490' }} />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-lg">
              {/* Code snippet */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100" style={{ background: '#1B3A6B' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-white/60 ml-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>OIDC Discovery Endpoint</span>
              </div>
              <pre className="p-4 text-xs overflow-x-auto" style={{ background: '#0F2D5C', color: '#E2E8F0', fontFamily: 'IBM Plex Mono, monospace', lineHeight: '1.6' }}>
{`GET /.well-known/openid-configuration

{
  "issuer": "https://hsa.example.gov",
  "authorization_endpoint": "/api/oidc/authorize",
  "token_endpoint": "/api/oidc/token",
  "userinfo_endpoint": "/api/oidc/userinfo",
  "jwks_uri": "/api/oidc/jwks",
  "response_types_supported": ["code"],
  "grant_types_supported": [
    "authorization_code",
    "refresh_token"
  ],
  "code_challenge_methods_supported": ["S256"],
  "token_endpoint_auth_methods": [
    "client_secret_basic",
    "private_key_jwt"
  ],
  "claims_supported": [
    "sub", "email", "given_name",
    "family_name", "mbi_hash", "amr"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0E7490 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Take Control of Your Medicare Records
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of Medicare beneficiaries who securely access and manage their health records with Healthcare Select Access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-base font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30">
                Create Your Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="ghost" className="text-base font-semibold text-white/80 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Healthcare Select Access</span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                HIPAA-grade Medicare beneficiary portal. Secure, compliant, and patient-controlled health data access.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Portal</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></div>
                <div><Link href="/auth/register" className="hover:text-white transition-colors">Register</Link></div>
                <div><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Technical</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div><Link href="/docs/oidc" className="hover:text-white transition-colors">OIDC Documentation</Link></div>
                <div><a href="#" className="hover:text-white transition-colors">FHIR API Reference</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Security Policy</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>© 2026 Healthcare Select Access. All rights reserved.</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>HIPAA Compliant • AES-256-GCM • RS256 JWT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
