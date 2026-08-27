import type { Request, Response, NextFunction } from "express"

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: "Route not found" })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err)
  const message = err instanceof Error ? err.message : "Internal server error"
  res.status(500).json({ success: false, message })
}
