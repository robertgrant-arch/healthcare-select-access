// Healthcare Select Access — Share View Page (Provider Access)
// Design: Secure Clarity | Provider view of shared records

import { useState } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Shield, FileText, Eye, Clock, CheckCircle, AlertCircle,
  Download, User, Lock, ExternalLink
} from 'lucide-react';
import { MOCK_EOBS, MOCK_PATIENT } from '@/lib/mock-data';

export default function ShareView() {
  const { shareId } = useParams<{ shareId: string }>();
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [providerName, setProviderName] = useState('');
  const [providerNpi, setProviderNpi] = useState('');

  // Mock share metadata
  const shareData = {
    id: shareId,
    patientName: `${MOCK_PATIENT.name?.[0]?.given?.[0]} ${MOCK_PATIENT.name?.[0]?.family}`,
    resourceTypes: ['ExplanationOfBenefit'],
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    viewsRemaining: 2,
    maxViews: 3,
    createdAt: new Date().toISOString(),
  };

  const isExpired = new Date(shareData.expiresAt) < new Date();

  const handleAccept = async () => {
    if (!providerName || !providerNpi) {
      toast.error('Please enter your name and NPI to access these records');
      return;
    }
    setIsAccepting(true);
    await new Promise(r => setTimeout(r, 1000));
    setAccepted(true);
    setIsAccepting(false);
    toast.success('Access granted. This access has been logged.');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif', color: '#1B3A6B' }}>Healthcare Select Access</div>
              <div className="text-xs text-gray-400">Secure Record Share</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Encrypted • Audited</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Share info card */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #EFF6FF, #E0F2FE)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Shared Medical Records
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Patient: <strong>{shareData.patientName}</strong>
                </p>
              </div>
              {isExpired ? (
                <span className="badge-error">Expired</span>
              ) : (
                <span className="badge-active">Valid</span>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Shared Resources</div>
                <div className="text-sm font-semibold text-gray-800">{shareData.resourceTypes.join(', ')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Views Remaining</div>
                <div className="text-sm font-semibold text-gray-800">{shareData.viewsRemaining}/{shareData.maxViews}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Expires</div>
                <div className="text-sm font-semibold text-gray-800">
                  {new Date(shareData.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412' }}>
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Notice:</strong> This link contains Protected Health Information (PHI). By accessing these records, you confirm you are an authorized healthcare provider with a legitimate treatment relationship with this patient. All access is logged and audited.
              </span>
            </div>
          </div>
        </div>

        {isExpired ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-lg font-semibold text-gray-700" style={{ fontFamily: 'Sora, sans-serif' }}>Share Link Expired</div>
            <div className="text-sm text-gray-500 mt-1">This share link has expired. Please request a new link from the patient.</div>
          </div>
        ) : !accepted ? (
          /* Provider verification */
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Provider Verification Required</h2>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Please confirm your identity as a licensed healthcare provider before accessing these records.
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Your Full Name</label>
                  <input
                    type="text"
                    value={providerName}
                    onChange={e => setProviderName(e.target.value)}
                    placeholder="Dr. Jane Smith, MD"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Your NPI Number</label>
                  <input
                    type="text"
                    value={providerNpi}
                    onChange={e => setProviderNpi(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-teal-500"
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                    maxLength={10}
                  />
                </div>
              </div>
              <Button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}
              >
                {isAccepting ? 'Verifying...' : 'Access Records'}
              </Button>
            </div>
          </div>
        ) : (
          /* Records view */
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                Access granted for <strong>{providerName}</strong> (NPI: {providerNpi}). This access has been logged.
              </span>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Explanation of Benefits</h2>
                <Button variant="outline" size="sm" onClick={() => toast.success('Export started')}>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export FHIR
                </Button>
              </div>
              <div className="divide-y divide-gray-50">
                {MOCK_EOBS.slice(0, 3).map(eob => (
                  <div key={eob.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                        <FileText className="w-4 h-4" style={{ color: '#1B3A6B' }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {eob.type?.coding?.[0]?.display} Claim
                        </div>
                        <div className="text-xs text-gray-400">
                          {eob.diagnosis?.[0]?.diagnosisCodeableConcept?.coding?.[0]?.display?.slice(0, 50)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-800">
                        ${eob.payment?.amount?.value?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {eob.billablePeriod?.start ? new Date(eob.billablePeriod.start).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>Share ID: <span className="font-mono" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{shareId}</span></p>
          <p>Powered by Healthcare Select Access • HIPAA Compliant • All access logged</p>
        </div>
      </div>
    </div>
  );
}
