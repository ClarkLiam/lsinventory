export interface Project {
  id: number;
  name: string;
  eventDate: Date;
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
