# Product Requirements Document (PRD)
## IT Inventory Management Application

| | |
|---|---|
| **Document Owner** | Product/Engineering |
| **Status** | Draft v1.0 |
| **Last Updated** | August 6, 2026 |
| **Stack** | React (web admin), React Native (mobile), FastAPI (backend), PostgreSQL (database) |

---

## 1. Overview

### 1.1 Problem Statement
Organizations struggle to track IT assets (laptops, monitors, peripherals, servers, networking gear, software licenses) across employees, departments, and locations. Manual tracking via spreadsheets leads to lost assets, duplicate purchases, compliance gaps, and slow audits.

### 1.2 Product Vision
A centralized IT Inventory Management System that lets IT teams track, assign, audit, and report on hardware/software assets throughout their lifecycle — accessible via a web dashboard (React) for admins and a mobile app (React Native) for field technicians doing scans, audits, and check-in/check-out.

### 1.3 Goals
- Single source of truth for all IT assets and their status/location/owner.
- Reduce asset loss and untracked spend.
- Enable fast check-in/check-out and audits via mobile (including barcode/QR scanning).
- Provide reporting for budgeting, depreciation, warranty, and compliance (e.g., audits).
- Role-based access for IT admins, managers, and employees.

### 1.4 Non-Goals (v1)
- Full procurement/purchase-order workflow (may integrate later via API).
- Network device auto-discovery (SNMP/agent-based scanning) — future phase.
- Deep ITSM ticketing (integrate with existing tools like Jira/ServiceNow instead of rebuilding).

---

## 2. Target Users & Personas

| Persona | Description | Key Needs |
|---|---|---|
| **IT Admin** | Manages full asset lifecycle, users, roles | Full CRUD, bulk import/export, reports, audit logs |
| **IT Technician (Field)** | Performs physical audits, assigns/returns assets | Mobile scanning, quick check-in/out, offline support |
| **Manager** | Views department assets, approves requests | Read-only dashboards, asset requests approval |
| **Employee** | Views assets assigned to them, requests new equipment | Self-service portal, request status |
| **Auditor/Finance** | Reviews compliance, depreciation, valuation | Exportable reports, historical logs |

---

## 3. Key Features & Functional Requirements

### 3.1 Asset Management (Core)
- Create/edit/delete asset records: category, make/model, serial number, asset tag, purchase date, cost, warranty expiry, vendor, location, status (In Stock / Assigned / In Repair / Retired / Lost).
- Asset categories: Hardware (laptop, desktop, monitor, mobile, networking, server), Software licenses, Accessories, Consumables.
- Custom fields per category (configurable by admin).
- Bulk import via CSV/Excel; bulk export.
- Attach documents/images (invoices, photos of asset condition).
- QR code / barcode generation per asset tag.

### 3.2 Assignment & Lifecycle Tracking
- Assign asset to employee/department/location.
- Check-in / check-out workflow with e-signature or acknowledgment.
- Full history log per asset (who had it, when, condition notes).
- Depreciation tracking (straight-line, configurable method).
- Maintenance/repair ticket logging tied to an asset.
- End-of-life / retirement / disposal workflow.

### 3.3 Mobile App (React Native)
- Barcode/QR scanning for quick lookup, check-in/out, and audits.
- Offline mode with local cache + sync when reconnected.
- Physical audit mode: scan assets in a location, flag missing/mismatched items.
- Push notifications (asset assigned, return due, warranty expiring).
- Photo capture attached directly to asset record (e.g., damage report).

### 3.4 Self-Service Portal (Web/Mobile)
- Employees view assets currently assigned to them.
- Submit new equipment requests / report issues.
- Manager approval workflow for requests.

### 3.5 Reporting & Analytics
- Dashboard: total assets, by status/category/location, upcoming warranty expirations, upcoming depreciation write-offs.
- Custom report builder with export (CSV, PDF, Excel).
- Audit trail / activity log (who changed what, when).
- License compliance report (assigned seats vs. purchased seats).

