// Healthcare Select Access — OIDC Documentation Page
// Design: Secure Clarity | Developer documentation for OIDC integration

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Code, Copy, CheckCircle, Book, Key, Shield, Globe,
  ChevronDown, ChevronRight, ExternalLink, Lock, Zap
} from 'lucide-react';

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: '#0F2D5C' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <span className="text-xs text-blue-300 font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors">
          {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs overflow-x-auto" style={{ color: '#E2E8F0', fontFamily: 'IBM Plex Mono, monospace', lineHeight: '1.6' }}>
        {code}
      </pre>
    </div>
  );
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h2>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

export default function OIDCDocs() {
  const baseUrl = window.location.origin;

  const discoveryDoc = JSON.stringify({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/oidc/authorize`,
    token_endpoint: `${baseUrl}/api/oidc/token`,
    userinfo_endpoint: `${baseUrl}/api/oidc/userinfo`,
    jwks_uri: `${baseUrl}/api/oidc/jwks`,
    revocation_endpoint: `${baseUrl}/api/oidc/revoke`,
    introspection_endpoint: `${baseUrl}/api/oidc/introspect`,
    end_session_endpoint: `${baseUrl}/api/oidc/logout`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    subject_types_supported: ['pairwise'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email', 'fhir:read', 'fhir:write', 'bb2:read'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post', 'private_key_jwt'],
    code_challenge_methods_supported: ['S256'],
    claims_supported: ['sub', 'iss', 'aud', 'exp', 'iat', 'email', 'name', 'given_name', 'family_name', 'role'],
  }, null, 2);

  const authFlowCode = `// 1. Generate PKCE code verifier and challenge
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256')
  .update(codeVerifier).digest('base64url');

// 2. Build authorization URL
const params = new URLSearchParams({
  response_type: 'code',
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: 'https://your-app.example.com/callback',
  scope: 'openid profile email fhir:read bb2:read',
  state: crypto.randomBytes(16).toString('hex'),
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
  nonce: crypto.randomBytes(16).toString('hex'),
});

window.location.href = \`${baseUrl}/api/oidc/authorize?\${params}\`;`;

  const tokenExchangeCode = `// 3. Exchange authorization code for tokens
const response = await fetch('${baseUrl}/api/oidc/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,          // from callback URL
    redirect_uri: 'https://your-app.example.com/callback',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    code_verifier: codeVerifier,      // PKCE verifier
  }),
});

const { access_token, id_token, refresh_token, expires_in } = await response.json();`;

  const fhirProxyCode = `// 4. Access FHIR resources via proxy
const eobs = await fetch('${baseUrl}/api/fhir/ExplanationOfBenefit', {
  headers: {
    'Authorization': \`Bearer \${access_token}\`,
    'Accept': 'application/fhir+json',
  },
});

const bundle = await eobs.json();
// Returns FHIR R4 Bundle with ExplanationOfBenefit resources`;

  const idTokenClaims = JSON.stringify({
    iss: baseUrl,
    sub: 'pairwise-subject-identifier',
    aud: 'YOUR_CLIENT_ID',
    exp: 1741651200,
    iat: 1741647600,
    nonce: 'random-nonce',
    email: 'user@example.com',
    given_name: 'Jane',
    family_name: 'Doe',
    role: 'BENEFICIARY',
    mfa_verified: true,
    identity_verified: true,
  }, null, 2);

  const jwksExample = JSON.stringify({
    keys: [{
      kty: 'RSA',
      use: 'sig',
      alg: 'RS256',
      kid: 'key_2026_03_01',
      n: 'sJdTqBHItH...(base64url-encoded modulus)',
      e: 'AQAB',
    }],
  }, null, 2);

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'OIDC Documentation' },
      ]}
    >
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              OIDC Provider Documentation
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Integration guide for Healthcare Select Access OpenID Connect provider
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`${baseUrl}/.well-known/openid-configuration`, '_blank')}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Discovery Doc
          </Button>
        </div>

        {/* Quick reference */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Protocol', value: 'OIDC Core 1.0', icon: Globe, color: '#1B3A6B' },
            { label: 'PKCE', value: 'Required (S256)', icon: Shield, color: '#0E7490' },
            { label: 'Signing', value: 'RS256 / RSA-4096', icon: Key, color: '#7C3AED' },
            { label: 'Subjects', value: 'Pairwise', icon: Lock, color: '#D97706' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center gap-2 mb-1.5">
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
              <div className="text-sm font-semibold text-gray-800">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Discovery Document */}
        <Section title="OpenID Connect Discovery Document" defaultOpen={true}>
          <p className="text-sm text-gray-600">
            The discovery document is available at <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: '#F3F4F6', fontFamily: 'IBM Plex Mono, monospace' }}>/.well-known/openid-configuration</code> and contains all endpoint URLs and supported capabilities.
          </p>
          <CodeBlock code={discoveryDoc} language="json" />
        </Section>

        {/* Authorization Flow */}
        <Section title="Authorization Code Flow with PKCE" defaultOpen={true}>
          <p className="text-sm text-gray-600">
            PKCE (Proof Key for Code Exchange) is <strong>required</strong> for all clients. Use <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#F3F4F6', fontFamily: 'IBM Plex Mono, monospace' }}>code_challenge_method=S256</code>.
          </p>
          <CodeBlock code={authFlowCode} language="javascript" />
        </Section>

        {/* Token Exchange */}
        <Section title="Token Exchange">
          <p className="text-sm text-gray-600">
            Exchange the authorization code for access, ID, and refresh tokens at the token endpoint.
          </p>
          <CodeBlock code={tokenExchangeCode} language="javascript" />
        </Section>

        {/* FHIR Proxy */}
        <Section title="FHIR R4 Proxy Access">
          <p className="text-sm text-gray-600">
            Use the access token to query FHIR resources. The proxy forwards requests to CMS Blue Button 2.0 on behalf of the authenticated user.
          </p>
          <CodeBlock code={fhirProxyCode} language="javascript" />
          <div className="mt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Available FHIR Endpoints</div>
            <div className="space-y-1.5">
              {[
                { path: '/api/fhir/Patient', scope: 'fhir:read', desc: 'Patient demographics' },
                { path: '/api/fhir/ExplanationOfBenefit', scope: 'fhir:read bb2:read', desc: 'Claims and EOBs' },
                { path: '/api/fhir/Coverage', scope: 'fhir:read bb2:read', desc: 'Insurance coverage' },
                { path: '/api/fhir/$export', scope: 'fhir:read', desc: 'Bulk FHIR export (NDJSON)' },
              ].map(ep => (
                <div key={ep.path} className="flex items-center gap-3 py-1.5 text-xs border-b border-gray-50 last:border-0">
                  <span className="font-mono w-52 flex-shrink-0" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#1B3A6B' }}>{ep.path}</span>
                  <span className="text-gray-400 flex-1">{ep.desc}</span>
                  <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: '#EFF6FF', color: '#1D4ED8', fontFamily: 'IBM Plex Mono, monospace' }}>{ep.scope}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ID Token Claims */}
        <Section title="ID Token Claims">
          <p className="text-sm text-gray-600">
            ID tokens are signed RS256 JWTs. Verify the signature using the JWKS endpoint. Subjects are pairwise — each client receives a different <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#F3F4F6', fontFamily: 'IBM Plex Mono, monospace' }}>sub</code> value.
          </p>
          <CodeBlock code={idTokenClaims} language="json (decoded payload)" />
        </Section>

        {/* JWKS */}
        <Section title="JSON Web Key Set (JWKS)">
          <p className="text-sm text-gray-600">
            Public keys for verifying token signatures. Keys are rotated monthly with a 7-day overlap period. Always fetch JWKS dynamically — do not cache indefinitely.
          </p>
          <CodeBlock code={jwksExample} language="json" />
        </Section>

        {/* Scopes */}
        <Section title="Scopes Reference">
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Description</th>
                  <th>Resources</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { scope: 'openid', desc: 'Required. Returns sub claim in ID token', resources: 'ID Token' },
                  { scope: 'profile', desc: 'Name, given_name, family_name', resources: 'UserInfo' },
                  { scope: 'email', desc: 'Email address and verification status', resources: 'UserInfo' },
                  { scope: 'fhir:read', desc: 'Read access to FHIR resources via proxy', resources: 'Patient, Coverage' },
                  { scope: 'fhir:write', desc: 'Write access to FHIR resources', resources: 'Patient (limited)' },
                  { scope: 'bb2:read', desc: 'Read Medicare claims via BB2.0', resources: 'ExplanationOfBenefit' },
                ].map(row => (
                  <tr key={row.scope}>
                    <td><code className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#EFF6FF', color: '#1D4ED8', fontFamily: 'IBM Plex Mono, monospace' }}>{row.scope}</code></td>
                    <td className="text-sm text-gray-600">{row.desc}</td>
                    <td className="text-xs text-gray-400">{row.resources}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Error Codes */}
        <Section title="Error Codes">
          <div className="space-y-2">
            {[
              { code: 'invalid_request', desc: 'Missing or malformed request parameters' },
              { code: 'unauthorized_client', desc: 'Client not authorized for this grant type' },
              { code: 'access_denied', desc: 'User denied authorization or resource access' },
              { code: 'invalid_scope', desc: 'Requested scope is invalid or not granted' },
              { code: 'invalid_grant', desc: 'Authorization code expired, used, or PKCE mismatch' },
              { code: 'invalid_token', desc: 'Access token invalid, expired, or revoked' },
              { code: 'insufficient_scope', desc: 'Token lacks required scope for this resource' },
            ].map(err => (
              <div key={err.code} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <code className="text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: '#FEE2E2', color: '#991B1B', fontFamily: 'IBM Plex Mono, monospace' }}>{err.code}</code>
                <span className="text-sm text-gray-600">{err.desc}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </AppLayout>
  );
}
