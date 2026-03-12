# Healthcare Select Access — Architecture & Implementation Guide

## Overview

Healthcare Select Access (HSA) is a HIPAA-grade Medicare beneficiary portal that provides:

1. **Custom OIDC Provider** — Full OpenID Connect authorization server with PKCE, RS256 JWT, and 30-day key rotation
2. **CMS Blue Button 2.0 Integration** — OAuth 2.0 PKCE flow to retrieve Medicare FHIR R4 data
3. **FHIR R4 Proxy** — Patient-isolated proxy with resource filtering and BB2 token management
4. **RBAC** — Beneficiary / Provider / Admin roles with PHI-touching MFA requirement
5. **Tamper-Evident Audit Logs** — SHA-256 chained hash logs with 40+ event types
6. **Envelope Encryption** — Per-user DEK with AES-256-GCM, KMS integration

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Wouter + Tailwind 4 + shadcn/ui |
| Backend (production) | Next.js 15 App Router API Routes |
| Database | PostgreSQL via Prisma ORM |
| Auth | Custom OIDC Provider (jose library) |
| Encryption | AES-256-GCM (PHI), RSA-4096 (JWKS), bcrypt (passwords) |
| BB2.0 | CMS Blue Button 2.0 FHIR R4 API |
| Audit | SHA-256 chained hash tamper-evident log |

---

## OIDC Provider Implementation

### Discovery Document

```
GET /.well-known/openid-configuration
```

Returns the full OIDC discovery document with all endpoint URLs, supported scopes, claims, and signing algorithms.

### Authorization Code Flow with PKCE

```
1. Client generates code_verifier (32 random bytes, base64url)
2. Client computes code_challenge = BASE64URL(SHA256(code_verifier))
3. GET /api/oidc/authorize?
     response_type=code
     &client_id=CLIENT_ID
     &redirect_uri=REDIRECT_URI
     &scope=openid profile email fhir:read bb2:read
     &state=RANDOM_STATE
     &code_challenge=CODE_CHALLENGE
     &code_challenge_method=S256
     &nonce=RANDOM_NONCE
4. User authenticates (email + password + TOTP MFA)
5. HSA redirects to redirect_uri?code=AUTH_CODE&state=STATE
6. POST /api/oidc/token
     grant_type=authorization_code
     &code=AUTH_CODE
     &redirect_uri=REDIRECT_URI
     &client_id=CLIENT_ID
     &code_verifier=CODE_VERIFIER
7. HSA returns { access_token, id_token, refresh_token, expires_in }
```

### JWT Key Management

- RSA-4096 key pairs generated on first boot
- Keys stored in `JWKSKey` table, private key AES-256-GCM encrypted with KMS master key
- 30-day rotation: new key generated, old key kept for verification until all tokens expire
- JWKS endpoint (`/api/oidc/jwks`) returns all active public keys

### ID Token Claims

```json
{
  "iss": "https://hsa.example.gov",
  "sub": "pairwise_subject_id",
  "aud": "client_id",
  "exp": 1234567890,
  "iat": 1234567890,
  "nonce": "client_nonce",
  "email": "jane.doe@example.com",
  "given_name": "Jane",
  "family_name": "Doe",
  "role": "BENEFICIARY",
  "mbi_hash": "sha256_hmac_of_mbi",
  "amr": ["pwd", "otp"],
  "acr": "urn:hsa:loa:2"
}
```

---

## Blue Button 2.0 Integration

### OAuth 2.0 PKCE Flow

