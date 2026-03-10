// Healthcare Select Access — Records Page
// Design: Secure Clarity | Filterable claims list with FHIR data

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  FileText, Search, Filter, Download, RefreshCw,
  ChevronRight, Calendar, DollarSign, Tag, Shield
} from 'lucide-react';
import { MOCK_EOBS, MOCK_COVERAGE } from '@/lib/mock-data';
import type { FHIRExplanationOfBenefit } from '@/lib/types';

const CLAIM_TYPES = ['All Types', 'Professional', 'Pharmacy', 'Institutional'];

function ClaimRow({ eob }: { eob: FHIRExplanationOfBenefit }) {
  const claimType = eob.type?.coding?.[0]?.display || 'Unknown';
  const diagnosis = eob.diagnosis?.[0]?.diagnosisCodeableConcept?.coding?.[0];
  const amount = eob.payment?.amount?.value;
  const date = eob.billablePeriod?.start;

  const typeColors: Record<string, { bg: string; text: string }> = {
    Professional: { bg: '#EFF6FF', text: '#1D4ED8' },
    Pharmacy: { bg: '#F0FDF4', text: '#166534' },
    Institutional: { bg: '#FFF7ED', text: '#9A3412' },
  };
  const colors = typeColors[claimType] || { bg: '#F8FAFC', text: '#374151' };

  return (
    <Link href={`/records/${eob.id}`}>
      <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
          <FileText className="w-4 h-4" style={{ color: '#1B3A6B' }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: colors.bg, color: colors.text }}
            >
              {claimType}
            </span>
            <span className="text-xs font-mono text-gray-400" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {eob.id}
            </span>
          </div>
          <div className="text-sm text-gray-700 truncate">
            {diagnosis?.display || 'No diagnosis recorded'}
          </div>
          {diagnosis?.code && (
            <div className="text-xs text-gray-400 font-mono mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              ICD: {diagnosis.code}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
          <Calendar className="w-3.5 h-3.5" />
          {date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-sm font-semibold text-gray-900">
            {amount !== undefined ? `$${amount.toFixed(2)}` : '—'}
          </div>
          <div className="text-xs text-gray-400">billed</div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function Records() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [isExporting, setIsExporting] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_EOBS.filter(eob => {
      const type = eob.type?.coding?.[0]?.display || '';
      const diagnosis = eob.diagnosis?.[0]?.diagnosisCodeableConcept?.coding?.[0]?.display || '';
      const matchesType = selectedType === 'All Types' || type === selectedType;
      const matchesSearch = !search ||
        diagnosis.toLowerCase().includes(search.toLowerCase()) ||
        eob.id.toLowerCase().includes(search.toLowerCase()) ||
        type.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [search, selectedType]);

  const totalBilled = filtered.reduce((sum, eob) => sum + (eob.payment?.amount?.value || 0), 0);

  const handleExport = async (format: 'FHIR_JSON' | 'PDF') => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsExporting(false);
    toast.success(`Export started. Your ${format === 'FHIR_JSON' ? 'FHIR JSON bundle' : 'PDF summary'} will be ready shortly.`);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'My Records' },
      ]}
    >
      <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              My Medicare Records
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {MOCK_EOBS.length} claims • {MOCK_COVERAGE.length} coverage plans • Synced via BB2.0
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('FHIR_JSON')}
              disabled={isExporting}
              className="text-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              FHIR JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
              className="text-sm"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              PDF
            </Button>
            <Link href="/share/create">
              <Button size="sm" className="text-sm text-white" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                Share Records
              </Button>
            </Link>
          </div>
        </div>

        {/* PHI Notice */}
        <div className="phi-warning text-xs">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Protected Health Information:</strong> All records are encrypted at rest with AES-256-GCM. Every access is logged in the tamper-evident audit trail.
          </span>
        </div>

        {/* Coverage Summary */}
        <div className="grid sm:grid-cols-2 gap-3">
          {MOCK_COVERAGE.map(cov => (
            <div key={cov.id} className="p-4 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: '#0E7490' }} />
                  <span className="text-sm font-semibold text-gray-800">{cov.class?.[0]?.value}</span>
                </div>
                <span className="badge-active">Active</span>
              </div>
              <div className="text-xs text-gray-500">{cov.class?.[0]?.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {cov.payor?.[0]?.display} •{' '}
                {cov.period?.start && `Since ${new Date(cov.period.start).getFullYear()}`}
              </div>
            </div>
          ))}
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by diagnosis, claim ID, or type..."
                className="pl-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="flex gap-1">
                {CLAIM_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                    style={{
                      background: selectedType === type ? '#1B3A6B' : '#F3F4F6',
                      color: selectedType === type ? 'white' : '#374151',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary row */}
          <div className="px-5 py-2.5 border-b border-gray-50 flex items-center justify-between text-xs text-gray-500" style={{ background: '#F8FAFC' }}>
            <span>{filtered.length} claim{filtered.length !== 1 ? 's' : ''} shown</span>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Total billed: <strong className="text-gray-700">${totalBilled.toFixed(2)}</strong></span>
            </div>
          </div>

          {/* Claims list */}
          {filtered.length > 0 ? (
            <div>
              {filtered.map(eob => <ClaimRow key={eob.id} eob={eob} />)}
            </div>
          ) : (
            <div className="py-16 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <div className="text-sm text-gray-500">No claims match your search</div>
              <button
                onClick={() => { setSearch(''); setSelectedType('All Types'); }}
                className="text-xs mt-2 hover:underline"
                style={{ color: '#0E7490' }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
