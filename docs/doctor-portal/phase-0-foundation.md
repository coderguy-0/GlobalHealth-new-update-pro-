# GlobalHealth Doctor Portal — Phase 0 Foundation

Phase 0 establishes the architecture every later portal feature builds on.
No advanced clinical module is considered "done" until it uses this
foundation.

## 1. Roles

- `DOCTOR`
- `PATIENT`
- `HOSPITAL`
- `PHARMACY_PARTNER`
- `LABORATORY`
- `IMAGING_PROVIDER`
- `ADMIN`

Roles are defined in `src/core/portalRoles.ts`. Access is never granted by
page name; components ask the permission engine whether the active role is
allowed to perform an action.

## 2. Permissions

Permissions are namespaced by domain, for example:

- `doctor.patient.read`
- `doctor.patient.consent_request`
- `doctor.ehr.read`
- `doctor.consultation.create`
- `doctor.prescription.sign`
- `doctor.lab.order`
- `doctor.imaging.review`
- `doctor.referral.create`
- `doctor.audit.read`

The `PermissionGate` component (`src/components/portal/PermissionGate.tsx`)
is the single reusable gate. The Doctor Portal shell wraps each module in a
permission check, so a future role or permission change requires only the
catalog change.

## 3. Core identifiers

`src/core/portalIdentifiers.ts` defines the stable entity prefixes:

| Entity | Prefix |
| --- | --- |
| Patient | `PAT-...` |
| Appointment | `APT-...` |
| Consultation | `CON-...` |
| Prescription | `RX-...` |
| Lab order / result | `LAB-...` / `LABR-...` |
| Imaging order / result | `IMG-...` / `IMGR-...` |
| Referral | `REF-...` |
| Consent request | `CS-...` |
| Document | `DOC-...` |
| Notification | `NTF-...` |
| Audit event | `AUD-...` |

Client-side ids are optimistic only; the backend is authoritative.

## 4. Audit infrastructure

`src/core/audit.ts` defines the audit event shape and helper. Doctor portal
clinical actions write audit events:

- patient record / consent decisions
- prescription create / sign / send-to-pharmacy
- lab order / review
- imaging order / review
- consultation creation / completion
- billing changes

The portal audit view reads from the same list.

## 5. Design system foundation

Reusable primitives already present in `src/components/ui`:

- `Button`
- `Skeleton` / `CardSkeleton` / `SearchSkeleton`
- `EmptyState` / `ErrorState`
- `SectionHeading`
- `Reveal`

Doctor portal clinical surfaces follow the GlobalHealth clinical visual
language (navy `#0B1F3A`, blue `#1769E0`, teal `#0E9F9A`, background
`#F7F9FC`, border `#E3E8EF`).

## 6. Phase status

- [x] Authentication / role detection gate
- [x] Role + permission catalog
- [x] Permission gate (`PermissionGate`)
- [x] Core identifier prefixes
- [x] Audit event model
- [x] Doctor Portal shell (sidebar + top nav + breadcrumb + profile mini card)
- [x] Empty / error / loading states available in the UI kit
- [ ] Backend permission synchronization
- [ ] Real persistence for identifiers, audit and clinical data
- [ ] Admin verification review workflow
- [ ] Full reusable input/table/modal/date UI kit (extend `src/components/ui`)

Recommended next phase: **Phase 1 — authentication, doctor registration and
verification** (central GlobalHealth login + role detection + admin review).