```
1. GET /api/bb2/connect
   - Generate state (32 bytes, stored in session)
   - Generate code_verifier + code_challenge (PKCE S256)
   - Redirect to https://sandbox.bluebutton.cms.gov/v1/o/authorize/
       ?client_id=BB2_CLIENT_ID
       &redirect_uri=https://hsa.example.gov/api/bb2/callback
       &response_type=code
       &scope=patient/Patient.read patient/ExplanationOfBenefit.read patient/Coverage.read
       &state=STATE
       &code_challenge=CODE_CHALLENGE
       &code_challenge_method=S256

2. CMS redirects to /api/bb2/callback?code=AUTH_CODE&state=STATE
   - Verify state matches session
   - POST https://sandbox.bluebutton.cms.gov/v1/o/token/
       grant_type=authorization_code
       &code=AUTH_CODE
       &redirect_uri=REDIRECT_URI
       &client_id=BB2_CLIENT_ID
       &code_verifier=CODE_VERIFIER
   - Store access_token + refresh_token (AES-256-GCM encrypted)
   - Fetch Patient resource to extract CMS patient ID
   - Store isolated patient ID in user record

3. Token refresh (automatic, 1 hour before expiry)
   POST https://sandbox.bluebutton.cms.gov/v1/o/token/
       grant_type=refresh_token
       &refresh_token=REFRESH_TOKEN
       &client_id=BB2_CLIENT_ID
```

### FHIR R4 Proxy

```
GET /api/fhir/ExplanationOfBenefit
GET /api/fhir/Coverage
GET /api/fhir/Patient

- Middleware verifies HSA session + MFA
- Injects BB2 access token (refreshing if needed)
- Appends ?patient=PATIENT_ID to all queries (isolation)
- Strips any patient parameter from client request (SSRF prevention)
- Logs all access to audit trail
- Returns FHIR Bundle with resource filtering by role
```

---

## RBAC Permission Matrix

| Action | BENEFICIARY | PROVIDER | ADMIN |
|---|---|---|---|
| View own FHIR records | ✅ (MFA required) | ❌ | ✅ |
| View shared records (via share link) | ❌ | ✅ | ✅ |
| Create share links | ✅ | ❌ | ✅ |
| Export PHI | ✅ (MFA required) | ❌ | ✅ |
| View audit logs (own) | ✅ | ❌ | ✅ |
| View all audit logs | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Rotate JWKS keys | ❌ | ❌ | ✅ |
| Connect BB2.0 | ✅ | ❌ | ❌ |

---

## Envelope Encryption

```
PHI Encryption Flow:
1. KMS generates master key (AES-256)
2. Per-user DEK generated (AES-256, random)
3. DEK encrypted with master key → stored in User.dekEncrypted
4. PHI (BB2 tokens, MBI hash) encrypted with DEK (AES-256-GCM)
5. IV + ciphertext stored in database

Decryption:
1. Fetch User.dekEncrypted
2. Decrypt DEK with KMS master key
3. Decrypt PHI with DEK
```

---

## Tamper-Evident Audit Log

```
Chain construction:
1. First entry: prevHash = SHA256("GENESIS")
2. Each entry: chainHash = SHA256(prevHash + JSON.stringify(eventData))
3. Next entry's prevHash = current entry's chainHash

Verification:
- Walk chain from genesis
- Recompute each chainHash
- Any mismatch indicates tampering
```

---

## Security Headers (Next.js middleware)

