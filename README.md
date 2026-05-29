# LS-Inventory

LS-Inventory is a self-hosted Event Tech Inventory Tracking System for microphones, lights, consoles, cases, and other production equipment.

## Purpose and Key Features
- Track devices with the `INV-XXXX XX XX` identifier format.
- Manage storage locations and project/job assignments.
- Generate QR data for labels and scan-based workflows.
- Build packsheets and export printable PDFs.
- Track maintenance history and upcoming service dates.

## Architecture Overview
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: HTML5 + CSS3 + JavaScript modules (responsive)
- **Database**: MySQL
- **QR**: `qrcode` library + native camera workflow (frontend placeholder)
- **PDF**: `pdfkit`

## Project Structure
```text
lsinventory/
├── backend/
│   ├── config/.env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       ├── middleware/
│       └── utils/
├── frontend/public/
│   ├── index.html
│   ├── css/styles.css
│   └── js/
├── database/schema.sql
├── database/schema.mysql.sql
├── docs/
├── features.md
└── .gitignore
```

## Getting Started
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment:
   ```bash
   cp config/.env.example config/.env
   ```
3. Initialize MySQL schema:
   ```bash
   mysql -u <user> -p <database> < ../database/schema.mysql.sql
   ```
4. Run backend:
   ```bash
   npm run dev
   ```
5. Serve `frontend/public` from your web server.

## Device ID Format
```text
INV-XXXX XX XX
```
- `INV-XXXX`: inventory model identifier
- First `XX`: unit ID
- Second `XX`: optional reserved field

## Usage Workflows
- **Add devices**: create inventory record, assign default location `Storage`, generate QR payload.
- **Pack for jobs**: create project, assign devices, generate packsheet, scan QR for check-off.
- **Maintenance**: log service/damage records and track next service due.
- **Import inventory**: planned CSV import path from existing inventory exports.

## API Overview
- `POST /api/auth/login`, `POST /api/auth/logout`
- `GET/POST/PUT/DELETE /api/devices`
- `GET/POST/PUT /api/projects`
- `POST /api/packsheets`, `GET /api/packsheets/:id`, `GET /api/packsheets/:id/pdf`, `POST /api/packsheets/:id/checkoff`
- `GET/POST /api/maintenance`

See full details in `docs/API.md`.

## Configuration
`backend/config/.env.example` includes:
- Server: `PORT`, `NODE_ENV`, `JWT_SECRET`, `FRONTEND_URL`
- MySQL: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_CONNECTION_LIMIT`, `DB_QUEUE_LIMIT`

## Development Setup
- Backend build:
  ```bash
  cd backend
  npm run build
  ```
- Backend start (compiled):
  ```bash
  npm run start
  ```

For setup, API, user, database, and architecture docs, see `docs/`.
