export interface MaintenanceRecord {
  id: number;
  deviceId: number;
  serviceType: string;
  date: Date;
  notes: string | null;
  nextServiceDue: Date | null;
  createdAt: Date;
}
