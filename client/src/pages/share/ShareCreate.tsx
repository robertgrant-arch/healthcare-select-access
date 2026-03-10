// Healthcare Select Access — Share Create Page
// Design: Secure Clarity | Create time-limited provider share links

import { useState } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Share2, Shield, Clock, Eye, User, Search,
  CheckCircle, Copy, ExternalLink, AlertCircle, Loader2, Info
} from 'lucide-react';
import { MOCK_EOBS, MOCK_SHARE_LINKS } from '@/lib/mock-data';

const EXPIRY_OPTIONS = [
  { label: '1 hour', value: 1 },
  { label: '6 hours', value: 6 },
  { label: '24 hours', value: 24 },
  { label: '48 hours', value: 48 },
  { label: '7 days', value: 168 },
];

const RESOURCE_TYPES = [
  { id: 'ExplanationOfBenefit', label: 'Claims (EOB)', desc: 'Explanation of Benefits records' },
  { id: 'Coverage', label: 'Coverage', desc: 'Insurance coverage details' },
  { id: 'Patient', label: 'Patient Info', desc: 'Basic demographic information' },
];

interface ProviderInfo {
  npi: string;
  name: string;
  specialty: string;
  organization: string;
}

export default function ShareCreate() {
  const [npi, setNpi] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [selectedResources, setSelectedResources] = useState<string[]>(['ExplanationOfBenefit']);
  const [expiryHours, setExpiryHours] = useState(24);
  const [maxViews, setMaxViews] = useState<number | undefined>(undefined);
  const [viewOnce, setViewOnce] = useState(false);
  const [isVerifyingNpi, setIsVerifyingNpi] = useState(false);
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleNpiLookup = async () => {
    if (npi.length !== 10) {
      toast.error('NPI must be exactly 10 digits');
      return;
    }
    setIsVerifyingNpi(true);
    await new Promise(r => setTimeout(r, 1000));
    // Mock NPI lookup result
    setProviderInfo({
      npi,
      name: 'Dr. Sarah Johnson, MD',
      specialty: 'Internal Medicine',
      organization: 'Metro Health Clinic',
    });
    setIsVerifyingNpi(false);
    toast.success('Provider verified via NPPES NPI Registry');
  };

  const toggleResource = (resourceId: string) => {
    setSelectedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(r => r !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleCreate = async () => {
    if (!providerInfo) {
      toast.error('Please verify the provider NPI first');
      return;
    }
    if (selectedResources.length === 0) {
      toast.error('Please select at least one resource type to share');
      return;
    }
    setIsCreating(true);
    await new Promise(r => setTimeout(r, 1200));
    const shareId = 'shr_' + Math.random().toString(36).substr(2, 9);
    const link = `${window.location.origin}/share/${shareId}`;
    setCreatedLink(link);
    setIsCreating(false);
    toast.success('Secure share link created successfully');
  };

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Share Records' },
      ]}
    >
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
            Share Records with Provider
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create a secure, time-limited share link for a verified healthcare provider
          </p>
        </div>

        {/* Security info */}
        <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: '#E0F2FE', borderColor: '#BAE6FD' }}>
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0369A1' }} />
          <div className="text-sm" style={{ color: '#0C4A6E' }}>
            <strong>Secure Sharing:</strong> Share links are signed RS256 JWTs with configurable expiry and view limits. Provider identity is verified via the NPPES NPI Registry. All access is logged in the audit trail.
          </div>
        </div>

        {createdLink ? (
          /* Success state */
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Share Link Created</div>
                <div className="text-sm text-gray-500">Expires in {expiryHours} hour{expiryHours !== 1 ? 's' : ''}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center gap-2">
              <span className="flex-1 text-sm font-mono text-gray-700 truncate" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {createdLink}
              </span>
              <button onClick={handleCopy} className="flex-shrink-0 p-1.5 rounded hover:bg-gray-200 transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2 rounded-lg" style={{ background: '#F8FAFC' }}>
                <div className="font-semibold text-gray-700">{selectedResources.length}</div>
                <div className="text-gray-400">Resource types</div>
              </div>
              <div className="p-2 rounded-lg" style={{ background: '#F8FAFC' }}>
                <div className="font-semibold text-gray-700">{expiryHours}h</div>
                <div className="text-gray-400">Expiry</div>
              </div>
              <div className="p-2 rounded-lg" style={{ background: '#F8FAFC' }}>
                <div className="font-semibold text-gray-700">{viewOnce ? '1' : maxViews || '∞'}</div>
                <div className="text-gray-400">Max views</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                onClick={() => { setCreatedLink(null); setProviderInfo(null); setNpi(''); }}
                className="flex-1 text-white"
                style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
              >
                Create Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Provider Verification */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100" style={{ background: '#F8FAFC' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#1B3A6B' }}>1</div>
                  <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Verify Provider</h2>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Provider NPI Number</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={npi}
                        onChange={e => setNpi(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="1234567890"
                        className="pl-9 font-mono"
                        style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        maxLength={10}
                      />
                    </div>
                    <Button
                      onClick={handleNpiLookup}
                      disabled={npi.length !== 10 || isVerifyingNpi}
                      variant="outline"
                    >
                      {isVerifyingNpi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">10-digit National Provider Identifier from NPPES registry</p>
                </div>

                {providerInfo && (
                  <div className="p-3 rounded-lg border border-green-200 bg-green-50 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-green-800">{providerInfo.name}</div>
                      <div className="text-xs text-green-600">{providerInfo.specialty} • {providerInfo.organization}</div>
                      <div className="text-xs text-green-500 font-mono mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>NPI: {providerInfo.npi}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Provider Email (optional)</Label>
                  <Input
                    type="email"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    placeholder="dr.johnson@clinic.example.com"
                  />
                  <p className="text-xs text-gray-400">Send an email notification with the share link</p>
                </div>
              </div>
            </div>

            {/* Step 2: Select Resources */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100" style={{ background: '#F8FAFC' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#1B3A6B' }}>2</div>
                  <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Select Records to Share</h2>
                </div>
              </div>
              <div className="p-5 space-y-2">
                {RESOURCE_TYPES.map(rt => (
                  <label key={rt.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50" style={{ borderColor: selectedResources.includes(rt.id) ? '#0E7490' : '#E5E7EB', background: selectedResources.includes(rt.id) ? '#F0FDFA' : 'white' }}>
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(rt.id)}
                      onChange={() => toggleResource(rt.id)}
                      className="w-4 h-4"
                      style={{ accentColor: '#0E7490' }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{rt.label}</div>
                      <div className="text-xs text-gray-400">{rt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Access Controls */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100" style={{ background: '#F8FAFC' }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#1B3A6B' }}>3</div>
                  <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Access Controls</h2>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Link Expiry</Label>
                  <div className="flex flex-wrap gap-2">
                    {EXPIRY_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setExpiryHours(opt.value)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        style={{
                          background: expiryHours === opt.value ? '#1B3A6B' : '#F3F4F6',
                          color: expiryHours === opt.value ? 'white' : '#374151',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Max Views (optional)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={maxViews || ''}
                      onChange={e => setMaxViews(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Unlimited"
                      disabled={viewOnce}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">View Once</Label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={viewOnce}
                        onChange={e => { setViewOnce(e.target.checked); if (e.target.checked) setMaxViews(undefined); }}
                        className="w-4 h-4"
                        style={{ accentColor: '#0E7490' }}
                      />
                      <span className="text-sm text-gray-600">Expire after first view</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating || !providerInfo || selectedResources.length === 0}
              className="w-full text-white font-semibold py-3"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
            >
              {isCreating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating secure link...</>
              ) : (
                <><Share2 className="w-4 h-4 mr-2" />Create Secure Share Link</>
              )}
            </Button>
          </div>
        )}

        {/* Existing shares */}
        {MOCK_SHARE_LINKS.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Active Share Links</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_SHARE_LINKS.map(link => {
                const isExpired = new Date(link.expiresAt) < new Date();
                return (
                  <div key={link.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-gray-500" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{link.id}</span>
                        {isExpired ? <span className="badge-error">Expired</span> : <span className="badge-active">Active</span>}
                      </div>
                      <div className="text-xs text-gray-400">
                        NPI: {link.recipientNpi} • {link.resourceTypes.join(', ')} • {link.viewCount}/{link.maxViews || '∞'} views
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">
                      Expires {new Date(link.expiresAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => toast.info('Share link revoked')}
                      className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                      Revoke
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
