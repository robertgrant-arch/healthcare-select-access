// Healthcare Select Access — Shared Types
// Design: Secure Clarity | Federal Blue + Medical Teal palette

export type AccountStatus =
  | 'PENDING_EMAIL_VERIFICATION'
  | 'PENDING_IDENTITY_VERIFICATION'
  | 'PENDING_MFA_ENROLLMENT'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'LOCKED';

export type UserRole = 'BENEFICIARY' | 'PROVIDER' | 'ADMIN';

export type BB2ConnectionStatus = 'NOT_CONNECTED' | 'CONNECTED' | 'EXPIRED' | 'REVOKED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: AccountStatus;
  mbiLast4?: string;
  bb2Status: BB2ConnectionStatus;
  mfaEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface AuditLogEntry {
  id: string;
  eventType: AuditEventType;
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  resourceType?: string;
  resourceId?: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  details: Record<string, unknown>;
  chainHash: string;
  prevHash: string;
  createdAt: string;
}

export type AuditEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'AUTH_REGISTER'
  | 'AUTH_EMAIL_VERIFY'
  | 'AUTH_MFA_ENROLL'
  | 'AUTH_MFA_VERIFY'
  | 'AUTH_MFA_FAILURE'
  | 'AUTH_PASSWORD_CHANGE'
  | 'AUTH_PASSWORD_RESET'
  | 'TOKEN_ISSUED'
  | 'TOKEN_REFRESHED'
  | 'TOKEN_REVOKED'
  | 'TOKEN_INTROSPECT'
  | 'IDENTITY_VERIFY_START'
  | 'IDENTITY_VERIFY_SUCCESS'
  | 'IDENTITY_VERIFY_FAILURE'
  | 'BB2_CONNECT_INIT'
  | 'BB2_CONNECT_SUCCESS'
  | 'BB2_CONNECT_FAILURE'
  | 'BB2_DISCONNECT'
  | 'BB2_TOKEN_REFRESH'
  | 'FHIR_READ'
  | 'FHIR_SEARCH'
  | 'PHI_ACCESS'
  | 'PHI_EXPORT'
  | 'PHI_DOWNLOAD'
  | 'SHARE_CREATE'
  | 'SHARE_ACCESS'
  | 'SHARE_REVOKE'
  | 'SHARE_EXPIRE'
  | 'ADMIN_USER_VIEW'
  | 'ADMIN_USER_SUSPEND'
  | 'ADMIN_USER_ACTIVATE'
  | 'ADMIN_AUDIT_VIEW'
  | 'SECURITY_IP_MISMATCH'
  | 'SECURITY_UA_MISMATCH'
  | 'SECURITY_RATE_LIMIT'
  | 'SECURITY_SUSPICIOUS'
  | 'CONSENT_UPDATE'
  | 'DATA_DELETE_REQUEST'
  | 'PROVIDER_VERIFY'
  | 'OIDC_AUTHORIZE'
  | 'OIDC_TOKEN_EXCHANGE'
  | 'KEY_ROTATION';

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    lastUpdated?: string;
    versionId?: string;
  };
}

export interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient';
  name?: Array<{ family?: string; given?: string[] }>;
  birthDate?: string;
  gender?: string;
  identifier?: Array<{ system?: string; value?: string }>;
}

export interface FHIRExplanationOfBenefit extends FHIRResource {
  resourceType: 'ExplanationOfBenefit';
  status: string;
  type?: { coding?: Array<{ system?: string; code?: string; display?: string }> };
  patient?: { reference?: string };
  billablePeriod?: { start?: string; end?: string };
  created?: string;
  provider?: { reference?: string };
  payment?: { amount?: { value?: number; currency?: string } };
  diagnosis?: Array<{
    sequence: number;
    diagnosisCodeableConcept?: { coding?: Array<{ code?: string; display?: string }> };
  }>;
  item?: Array<{
    sequence: number;
    productOrService?: { coding?: Array<{ code?: string; display?: string }> };
    servicedDate?: string;
    adjudication?: Array<{ category?: { coding?: Array<{ code?: string }> }; amount?: { value?: number } }>;
  }>;
}

export interface FHIRCoverage extends FHIRResource {
  resourceType: 'Coverage';
  status: string;
  type?: { coding?: Array<{ code?: string; display?: string }> };
  beneficiary?: { reference?: string };
  period?: { start?: string; end?: string };
  payor?: Array<{ display?: string }>;
  class?: Array<{ type?: { coding?: Array<{ code?: string }> }; value?: string; name?: string }>;
}

export interface ShareLink {
  id: string;
  token: string;
  createdBy: string;
  recipientEmail?: string;
  recipientNpi?: string;
  resourceTypes: string[];
  expiresAt: string;
  viewCount: number;
  maxViews?: number;
  viewOnce: boolean;
  isRevoked: boolean;
  createdAt: string;
}

export interface OIDCClient {
  clientId: string;
  clientName: string;
  redirectUris: string[];
  scopes: string[];
  createdAt: string;
}

export interface ProviderVerification {
  npi: string;
  firstName: string;
  lastName: string;
  credential?: string;
  specialty?: string;
  organizationName?: string;
  address?: string;
  verifiedAt: string;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  feedback: { warning?: string; suggestions: string[] };
  crackTime: string;
}

export interface TOTPSetup {
  secret: string;
  uri: string;
  qrDataUrl: string;
  backupCodes: string[];
}

export interface BB2AuthState {
  state: string;
  codeVerifier: string;
  redirectUri: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'BB2_DATA_ACCESS' | 'PROVIDER_SHARE' | 'ANALYTICS' | 'MARKETING';
  granted: boolean;
  grantedAt?: string;
  revokedAt?: string;
  version: string;
}

export interface ExportRecord {
  id: string;
  userId: string;
  format: 'FHIR_JSON' | 'PDF';
  resourceTypes: string[];
  status: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DashboardStats {
  totalClaims: number;
  totalCoverage: number;
  lastSyncAt?: string;
  bb2Status: BB2ConnectionStatus;
  activeSessions: number;
  pendingShares: number;
  recentActivity: AuditLogEntry[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
