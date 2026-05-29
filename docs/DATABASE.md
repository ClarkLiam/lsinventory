# LS-Inventory Database Overview

## Core entities
- `users`: login accounts.
- `devices`: inventory items identified by `INV-XXXX` + unit + optional field.
- `locations`: storage/case locations (includes default `Storage`).
- `device_locations`: assignment history of devices to locations.
- `projects`: jobs/events.
- `project_devices`: devices required for projects.
- `packsheets` + `packsheet_items`: packing operations and pick progress.
- `maintenance_records`: service and damage history.
- `device_qr_codes`: generated QR payloads.

## Relationships
- A `device` belongs to one current `location` and many historical `device_locations` rows.
- A `project` has many `project_devices` and can have one or many `packsheets`.
- A `packsheet` has many `packsheet_items` tied to devices.
- A `device` has many `maintenance_records` and one active QR payload row.

> TODO: Add ER diagram and indexing recommendations.
