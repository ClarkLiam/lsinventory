# LS-Inventory

**Event Tech Inventory Tracking System** - A comprehensive web-based inventory and event production management system for tracking event tech devices and organizing them for jobs/events.

## Overview

LS-Inventory is a self-hosted web application designed for event production companies and tech managers to:
- Track and manage event tech equipment (microphones, lights, consoles, cases, etc.)
- Organize devices into storage, cases, and projects/jobs/events
- Generate QR-coded device labels for identification and scanning
- Create packsheets for efficient device picking and job setup
- Track device maintenance schedules and damage history
- Manage multi-user access with secure authentication

The system is optimized for both **mobile devices** (packing operations, device information) and **desktop browsers** (planning, management, maintenance tracking).

## Key Features

See [features.md](./features.md) for detailed feature list and implementation status.

### Quick Highlights
- 🏷️ Device inventory with unique INV-XXXX ID system
- 📦 Case and project assignment workflows
- 🔲 QR code generation and scanning integration
- 📋 Packsheet generation with PDF export
- 🔧 Maintenance tracking with service intervals
- 👤 User authentication and access control
- 📥 CSV import for existing inventory data

## Architecture Overview

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript/TypeScript (Responsive Web App)
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (user-provided)
- **QR Code**: qrcode.js for generation, native camera access for scanning
- **PDF Generation**: pdfkit for packsheet export

### Project Structure
```
lsinventory/
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Auth, validation, etc.
│   │   ├── utils/          # Helpers (QR, PDF, etc.)
│   │   └── app.js          # Express app setup
│   ├── config/             # Configuration templates
│   └── package.json
├── frontend/               # Web app (static + JS)
│   ├── public/
│   │   ├── index.html      # Main app shell
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       ├── app.js      # Main app logic
│   │       ├── auth.js     # Auth handling
│   │       ├── inventory.js
│   │       ├── packing.js
│   │       ├── qr.js       # QR scanning/generation
│   │       └── utils.js
│   └── views/              # HTML templates
├── database/               # DB setup scripts
│   ├── schema.sql          # Database structure
│   └── seed.sql            # Sample data (optional)
├── docs/                   # Documentation
│   ├── API.md              # API endpoint docs
│   ├── SETUP.md            # Installation guide
│   └── USER_GUIDE.md       # User documentation
├── .gitignore
├── features.md             # Feature tracking
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (user-provided connection)
- Modern web browser with camera access (for QR scanning)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ClarkLiam/lsinventory.git
   cd lsinventory
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp config/.env.example config/.env
   # Edit config/.env with your database connection details
   npm run start
   ```

3. **Database Setup**
   ```bash
   # Run schema setup against your PostgreSQL database
   psql -U your_user -d your_database -f ../database/schema.sql
   ```

4. **Frontend**
   - Serve `frontend/public/` directory from your web hosting folder
   - Update API endpoints in `frontend/public/js/app.js` to match your backend URL

5. **Access the Application**
   - Open `http://your-domain.com` in your browser
   - Login with your credentials

## Device ID Format

Devices are identified using a hierarchical ID system:

```
INV-XXXX XX XX

- INV-XXXX: Inventory number (device model/type identifier)
- XX:       Unit ID (specific unit of that model)
- XX:       Optional field (reserved for future use)
```

**Example**: `INV-0001 01 00` = First unit of inventory item 0001

## Usage Workflows

### Adding Devices to Inventory
1. Navigate to **Inventory** section
2. Add device with INV-XXXX code, unit information, and specifications
3. Device automatically placed in **Storage** location
4. QR code label generated and can be printed

### Packing for a Job
1. Create new **Project/Job/Event** with required devices
2. Generate **Packsheet** (PDF) listing items needed
3. On mobile: Scan QR codes to check off items as picked
4. System validates all items collected before marking job ready

### Maintenance
1. Navigate to **Maintenance** section
2. Log damage, repairs, or service performed
3. Set service intervals for device
4. System generates reminders when next service is due

### Importing Existing Inventory
1. Export inventory from Apple Numbers as CSV
2. Go to **Admin > Import**
3. Upload CSV file and map columns to device fields
4. Review and confirm import

## API Endpoints

See [docs/API.md](./docs/API.md) for complete API documentation.

### Quick Reference
- `POST /api/auth/login` - User authentication
- `GET /api/devices` - List all devices
- `POST /api/devices` - Add new device
- `GET /api/projects` - List projects/jobs
- `POST /api/packsheets` - Generate packsheet
- `GET /api/packsheets/:id/pdf` - Download packsheet PDF

## Roadmap

See [features.md](./features.md) for detailed roadmap and implementation status.

**Current Focus**: Core inventory and authentication system

**Upcoming**: QR integration, packsheet generation, maintenance tracking

**Future**: Multi-user support, analytics, advanced reporting

## Configuration

### Environment Variables (.env)
```
# Database
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=ls_inventory
DB_USER=your_user
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=production
SECRET_KEY=your_secret_key_for_jwt

# Frontend
FRONTEND_URL=http://your-domain.com
```

## Development

### Running Locally
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (serve from public folder)
cd frontend
python -m http.server 8000
```

### Building for Production
```bash
cd backend
npm run build
npm start
```

## Database Schema

See [database/schema.sql](./database/schema.sql) for complete database structure.

### Main Tables
- `users` - User accounts and authentication
- `devices` - Device inventory with INV-XXXX codes
- `locations` - Storage locations and cases
- `device_locations` - Current location/case assignment for each device
- `projects` - Jobs/events that need devices
- `project_devices` - Devices assigned to projects
- `maintenance_records` - Service history and damage tracking
- `packsheets` - Generated packing lists with status

## Contributing

This is a single-user focused project. For contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md) (to be created).

## License

[Your chosen license - e.g., MIT]

## Support & Documentation

- **Setup Guide**: See [docs/SETUP.md](./docs/SETUP.md)
- **API Documentation**: See [docs/API.md](./docs/API.md)
- **User Guide**: See [docs/USER_GUIDE.md](./docs/USER_GUIDE.md)
- **Issues**: Create an issue on GitHub for bugs or feature requests

## Author

Created for efficient event tech inventory management and job organization.

---

**Last Updated**: 2026-05-29
