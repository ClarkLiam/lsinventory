export interface Packsheet {
  id: number;
  projectId: number;
  status: "draft" | "in_progress" | "completed";
  createdAt: Date;
  completedAt: Date | null;
}
