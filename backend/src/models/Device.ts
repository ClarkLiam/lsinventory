export interface Device {
  id: number;
  invCode: string;
  unitId: string;
  optionalField: string | null;
  make: string;
  model: string;
  category: string;
  serialNumber: string | null;
  locationId: number;
  status: "available" | "assigned" | "maintenance";
  createdAt: Date;
  updatedAt: Date;
}
