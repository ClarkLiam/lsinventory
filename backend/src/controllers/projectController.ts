import type { Request, Response } from "express";

/**
 * List projects/jobs/events.
 */
export const listProjects = async (_req: Request, res: Response): Promise<void> => {
  // TODO: Return projects with device assignment summaries.
  res.status(200).json({ data: [] });
};

/**
 * Fetch a project by id.
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ data: { id: req.params.id } });
};

/**
 * Create a project.
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({ message: "Project scaffold created", data: req.body });
};

/**
 * Update a project.
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Project scaffold updated", id: req.params.id, data: req.body });
};
