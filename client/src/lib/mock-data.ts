// WARNING: This file contains DEMO-ONLY mock data for UI development.
// DO NOT use in production. All identifiers are fictional.
// In production, all data must come from authenticated API endpoints.
//
// Healthcare Select Access — Mock Data
// Simulates API responses for the frontend demo

import type {
  User, AuditLogEntry, FHIRExplanationOfBenefit, FHIRCoverage,
  FHIRPatient, ShareLink, DashboardStats, Session, ConsentRecord, ExportRecord
} from './types';

export const MOCK_USER: User = {
  id: 'usr_01HXYZ1234567890',
  email: 'jane.doe@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'BENEFICIARY',
  status: 'ACTIVE',
  mbiLast4: '7A94',
  bb2Status: 'CONNECTED',
  mfaEnabled: true,
  createdAt: '2024-01-15T10:30:00Z',
  lastLoginAt: '2026-03-10T14:22:00Z',
};

export const MOCK_ADMIN_USER: User = {
  id: 'usr_admin_01',
  email: 'admin@hsa.gov',
  firstName: 'System',
  lastName: 'Administrator',
  role: 'ADMIN',
  status: 'ACTIVE',
  bb2Status: 'NOT_CONNECTED',
  mfaEnabled: true,
  createdAt: '2023-06-01T00:00:00Z',
  lastLoginAt: '2026-03-10T09:00:00Z',
};

export const MOCK_PATIENT: FHIRPatient = {
  resourceType: 'Patient',
  id: 'pat_01HXYZ1234567890',
  name: [{ family: 'Doe', given: ['Jane', 'Marie'] }],
  birthDate: '1952-03-15',
  gender: 'female',
  identifier: [
    { system: 'http://hl7.org/fhir/sid/us-mbi', value: '1EG4-TE5-MK72' },
    { system: 'http://hl7.org/fhir/sid/us-medicare-hicn', value: '1EG4TE5MK72' },
  ],
};

