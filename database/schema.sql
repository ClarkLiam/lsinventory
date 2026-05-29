-- LS-Inventory PostgreSQL schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'storage',
  description TEXT
);

CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  inv_code VARCHAR(9) NOT NULL,
  unit_id VARCHAR(2) NOT NULL,
  optional_field VARCHAR(2),
  make VARCHAR(120) NOT NULL,
  model VARCHAR(120) NOT NULL,
  category VARCHAR(120) NOT NULL,
  serial_number VARCHAR(120),
  location_id INTEGER REFERENCES locations(id),
  status VARCHAR(50) NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT device_identity_unique UNIQUE (inv_code, unit_id, optional_field)
);

CREATE TABLE IF NOT EXISTS device_locations (
  id SERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  event_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_devices (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  quantity_needed INTEGER NOT NULL DEFAULT 1,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT project_device_unique UNIQUE (project_id, device_id)
);

CREATE TABLE IF NOT EXISTS packsheets (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS packsheet_items (
  id SERIAL PRIMARY KEY,
  packsheet_id INTEGER NOT NULL REFERENCES packsheets(id) ON DELETE CASCADE,
  device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  picked_quantity INTEGER NOT NULL DEFAULT 0,
  picked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id SERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  service_type VARCHAR(120) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  next_service_due DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_qr_codes (
  id SERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  qr_code_data TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT device_qr_unique UNIQUE (device_id)
);

INSERT INTO locations (name, type, description)
VALUES ('Storage', 'storage', 'Default inventory storage location')
ON CONFLICT (name) DO NOTHING;
