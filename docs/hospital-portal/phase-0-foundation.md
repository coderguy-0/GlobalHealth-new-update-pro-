# Hospital Portal — Phase 0 Foundation

## Purpose

The Hospital Portal is being built as the hospital's complete digital command
center for GlobalHealth. Phase 0 establishes the non-negotiable foundation that
every later module depends on:

1. **Role-based access control** — every view/action is permission-gated, never
   hard-coded into a page.
2. **Identifier contract** — every hospital resource gets a type-prefixed ID.
3. **Immutable audit trail** — sensitive/clinical/financial actions are recorded.
4. **Structured price model** — no billable item uses a hard-coded number.

## Permissions

The shared portal permission catalog (`src/core/portalRoles.ts`) now includes
the `HOSPITAL_OWNER`, `HOSPITAL_ADMINISTRATOR`,
`HOSPITAL_DEPARTMENT_MANAGER`, `HOSPITAL_RECEPTIONIST`, `HOSPITAL_DOCTOR`,
`HOSPITAL_VERIFICATION_MANAGER`, and `HOSPITAL_READ_ONLY` roles and a complete
`hospital.*` permission namespace.

- `src/core/hospitalAccess.ts` maps the Hospital Portal staff roles to those
  portal roles.
- `src/components/hospital-portal/HospitalPortalApp.tsx` wraps the workspace in
  `PortalRoleProvider`, keyed off the authenticated staff role.
- `src/components/hospital-portal/HospitalWorkspace.tsx` renders every view
  behind a `PermissionGate` and removes sidebar items the role cannot access.

## Identifiers

`src/core/hospitalIdentifiers.ts` provides `createHospitalEntityId` for
hospital-level entities (department, staff, price, price history, admission,
bed, ambulance, blood unit, lab test, imaging service, sync job, publication,
incident). Shared clinical entities continue to come from
`src/core/portalIdentifiers.ts`.

## Audit

The shared audit contract (`src/core/audit.ts`) now emits
`HOSPITAL_*` actions. The hospital data store records every mutating action
(profile, staff, doctor, department, service, schedule, appointment, document,
verification, price, publication) into the same immutable audit stream viewed by
`HospitalInsights section="audit"`.

## Structured Pricing

`src/components/hospital-portal/hospitalPortalData.tsx` defines:

- `StructuredPrice` — base price, professional fee, facility fee, consumables,
  equipment fee, tax rate, discount, currency, unit, effective date, optional
  expiry, optional min/max.
- `HospitalPrice` — each billable item with category, availability, public
  status, public visibility, approval metadata.
- `PriceHistory` — old value, new value, changed-by, changed-at, reason and
  approval state. Prices are never silently overwritten.

`src/components/hospital-portal/HospitalPricingCenter.tsx` renders the Pricing
Center with:

- searchable/filterable price table,
- estimated total calculation
  `(base + fees + consumables + equipment) × (1 + tax%) − discount`,
- Draft → Pending Review → Published workflow,
- required change reason before any edit,
- immutable price history tab,
- submit-for-review and publish controls.

## Enforcement rules

- Every protected view uses `PermissionGate` + `AccessDenied`.
- Pricing edits require a reason and create history before mutating the price.
- Published profile and publication statuses are retained; edits move the item
  back to pending review rather than silently changing the published value.

## Follow-on phases

- Phase 1: unified GlobalHealth authentication wiring for the hospital portal
  (remove the portal-local sign-in path from the normal user experience).
- Phase 2: operational command dashboard (status, alerts, KPIs, quick actions).
- Phase 3+: module build-out (admissions, beds, emergency, OPD/IPD/ICU, surgery,
  lab, imaging, pharmacy, blood bank, ambulance, insurance, packages, finance,
  reports, research, education, news, reviews, notifications, settings,
  security, synchronization, public preview).
