-- LS-Inventory MySQL schema

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'storage',
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inv_code VARCHAR(9) NOT NULL,
  unit_id VARCHAR(2) NOT NULL,
  optional_field VARCHAR(2),
  make VARCHAR(120) NOT NULL,
  model VARCHAR(120) NOT NULL,
  category VARCHAR(120) NOT NULL,
  serial_number VARCHAR(120),
  location_id INT,
  status VARCHAR(50) NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT device_identity_unique UNIQUE (inv_code, unit_id, optional_field),
  CONSTRAINT fk_devices_location FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS device_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  location_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_device_locations_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  CONSTRAINT fk_device_locations_location FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  event_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  device_id INT NOT NULL,
  quantity_needed INT NOT NULL DEFAULT 1,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT project_device_unique UNIQUE (project_id, device_id),
  CONSTRAINT fk_project_devices_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_devices_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS packsheets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_packsheets_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS packsheet_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  packsheet_id INT NOT NULL,
  device_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  picked_quantity INT NOT NULL DEFAULT 0,
  picked_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_packsheet_items_packsheet FOREIGN KEY (packsheet_id) REFERENCES packsheets(id) ON DELETE CASCADE,
  CONSTRAINT fk_packsheet_items_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS maintenance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  service_type VARCHAR(120) NOT NULL,
  `date` DATE NOT NULL,
  notes TEXT,
  next_service_due DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_maintenance_records_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS device_qr_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  qr_code_data TEXT NOT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT device_qr_unique UNIQUE (device_id),
  CONSTRAINT fk_device_qr_codes_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_devices_location_id ON devices(location_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_device_locations_device_id ON device_locations(device_id);
CREATE INDEX idx_device_locations_location_id ON device_locations(location_id);
CREATE INDEX idx_projects_event_date ON projects(event_date);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_devices_device_id ON project_devices(device_id);
CREATE INDEX idx_packsheets_project_id ON packsheets(project_id);
CREATE INDEX idx_packsheets_status ON packsheets(status);
CREATE INDEX idx_packsheet_items_packsheet_id ON packsheet_items(packsheet_id);
CREATE INDEX idx_packsheet_items_device_id ON packsheet_items(device_id);
CREATE INDEX idx_maintenance_records_device_id ON maintenance_records(device_id);
CREATE INDEX idx_maintenance_records_next_service_due ON maintenance_records(next_service_due);

INSERT INTO locations (name, type, description)
VALUES ('Storage', 'storage', 'Default inventory storage location')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);