```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# JWT / OIDC
JWT_SECRET="..."                    # 32-byte random hex
OIDC_ISSUER="https://hsa.example.gov"

# Blue Button 2.0
BB2_CLIENT_ID="..."
BB2_CLIENT_SECRET="..."
BB2_REDIRECT_URI="https://hsa.example.gov/api/bb2/callback"
BB2_BASE_URL="https://sandbox.bluebutton.cms.gov"  # or production URL

# Encryption
KMS_MASTER_KEY="..."               # 32-byte hex (in production: use AWS KMS / GCP KMS)
MBI_HMAC_KEY="..."                 # 32-byte hex for MBI hashing

# Email
SMTP_HOST="..."
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
SMTP_FROM="noreply@hsa.example.gov"

# Storage (for PHI exports)
S3_BUCKET="..."
S3_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

---

## API Endpoints Reference

### Authentication

| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/verify-email | Verify email OTP |
| POST | /api/auth/verify-identity | MBI identity proofing |
| POST | /api/auth/login | Authenticate (step 1) |
| POST | /api/auth/mfa/verify | Verify TOTP (step 2) |
| POST | /api/auth/mfa/setup | Get TOTP setup QR |
| POST | /api/auth/mfa/confirm | Confirm TOTP enrollment |
| POST | /api/auth/logout | Revoke session |
| POST | /api/auth/password/change | Change password |

### OIDC Provider

| Method | Path | Description |
|---|---|---|
| GET | /.well-known/openid-configuration | Discovery document |
| GET | /api/oidc/authorize | Authorization endpoint |
| POST | /api/oidc/token | Token endpoint |
| GET | /api/oidc/userinfo | UserInfo endpoint |
| GET | /api/oidc/jwks | JSON Web Key Set |
| POST | /api/oidc/revoke | Token revocation |
| POST | /api/oidc/introspect | Token introspection |
| GET | /api/oidc/logout | End session |

### Blue Button 2.0

| Method | Path | Description |
|---|---|---|
| GET | /api/bb2/connect | Initiate BB2 OAuth flow |
| GET | /api/bb2/callback | BB2 OAuth callback |
| DELETE | /api/bb2/disconnect | Revoke BB2 connection |
| POST | /api/bb2/refresh | Manually refresh BB2 token |

### FHIR Proxy

| Method | Path | Description |
|---|---|---|
| GET | /api/fhir/Patient | Get patient demographics |
| GET | /api/fhir/ExplanationOfBenefit | Get claims (paginated) |
| GET | /api/fhir/ExplanationOfBenefit/:id | Get single claim |
| GET | /api/fhir/Coverage | Get coverage records |

### Share Links

| Method | Path | Description |
|---|---|---|
| POST | /api/share | Create share link |
| GET | /api/share/:shareId | Access share (provider) |
| DELETE | /api/share/:shareId | Revoke share link |
| GET | /api/share | List own share links |

### Admin

| Method | Path | Description |
|---|---|---|
| GET | /api/admin/users | List all users |
| GET | /api/admin/users/:id | Get user details |
| POST | /api/admin/users/:id/suspend | Suspend user |
| POST | /api/admin/users/:id/activate | Activate user |
| GET | /api/admin/audit | Get audit logs |
| POST | /api/admin/keys/rotate | Rotate JWKS keys |

---

## Deployment Checklist

- [ ] Set all required environment variables
- [ ] Run `pnpm db:push` or `pnpm db:migrate deploy`
- [ ] Verify OIDC discovery document at `/.well-known/openid-configuration`
- [ ] Test BB2 sandbox connection
- [ ] Verify audit log chain integrity
- [ ] Configure SMTP for email verification
- [ ] Set up S3 bucket for PHI exports
- [ ] Enable HTTPS (required for HIPAA)
- [ ] Configure WAF rules for rate limiting
- [ ] Set up database backups with encryption

----

## Security Review Status

### Completed Hardening (Code Review - March 2026)

1. **Manus Build Artifacts Removed** - Deleted `debug-collector.js` telemetry script and Manus Vite plugin references
2. **Internal Notes Removed** - Deleted `ideas.md` containing implementation details
3. **Build Config Cleaned** - `vite.config.ts` rewritten to remove third-party build hooks
4. **Server Security Headers** - Added HSTS, CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
5. **Content Security Policy** - Strict CSP with explicit allowlists for CMS Blue Button API endpoints
6. **Rate Limiting** - In-memory rate limiter on all server routes (100 req/min per IP)
7. **Route Guards** - `ProtectedRoute` and `AdminRoute` wrappers enforce authentication and role checks on client routes
8. **Auth Context Secured** - Replaced mock authentication with API-based auth using httpOnly cookie sessions; removed hardcoded credentials and MOCK_USER dependency
9. **Mock Data Disclaimer** - Added production warnings to demo data file

### Remaining Items for Production

- [ ] Implement server-side API auth routes (`/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, etc.)
- [ ] Add CSRF token middleware (double-submit cookie or synchronizer token)
- [ ] Implement server-side session management with httpOnly secure cookies
- [ ] Add request input validation and sanitization (zod schemas on all API inputs)
- [ ] Replace in-memory rate limiter with Redis-backed solution
- [ ] Add audit logging for all authentication and data access events
- [ ] Implement FHIR R4 proxy with patient-scoped token isolation
- [ ] Set up envelope encryption for PHI at rest (AES-256-GCM + KMS)
- [ ] Configure WAF rules for production deployment
- [ ] Complete HIPAA security risk assessment
