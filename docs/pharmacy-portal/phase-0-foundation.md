# Pharmacy Partner Portal — Phase 0 Foundation

## Purpose

The GlobalHealth Verified Pharmacy Partner Portal is being built as a
production-grade pharmacy commerce + operations workspace. Phase 0 establishes
the foundation every later module depends on:

1. **Role-based access control** — tab-level permission gate, never page-hardcoded.
2. **Identifier contract** — pharmacy-specific type-prefixed IDs.
3. **Immutable audit trail** — pharmacy changes recorded in the shared audit stream.
4. **Configurable platform fees** — no hard-coded platform commission/TDS/fees.
5. **Data-driven dashboard** — KPIs derive from live portal records, not literals.

## Permissions

The shared portal catalog (`src/core/portalRoles.ts`) now includes a full
`pharmacy.*` permission namespace and pharmacy staff roles:
`PHARMACY_OWNER`, `PHARMACY_ADMINISTRATOR`, `PHARMACY_PHARMACIST`,
`PHARMACY_MANAGER`, `PHARMACY_INVENTORY_STAFF`, `PHARMACY_ACCOUNTANT`,
`PHARMACY_SUPPORT`, and `PHARMACY_DELIVERY`.

`src/core/pharmacyAccess.ts` maps the portal's staff roles
(Pharmacy Owner, Pharmacist, Inventory Manager, …) onto those portal roles.

`src/components/pharmacy-portal/PharmacyPortalApp.tsx` wraps the authenticated
workspace in `PortalRoleProvider`, filters the sidebar to permitted tabs, and
renders every tab through a `PermissionGate` with an `AccessDenied` fallback.

## Identifiers

`src/core/pharmacyIdentifiers.ts` provides `createPharmacyEntityId` for
pharmacy, branch, staff, document, medicine, batch, inventory, supplier,
purchase order, price, price history, coupon, offer, delivery zone, payout,
sync job, integration and regulatory records. Marketplace orders/invoices use
the cross-portal commerce sequence helper.

## Audit

The shared audit contract (`src/core/audit.ts`) now raises `PHARMACY_*`
actions (profile, verification, medicine, price, fee config, inventory, batch,
order, prescription review, supplier, purchase order, refund, payment, payout,
offer, staff, permission, security, sync). The existing pharmacy store records
staff/price/stock changes through `PharmacyPortalService.logAction`.

## Configurable pricing/fees

`src/types/pharmacyPortal.ts` adds `PharmacyFeeConfiguration`:
platform commission %, payment processing % + fixed fee, delivery fee mode,
standard/express delivery fee, free-delivery threshold, promotional
contribution, subscription fee, GST-TDS %.

`src/services/pharmacyPortalStore.ts` persists one config per pharmacy and
audits every update. `PharmacyFeeConfigurationPanel` (inside the Pricing tab)
lets an authorized partner edit the config and review the business cost
catalog. No universal fee is hard-coded.

## Dashboard

`DashboardHomeTab` now derives:
- today's orders,
- pending prescriptions,
- orders awaiting fulfillment,
- total order value,
- low / out of stock,
- expiring inventory,
- pending refunds,
- pharmacy performance/rating from the profile record.

Empty states are shown instead of hidden fallback numbers.

## Follow-on phases

- Phase 1: unified GlobalHealth authentication wiring for the pharmacy partner
  portal (remove the portal-local partner sign-in from the normal flow while
  retaining a role-based partner gate).
- Phase 2: module hardening — supplier/purchase order workflows, refunds,
  payouts, coupons, multi-branch inventory, batch/FEFO, delivery zones.
- Phase 3+: real-time inventory synchronization hardening, product analytics,
  customer analytics, compliance expiry automation, admin oversight.
