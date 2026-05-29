# LS-Inventory Database Overview

Database engine: MySQL 8+ (`database/schema.mysql.sql`, utf8mb4 / utf8mb4_unicode_ci).

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

## Setup (step-by-step)
1. Create DB:
   ```sql
   CREATE DATABASE ls_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Create app user and grant access:
   ```sql
   CREATE USER 'lsinventory'@'localhost' IDENTIFIED BY 'replace_with_secure_password';
   GRANT ALL PRIVILEGES ON ls_inventory.* TO 'lsinventory'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Apply schema:
   ```bash
   mysql -u lsinventory -p ls_inventory < database/schema.mysql.sql
   ```
4. Verify:
   ```sql
   USE ls_inventory;
   SHOW TABLES;
   ```

> TODO: Add ER diagram and indexing recommendations.
