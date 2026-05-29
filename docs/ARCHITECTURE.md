# LS-Inventory Architecture

## High-level design
- **Frontend**: responsive static web app (`frontend/public`) for desktop and mobile workflows.
- **Backend**: Node.js + Express + TypeScript REST API (`backend/src`).
- **Database**: PostgreSQL schema in `database/schema.sql`.

## Request flow
1. Frontend module sends API request to backend.
2. Express route applies auth/validation middleware.
3. Controller orchestrates business logic and DB access utilities.
4. Response returns JSON (or PDF for packsheets).

## Key technical decisions
- TypeScript backend for type safety.
- REST endpoints per domain area (`auth`, `devices`, `projects`, `packsheets`, `maintenance`).
- QR integration through URL payloads to support both info lookup and packing check-off modes.
- pdfkit selected for printable packsheet generation.

> TODO: Add sequence diagrams and deployment topology for self-hosted environments.