### 3.6 Admin & Access Control
- Role-Based Access Control (RBAC): Super Admin, IT Admin, Manager, Employee, Auditor (read-only).
- SSO / OAuth2 login (Google Workspace, Microsoft Entra ID) + email/password fallback.
- Multi-location / multi-department support.
- Audit logs for security/compliance.

### 3.7 Notifications
- Email + push notifications: assignment, return due, warranty expiry, low stock, maintenance due.
- Configurable notification rules per admin.

---

## 4. Technical Architecture

### 4.1 High-Level Stack
| Layer | Technology |
|---|---|
| Web Frontend | React (Vite or Next.js), TypeScript, TanStack Query, Redux/Zustand for state, Tailwind CSS / MUI |
| Mobile App | React Native (Expo or bare), TypeScript, React Navigation, offline storage via WatermelonDB/SQLite |
| Backend API | FastAPI (Python 3.12+), Pydantic v2, SQLAlchemy 2.0 (async) / SQLModel |
| Database | PostgreSQL 16+ |
| Auth | OAuth2 / JWT (FastAPI Users or custom), SSO via OIDC |
| File Storage | S3-compatible object storage (for images, invoices) |
| Caching/Queue | Redis (caching, background jobs), Celery or FastAPI BackgroundTasks/RQ for async jobs (notifications, imports) |
| Search | PostgreSQL full-text search (v1); Elasticsearch/OpenSearch (future, if scale requires) |
| Infra | Docker + Docker Compose (dev), Kubernetes or ECS (prod), CI/CD via GitHub Actions |
| Monitoring | Sentry (errors), Prometheus/Grafana (metrics), structured logging |

### 4.2 System Architecture (Conceptual)
```
[React Web App]        [React Native Mobile App]
        \                       /
         \                     /
          v                   v
        [FastAPI REST API (JWT/OAuth2 secured)]
                    |
        -----------------------------
        |             |             |
   [PostgreSQL]   [Redis Cache]  [S3 Storage]
        |
   [Background Workers - Celery/RQ]
   (notifications, bulk import, report gen)
```

### 4.3 API Design Principles
- RESTful resource-based endpoints (`/api/v1/assets`, `/api/v1/assignments`, `/api/v1/users`, `/api/v1/reports`).
- OpenAPI/Swagger auto-generated docs (native to FastAPI).
- Pagination, filtering, sorting on all list endpoints.
- Versioned API (`/api/v1/...`) for backward compatibility.
- WebSocket or polling for real-time dashboard updates (optional, phase 2).
- Idempotent bulk import endpoint with row-level error reporting.

### 4.4 Core Data Model (Simplified ERD)

**users** — id, name, email, role, department_id, location_id, sso_id, created_at

**departments** — id, name, parent_department_id

**locations** — id, name, address, site_code

**asset_categories** — id, name, custom_fields (jsonb)

**assets** — id, asset_tag, category_id, make, model, serial_number, status, purchase_date, purchase_cost, warranty_expiry, vendor_id, location_id, custom_fields (jsonb), created_at, updated_at

**assignments** — id, asset_id, user_id, assigned_at, returned_at, condition_notes, signature_url

**asset_history** — id, asset_id, event_type, event_data (jsonb), performed_by, created_at

**vendors** — id, name, contact_info

**software_licenses** — id, name, total_seats, used_seats, expiry_date, cost, vendor_id

**maintenance_tickets** — id, asset_id, issue_description, status, opened_at, closed_at

**requests** — id, requested_by, asset_category_id, status, approved_by, created_at

**audit_logs** — id, user_id, action, entity_type, entity_id, metadata (jsonb), created_at

