// Healthcare Select Access — Record Detail Page
// Design: Secure Clarity | Full FHIR EOB display

import { useParams, Link } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  FileText, Download, Share2, Calendar, DollarSign,
  Tag, User, Building, AlertCircle, ChevronRight, Shield, Copy
} from 'lucide-react';
import { MOCK_EOBS } from '@/lib/mock-data';

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const eob = MOCK_EOBS.find(e => e.id === id);

  if (!eob) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Records', href: '/records' }, { label: 'Not Found' }]}>
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-500">Record not found</div>
          <Link href="/records">
            <Button variant="outline" size="sm" className="mt-3">Back to Records</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const claimType = eob.type?.coding?.[0]?.display || 'Unknown';
  const amount = eob.payment?.amount?.value;
  const date = eob.billablePeriod?.start;

  const handleCopyId = () => {
    navigator.clipboard.writeText(eob.id);
    toast.success('Claim ID copied');
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting claim as ${format}...`);
  };

  const handleShare = () => {
    window.location.href = `/share/create?recordId=${eob.id}`;
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Records', href: '/records' },
        { label: `Claim ${eob.id}` },
      ]}
    >
      <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: claimType === 'Professional' ? '#EFF6FF' : claimType === 'Pharmacy' ? '#F0FDF4' : '#FFF7ED',
                  color: claimType === 'Professional' ? '#1D4ED8' : claimType === 'Pharmacy' ? '#166534' : '#9A3412',
                }}
              >
                {claimType}
              </span>
              <span className="badge-active">Active</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              {eob.diagnosis?.[0]?.diagnosisCodeableConcept?.coding?.[0]?.display || 'Medical Claim'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-gray-400" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{eob.id}</span>
              <button onClick={handleCopyId} className="text-gray-300 hover:text-gray-500">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('FHIR JSON')} className="text-sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
            <Button size="sm" onClick={handleShare} className="text-sm text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>

        {/* PHI Notice */}
        <div className="phi-warning text-xs">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>This record contains Protected Health Information (PHI). Access has been logged in the audit trail.</span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Amount Billed', value: amount !== undefined ? `$${amount.toFixed(2)}` : '—', icon: DollarSign, color: '#1B3A6B' },
            { label: 'Service Date', value: date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—', icon: Calendar, color: '#0E7490' },
            { label: 'Claim Type', value: claimType, icon: Tag, color: '#7C3AED' },
            { label: 'Status', value: eob.status.charAt(0).toUpperCase() + eob.status.slice(1), icon: FileText, color: '#22C55E' },
          ].map(card => (
            <div key={card.label} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
                <span className="text-xs text-gray-500">{card.label}</span>
              </div>
              <div className="text-sm font-semibold text-gray-800">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Diagnoses */}
        {eob.diagnosis && eob.diagnosis.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Diagnoses</h2>
            </div>
            <div className="p-5 space-y-3">
              {eob.diagnosis.map(diag => (
                <div key={diag.sequence} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: '#1B3A6B' }}>
                    {diag.sequence}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {diag.diagnosisCodeableConcept?.coding?.[0]?.display || 'Unknown diagnosis'}
                    </div>
                    <div className="text-xs font-mono text-gray-400 mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                      ICD-10: {diag.diagnosisCodeableConcept?.coding?.[0]?.code || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Line Items */}
        {eob.item && eob.item.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Service Line Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service / Product</th>
                    <th>Code</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {eob.item.map(item => {
                    const service = item.productOrService?.coding?.[0];
                    const submitted = item.adjudication?.find(a => a.category?.coding?.[0]?.code === 'submitted');
                    const allowed = item.adjudication?.find(a => a.category?.coding?.[0]?.code === 'allowed');
                    return (
                      <tr key={item.sequence}>
                        <td className="text-gray-400 font-mono text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{item.sequence}</td>
                        <td>
                          <div className="text-sm text-gray-800">{service?.display || '—'}</div>
                        </td>
                        <td>
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#F3F4F6', fontFamily: 'IBM Plex Mono, monospace' }}>
                            {service?.code || '—'}
                          </span>
                        </td>
                        <td className="text-sm text-gray-600">
                          {item.servicedDate ? new Date(item.servicedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td className="text-right">
                          <div className="text-sm font-semibold text-gray-800">
                            {submitted?.amount?.value !== undefined ? `$${submitted.amount.value.toFixed(2)}` : '—'}
                          </div>
                          {allowed?.amount?.value !== undefined && (
                            <div className="text-xs text-gray-400">
                              Allowed: ${allowed.amount.value.toFixed(2)}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FHIR Raw Data */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => toast.info('Raw FHIR JSON view available in production with full API access')}
          >
            <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Raw FHIR R4 JSON</h2>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <div className="p-4">
            <pre className="text-xs overflow-x-auto rounded-lg p-3" style={{ background: '#0F2D5C', color: '#E2E8F0', fontFamily: 'IBM Plex Mono, monospace', maxHeight: '200px' }}>
              {JSON.stringify({ resourceType: eob.resourceType, id: eob.id, status: eob.status, type: eob.type }, null, 2)}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button variant="outline" onClick={() => handleExport('FHIR JSON')} className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Download FHIR JSON
          </Button>
          <Button variant="outline" onClick={() => handleExport('PDF')} className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleShare} className="flex-1 sm:flex-none text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
            <Share2 className="w-4 h-4 mr-2" />
            Share with Provider
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