export const MOCK_EOBS: FHIRExplanationOfBenefit[] = [
  {
    resourceType: 'ExplanationOfBenefit',
    id: 'eob_001',
    status: 'active',
    type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'professional', display: 'Professional' }] },
    patient: { reference: 'Patient/pat_01HXYZ1234567890' },
    billablePeriod: { start: '2026-01-15', end: '2026-01-15' },
    created: '2026-01-20T00:00:00Z',
    provider: { reference: 'Organization/prov_001' },
    payment: { amount: { value: 245.50, currency: 'USD' } },
    diagnosis: [
      { sequence: 1, diagnosisCodeableConcept: { coding: [{ code: 'Z00.00', display: 'Encounter for general adult medical examination without abnormal findings' }] } },
    ],
    item: [
      { sequence: 1, productOrService: { coding: [{ code: '99213', display: 'Office or other outpatient visit, established patient' }] }, servicedDate: '2026-01-15', adjudication: [{ category: { coding: [{ code: 'submitted' }] }, amount: { value: 245.50 } }, { category: { coding: [{ code: 'allowed' }] }, amount: { value: 180.00 } }] },
    ],
  },
  {
    resourceType: 'ExplanationOfBenefit',
    id: 'eob_002',
    status: 'active',
    type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'pharmacy', display: 'Pharmacy' }] },
    patient: { reference: 'Patient/pat_01HXYZ1234567890' },
    billablePeriod: { start: '2026-02-03', end: '2026-02-03' },
    created: '2026-02-05T00:00:00Z',
    provider: { reference: 'Organization/prov_002' },
    payment: { amount: { value: 42.80, currency: 'USD' } },
    diagnosis: [
      { sequence: 1, diagnosisCodeableConcept: { coding: [{ code: 'I10', display: 'Essential (primary) hypertension' }] } },
    ],
    item: [
      { sequence: 1, productOrService: { coding: [{ code: '00093-7194-01', display: 'Lisinopril 10mg Tablet' }] }, servicedDate: '2026-02-03', adjudication: [{ category: { coding: [{ code: 'submitted' }] }, amount: { value: 42.80 } }] },
    ],
  },
  {
    resourceType: 'ExplanationOfBenefit',
    id: 'eob_003',
    status: 'active',
    type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'institutional', display: 'Institutional' }] },
    patient: { reference: 'Patient/pat_01HXYZ1234567890' },
    billablePeriod: { start: '2025-12-10', end: '2025-12-10' },
    created: '2025-12-15T00:00:00Z',
    provider: { reference: 'Organization/prov_003' },
    payment: { amount: { value: 1850.00, currency: 'USD' } },
    diagnosis: [
      { sequence: 1, diagnosisCodeableConcept: { coding: [{ code: 'M54.5', display: 'Low back pain' }] } },
    ],
    item: [
      { sequence: 1, productOrService: { coding: [{ code: '72148', display: 'MRI lumbar spine without contrast' }] }, servicedDate: '2025-12-10', adjudication: [{ category: { coding: [{ code: 'submitted' }] }, amount: { value: 1850.00 } }, { category: { coding: [{ code: 'allowed' }] }, amount: { value: 1200.00 } }] },
    ],
  },
  {
    resourceType: 'ExplanationOfBenefit',
    id: 'eob_004',
    status: 'active',
    type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'professional', display: 'Professional' }] },
    patient: { reference: 'Patient/pat_01HXYZ1234567890' },
    billablePeriod: { start: '2025-11-22', end: '2025-11-22' },
    created: '2025-11-28T00:00:00Z',
    provider: { reference: 'Organization/prov_004' },
    payment: { amount: { value: 320.00, currency: 'USD' } },
    diagnosis: [
      { sequence: 1, diagnosisCodeableConcept: { coding: [{ code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' }] } },
    ],
    item: [
      { sequence: 1, productOrService: { coding: [{ code: '83036', display: 'Hemoglobin A1C' }] }, servicedDate: '2025-11-22', adjudication: [{ category: { coding: [{ code: 'submitted' }] }, amount: { value: 320.00 } }] },
    ],
  },
  {
    resourceType: 'ExplanationOfBenefit',
    id: 'eob_005',
    status: 'active',
    type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/claim-type', code: 'pharmacy', display: 'Pharmacy' }] },
    patient: { reference: 'Patient/pat_01HXYZ1234567890' },
    billablePeriod: { start: '2025-10-15', end: '2025-10-15' },
    created: '2025-10-17T00:00:00Z',
    provider: { reference: 'Organization/prov_002' },
    payment: { amount: { value: 28.50, currency: 'USD' } },
    diagnosis: [
      { sequence: 1, diagnosisCodeableConcept: { coding: [{ code: 'E11.9', display: 'Type 2 diabetes mellitus without complications' }] } },
    ],
    item: [
      { sequence: 1, productOrService: { coding: [{ code: '00169-4060-11', display: 'Metformin HCl 500mg Tablet' }] }, servicedDate: '2025-10-15', adjudication: [{ category: { coding: [{ code: 'submitted' }] }, amount: { value: 28.50 } }] },
    ],
  },
];

export const MOCK_COVERAGE: FHIRCoverage[] = [
  {
    resourceType: 'Coverage',
    id: 'cov_001',
    status: 'active',
    type: { coding: [{ code: 'SUBSIDIZ', display: 'Subsidized' }] },
    beneficiary: { reference: 'Patient/pat_01HXYZ1234567890' },
    period: { start: '2024-01-01', end: '2026-12-31' },
    payor: [{ display: 'Centers for Medicare & Medicaid Services' }],
    class: [
      { type: { coding: [{ code: 'plan' }] }, value: 'Medicare Part A', name: 'Hospital Insurance' },
      { type: { coding: [{ code: 'plan' }] }, value: 'Medicare Part B', name: 'Medical Insurance' },
    ],
  },
  {
    resourceType: 'Coverage',
    id: 'cov_002',
    status: 'active',
    type: { coding: [{ code: 'DRUGPOL', display: 'Drug Policy' }] },
    beneficiary: { reference: 'Patient/pat_01HXYZ1234567890' },
    period: { start: '2024-01-01', end: '2026-12-31' },
    payor: [{ display: 'SilverScript Insurance Company' }],
    class: [
      { type: { coding: [{ code: 'plan' }] }, value: 'Medicare Part D', name: 'Prescription Drug Coverage' },
    ],
  },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_001',
    eventType: 'AUTH_LOGIN_SUCCESS',
    userId: 'usr_01HXYZ1234567890',
    userEmail: 'jane.doe@example.com',
    ipAddress: '192.168.1.100',
    severity: 'INFO',
    details: { method: 'password+totp', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
    chainHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    createdAt: '2026-03-10T14:22:00Z',
  },
  {
    id: 'log_002',
    eventType: 'FHIR_READ',
    userId: 'usr_01HXYZ1234567890',
    userEmail: 'jane.doe@example.com',
    ipAddress: '192.168.1.100',
    resourceType: 'ExplanationOfBenefit',
    resourceId: 'eob_001',
    severity: 'INFO',
    details: { endpoint: '/api/fhir/ExplanationOfBenefit/eob_001' },
    chainHash: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
    prevHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    createdAt: '2026-03-10T14:23:15Z',
  },
  {
    id: 'log_003',
    eventType: 'BB2_TOKEN_REFRESH',
    userId: 'usr_01HXYZ1234567890',
    userEmail: 'jane.doe@example.com',
    ipAddress: '192.168.1.100',
    severity: 'INFO',
    details: { tokenType: 'bb2_access_token', expiresIn: 3600 },
    chainHash: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
    prevHash: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
    createdAt: '2026-03-10T14:24:00Z',
  },
  {
    id: 'log_004',
    eventType: 'SHARE_CREATE',
    userId: 'usr_01HXYZ1234567890',
    userEmail: 'jane.doe@example.com',
    ipAddress: '192.168.1.100',
    severity: 'INFO',
    details: { shareId: 'shr_001', recipientNpi: '1234567890', expiresIn: '24h', resourceTypes: ['ExplanationOfBenefit'] },
    chainHash: 'd4e5f6789012345678901234567890abcdef1234567890abcdef123456789',
    prevHash: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
    createdAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'log_005',
    eventType: 'AUTH_MFA_VERIFY',
    userId: 'usr_01HXYZ1234567890',
    userEmail: 'jane.doe@example.com',
    ipAddress: '192.168.1.100',
    severity: 'INFO',
    details: { method: 'totp', success: true },
    chainHash: 'e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
    prevHash: 'd4e5f6789012345678901234567890abcdef1234567890abcdef123456789',
    createdAt: '2026-03-10T09:15:00Z',
  },
  {
    id: 'log_006',
    eventType: 'AUTH_LOGIN_FAILURE',
    userEmail: 'unknown@example.com',
    ipAddress: '10.0.0.50',
    severity: 'WARNING',
    details: { reason: 'invalid_credentials', attempts: 2 },
    chainHash: 'f6789012345678901234567890abcdef1234567890abcdef12345678901',
    prevHash: 'e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
    createdAt: '2026-03-09T22:45:00Z',
  },
  {
    id: 'log_007',
    eventType: 'PHI_EXPORT',
    userId: 'usr_01HXYZ1234567890',
    userEmail: 'jane.doe@example.com',
    ipAddress: '192.168.1.100',
    severity: 'WARNING',
    details: { format: 'FHIR_JSON', resourceTypes: ['Patient', 'ExplanationOfBenefit', 'Coverage'], recordCount: 7 },
    chainHash: '789012345678901234567890abcdef1234567890abcdef123456789012',
    prevHash: 'f6789012345678901234567890abcdef1234567890abcdef12345678901',
    createdAt: '2026-03-09T16:00:00Z',
  },
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 'sess_001',
    userId: 'usr_01HXYZ1234567890',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0.0.0',
    createdAt: '2026-03-10T14:22:00Z',
    lastActiveAt: '2026-03-10T14:35:00Z',
    expiresAt: '2026-03-10T22:22:00Z',
    isCurrent: true,
  },
  {
    id: 'sess_002',
    userId: 'usr_01HXYZ1234567890',
    ipAddress: '10.20.30.40',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    createdAt: '2026-03-09T10:00:00Z',
    lastActiveAt: '2026-03-09T11:30:00Z',
    expiresAt: '2026-03-09T18:00:00Z',
    isCurrent: false,
  },
];

export const MOCK_SHARE_LINKS: ShareLink[] = [
  {
    id: 'shr_001',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    createdBy: 'usr_01HXYZ1234567890',
    recipientEmail: 'dr.smith@clinic.example.com',
    recipientNpi: '1234567890',
    resourceTypes: ['ExplanationOfBenefit'],
    expiresAt: '2026-03-11T14:30:00Z',
    viewCount: 0,
    maxViews: 3,
    viewOnce: false,
    isRevoked: false,
    createdAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'shr_002',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    createdBy: 'usr_01HXYZ1234567890',
    recipientEmail: 'dr.jones@hospital.example.com',
    recipientNpi: '9876543210',
    resourceTypes: ['Patient', 'Coverage'],
    expiresAt: '2026-03-08T10:00:00Z',
    viewCount: 1,
    maxViews: 1,
    viewOnce: true,
    isRevoked: false,
    createdAt: '2026-03-07T10:00:00Z',
  },
];

export const MOCK_CONSENTS: ConsentRecord[] = [
  {
    id: 'con_001',
    userId: 'usr_01HXYZ1234567890',
    consentType: 'BB2_DATA_ACCESS',
    granted: true,
    grantedAt: '2024-01-15T10:35:00Z',
    version: '2.0',
  },
  {
    id: 'con_002',
    userId: 'usr_01HXYZ1234567890',
    consentType: 'PROVIDER_SHARE',
    granted: true,
    grantedAt: '2024-01-15T10:36:00Z',
    version: '1.0',
  },
  {
    id: 'con_003',
    userId: 'usr_01HXYZ1234567890',
    consentType: 'ANALYTICS',
    granted: false,
    version: '1.0',
  },
  {
    id: 'con_004',
    userId: 'usr_01HXYZ1234567890',
    consentType: 'MARKETING',
    granted: false,
    version: '1.0',
  },
];

export const MOCK_EXPORTS: ExportRecord[] = [
  {
    id: 'exp_001',
    userId: 'usr_01HXYZ1234567890',
    format: 'FHIR_JSON',
    resourceTypes: ['Patient', 'ExplanationOfBenefit', 'Coverage'],
    status: 'COMPLETE',
    downloadUrl: '#',
    expiresAt: '2026-03-11T16:00:00Z',
    createdAt: '2026-03-09T16:00:00Z',
    completedAt: '2026-03-09T16:00:45Z',
  },
  {
    id: 'exp_002',
    userId: 'usr_01HXYZ1234567890',
    format: 'PDF',
    resourceTypes: ['ExplanationOfBenefit'],
    status: 'COMPLETE',
    downloadUrl: '#',
    expiresAt: '2026-03-10T12:00:00Z',
    createdAt: '2026-03-08T12:00:00Z',
    completedAt: '2026-03-08T12:01:10Z',
  },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalClaims: 5,
  totalCoverage: 2,
  lastSyncAt: '2026-03-10T14:24:00Z',
  bb2Status: 'CONNECTED',
  activeSessions: 1,
  pendingShares: 1,
  recentActivity: MOCK_AUDIT_LOGS.slice(0, 5),
};

export const MOCK_ADMIN_USERS: User[] = [
  MOCK_USER,
  {
    id: 'usr_002',
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'BENEFICIARY',
    status: 'PENDING_MFA_ENROLLMENT',
    mbiLast4: '3B21',
    bb2Status: 'NOT_CONNECTED',
    mfaEnabled: false,
    createdAt: '2026-03-08T09:00:00Z',
  },
  {
    id: 'usr_003',
    email: 'dr.provider@clinic.example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'PROVIDER',
    status: 'ACTIVE',
    bb2Status: 'NOT_CONNECTED',
    mfaEnabled: true,
    createdAt: '2025-12-01T00:00:00Z',
    lastLoginAt: '2026-03-05T11:00:00Z',
  },
  {
    id: 'usr_004',
    email: 'mary.williams@example.com',
    firstName: 'Mary',
    lastName: 'Williams',
    role: 'BENEFICIARY',
    status: 'SUSPENDED',
    mbiLast4: '9K55',
    bb2Status: 'REVOKED',
    mfaEnabled: true,
    createdAt: '2025-06-15T00:00:00Z',
    lastLoginAt: '2026-01-20T08:00:00Z',
  },
  MOCK_ADMIN_USER,
];
