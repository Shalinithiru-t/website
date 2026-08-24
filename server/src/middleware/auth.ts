import type { Request, Response, NextFunction } from "express"
import { verifyToken, type JwtPayload } from "../utils/jwt.js"

export type AuthRequest = Request & {
  user?: JwtPayload
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required" })
    return
  }

  const token = header.slice(7)
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" })
    return
  }
  if (req.user.role !== "admin" && req.user.role !== "editor") {
    res.status(403).json({ success: false, message: "Insufficient permissions" })
    return
  }
  next()
}