> Use PostgreSQL `jsonb` columns for custom/dynamic fields to keep the schema flexible per category without frequent migrations.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | API p95 response time < 300ms for standard CRUD; asset list supports 100k+ records with pagination |
| **Scalability** | Horizontally scalable API (stateless, containerized); DB read replicas for reporting queries |
| **Availability** | 99.5% uptime target for v1 |
| **Security** | JWT-based auth, RBAC enforced at API layer, encrypted secrets, HTTPS everywhere, OWASP Top 10 compliance |
| **Data Privacy** | PII (employee data) access restricted by role; audit logging of sensitive data access |
| **Offline Support** | Mobile app must support offline scanning/audits with sync-on-reconnect and conflict resolution |
| **Accessibility** | Web app WCAG 2.1 AA compliant |
| **Localization** | i18n-ready architecture (strings externalized), even if only English at launch |
| **Backup/DR** | Automated daily PostgreSQL backups, point-in-time recovery |

---

## 6. User Flows (Examples)

1. **Onboarding an asset**: Admin creates asset → generates QR/barcode → prints label → asset status = "In Stock."
2. **Assigning an asset**: Admin/Technician selects asset → assigns to employee → employee acknowledges (digital signature) → status = "Assigned."
3. **Field audit**: Technician opens mobile app → selects location → scans all physical assets → app flags assets not found / found-but-unassigned → generates audit report.
4. **Employee request**: Employee submits request for new laptop → Manager approves → IT Admin fulfills from stock or purchases → asset assigned.
5. **Asset retirement**: Asset reaches EOL or is damaged beyond repair → Admin marks "Retired" → disposal record logged → removed from active depreciation.

---

## 7. Milestones & Phased Rollout

| Phase | Scope | Est. Duration |
|---|---|---|
| **Phase 0** | Requirements finalization, DB schema design, API contract (OpenAPI spec), UI wireframes | 2 weeks |
| **Phase 1 (MVP)** | Core asset CRUD, assignment/check-in-out, RBAC/auth, web admin dashboard, basic reporting | 6–8 weeks |
| **Phase 2** | React Native mobile app (scanning, offline audits), notifications, self-service portal | 6 weeks |
| **Phase 3** | Advanced reporting, software license tracking, depreciation engine, SSO integration | 4 weeks |
| **Phase 4** | Bulk import/export, custom fields per category, audit trail UI, polish & hardening | 3 weeks |
| **Phase 5 (Future)** | Network auto-discovery, ITSM integrations (Jira/ServiceNow), analytics/BI export | TBD |

---

## 8. Success Metrics (KPIs)

- % of IT assets tracked in system vs. estimated total inventory (target: 95%+ within 3 months of launch).
- Average time to complete a physical audit (target: reduce by 50% vs. manual process).
- Reduction in "lost/unaccounted" assets reported per quarter.
- Adoption rate: % of eligible IT staff actively using the mobile app weekly.
- Time-to-fulfill employee equipment requests (target: < 3 business days).

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Data migration from existing spreadsheets is messy | Build robust bulk-import with validation and error reporting; provide import templates |
| Low technician adoption of mobile scanning | Ensure offline-first UX, minimize taps, involve techs in UAT |
| Custom fields per category cause schema sprawl | Use `jsonb` custom fields instead of new columns/tables per category |
| SSO integration complexity across orgs | Start with standard OIDC support (Google/Microsoft) before custom SAML requests |
| Scope creep into full ITSM/procurement | Explicitly defer to Non-Goals; integrate via API instead of rebuilding |

---

## 10. Open Questions

- Do we need multi-tenant support (multiple client organizations) or is this single-org internal tool?
- Should software license management be full-featured in v1 or a lightweight tracker?
- What existing systems (HRIS, procurement, SSO provider) need integration at launch?
- Barcode standard: QR only, or also support existing 1D barcode asset tags already printed on hardware?

---

## 11. Appendix

- **API Docs**: Auto-generated via FastAPI at `/docs` (Swagger UI) and `/redoc`.
- **Design System**: To be defined — recommend a shared component library reusable across React and React Native where feasible (e.g., shared design tokens, separate component implementations).
- **Glossary**: Asset Tag (unique physical identifier), Check-in/out (assignment/return event), EOL (End of Life).
