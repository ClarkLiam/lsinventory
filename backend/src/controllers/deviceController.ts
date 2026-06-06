import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { query } from "../utils/database";

interface DeviceRow extends RowDataPacket {
  id: number;
  invCode: string;
  unitId: string;
  optionalField: string | null;
  make: string;
  model: string;
  category: string;
  serialNumber: string | null;
  locationId: number | null;
  locationName: string | null;
  status: "available" | "assigned" | "maintenance";
  createdAt: Date;
  updatedAt: Date;
}

interface LocationRow extends RowDataPacket {
  id: number;
}

const DEVICE_SELECT_FIELDS = `
  d.id,
  d.inv_code AS invCode,
  d.unit_id AS unitId,
  d.optional_field AS optionalField,
  d.make,
  d.model,
  d.category,
  d.serial_number AS serialNumber,
  d.location_id AS locationId,
  l.name AS locationName,
  d.status,
  d.created_at AS createdAt,
  d.updated_at AS updatedAt
`;

const mapDeviceRow = (row: DeviceRow) => ({
  id: row.id,
  invCode: row.invCode,
  unitId: row.unitId,
  optionalField: row.optionalField,
  make: row.make,
  model: row.model,
  category: row.category,
  serialNumber: row.serialNumber,
  locationId: row.locationId,
  locationName: row.locationName,
  status: row.status,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const getStorageLocationId = async (): Promise<number | null> => {
  const locations = await query<LocationRow[]>("SELECT id FROM locations WHERE name = ? LIMIT 1", ["Storage"]);
  return locations[0]?.id ?? null;
};

const getDeviceByIdRow = async (id: number): Promise<DeviceRow | null> => {
  const rows = await query<DeviceRow[]>(
    `
      SELECT ${DEVICE_SELECT_FIELDS}
      FROM devices d
      LEFT JOIN locations l ON l.id = d.location_id
      WHERE d.id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] ?? null;
};

const getNormalizedDeviceInput = async (body: Request["body"]) => {
  const storageLocationId = await getStorageLocationId();
  const locationId = body.locationId === undefined || body.locationId === null || body.locationId === ""
    ? storageLocationId
    : Number(body.locationId);

  return {
    invCode: String(body.invCode).trim(),
    unitId: String(body.unitId).trim(),
    optionalField: body.optionalField ? String(body.optionalField).trim() : null,
    make: String(body.make).trim(),
    model: String(body.model).trim(),
    category: String(body.category).trim(),
    serialNumber: body.serialNumber ? String(body.serialNumber).trim() : null,
    locationId: typeof locationId === "number" && Number.isInteger(locationId) && locationId > 0 ? locationId : null,
    status: String(body.status || "available").trim() as DeviceRow["status"],
  };
};

/**
 * List inventory devices.
 */
export const listDevices = async (_req: Request, res: Response): Promise<void> => {
  const rows = await query<DeviceRow[]>(
    `
      SELECT ${DEVICE_SELECT_FIELDS}
      FROM devices d
      LEFT JOIN locations l ON l.id = d.location_id
      ORDER BY d.created_at DESC, d.id DESC
    `,
  );

  res.status(200).json({ data: rows.map(mapDeviceRow) });
};

/**
 * Fetch a single device by id.
 */
export const getDeviceById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid device id" });
    return;
  }

  const row = await getDeviceByIdRow(id);

  if (!row) {
    res.status(404).json({ message: "Device not found" });
    return;
  }

  res.status(200).json({ data: mapDeviceRow(row) });
};

/**
 * Create a new device.
 */
export const createDevice = async (req: Request, res: Response): Promise<void> => {
  const payload = await getNormalizedDeviceInput(req.body);

  const result = await query<ResultSetHeader>(
    `
      INSERT INTO devices (
        inv_code,
        unit_id,
        optional_field,
        make,
        model,
        category,
        serial_number,
        location_id,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.invCode,
      payload.unitId,
      payload.optionalField,
      payload.make,
      payload.model,
      payload.category,
      payload.serialNumber,
      payload.locationId,
      payload.status,
    ],
  );

  const created = await getDeviceByIdRow(result.insertId);

  res.status(201).json({
    message: "Device created",
    data: created ? mapDeviceRow(created) : { id: result.insertId },
  });
};

/**
 * Update an existing device.
 */
export const updateDevice = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid device id" });
    return;
  }

  const payload = await getNormalizedDeviceInput(req.body);

  const result = await query<ResultSetHeader>(
    `
      UPDATE devices
      SET
        inv_code = ?,
        unit_id = ?,
        optional_field = ?,
        make = ?,
        model = ?,
        category = ?,
        serial_number = ?,
        location_id = ?,
        status = ?
      WHERE id = ?
    `,
    [
      payload.invCode,
      payload.unitId,
      payload.optionalField,
      payload.make,
      payload.model,
      payload.category,
      payload.serialNumber,
      payload.locationId,
      payload.status,
      id,
    ],
  );

  if (result.affectedRows === 0) {
    res.status(404).json({ message: "Device not found" });
    return;
  }

  const updated = await getDeviceByIdRow(id);

  res.status(200).json({
    message: "Device updated",
    data: updated ? mapDeviceRow(updated) : { id },
  });
};

/**
 * Delete a device.
 */
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid device id" });
    return;
  }

  const result = await query<ResultSetHeader>("DELETE FROM devices WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    res.status(404).json({ message: "Device not found" });
    return;
  }

  res.status(204).send();
};
