# LS-Inventory Feature Tracker

## CORE FEATURES (Phase 1)

| Feature | Status | Description | Dependencies | Priority |
|---|---|---|---|---|
| Device inventory with INV-XXXX ID system | Planned | Manage inventory devices using `INV-XXXX XX XX` identity structure. | Database schema, device CRUD API, frontend inventory UI | High |
| User authentication/login system | Planned | Secure login/logout flow for access control (single-user first). | Users table, auth API, JWT middleware, login UI | High |
| Storage location tracking (default: Storage) | Planned | Track current device location with initial assignment to `Storage`. | Locations/device_locations tables, device lifecycle endpoints | High |
| Device details management (specs, category, etc.) | Planned | Store and edit device metadata such as make, model, category, serial. | Device model, validators, inventory forms | High |
| QR code generation for device labels | Planned | Generate QR data for labels and support scanner-based lookups. | QR utility, device endpoint integration, frontend QR module | Medium |

## SECONDARY FEATURES (Phase 2)

| Feature | Status | Description | Dependencies | Priority |
|---|---|---|---|---|
| Case assignment for devices | Planned | Assign devices to transport/storage cases and track those allocations. | Locations/types extension, assignment endpoints | Medium |
| Project/Job/Event creation and management | Planned | Create and manage event jobs and project timelines/status. | Projects table, project API and UI | High |
| Device assignment to projects | Planned | Link required/assigned device quantities to jobs. | project_devices table, project and inventory APIs | High |
| Packsheet generation (PDF) | Planned | Generate printable packsheet documents for pick operations. | Packsheet tables, PDF utility, packsheet API | Medium |
| Packsheet scanning integration (QR check-off) | Planned | Check off picked devices by scanning QR codes during packing. | QR scanner UI, packsheet item endpoints | Medium |
| Device label printing (with QR codes) | Planned | Produce printable labels containing inventory and QR metadata. | QR generation, printable templates/PDF | Low |

## MAINTENANCE & TRACKING (Phase 3)

| Feature | Status | Description | Dependencies | Priority |
|---|---|---|---|---|
| Maintenance record tracking (damage, last service) | Planned | Track damage, service history, and notes per device. | maintenance_records table, maintenance API/UI | Medium |
| Service interval configuration and reminders | Planned | Configure service intervals and report upcoming due dates. | Maintenance data model, reminder logic, dashboard UI | Medium |

## DATA MANAGEMENT (Phase 4)

| Feature | Status | Description | Dependencies | Priority |
|---|---|---|---|---|
| CSV import for existing inventory | Planned | Import existing inventory exports into the system safely. | CSV parser, validation layer, import API/UI | Medium |

## FUTURE ENHANCEMENTS

| Feature | Status | Description | Dependencies | Priority |
|---|---|---|---|---|
| Multi-user support and role-based access control | Planned | Expand to team usage with roles and granular permissions. | Auth redesign, role model, UI access controls | Low |
| Analytics and reporting | Planned | Add inventory utilization and maintenance reporting dashboards. | Data aggregation endpoints and charting UI | Low |
| Advanced filtering and search | Planned | Add powerful search/filter tools across inventory and projects. | Indexing strategy, query APIs, UI controls | Low |

> TODO: Update each feature status as implementation progresses (`Planned` -> `In Progress` -> `Done`).
