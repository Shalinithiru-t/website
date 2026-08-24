import { Router } from "express"
import { z } from "zod"
import { User } from "../models/User.js"
import { signToken } from "../utils/jwt.js"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authRouter = Router()

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid email or password format",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const { email, password } = parsed.data
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash")

  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: "Invalid email or password" })
    return
  }

  user.lastLogin = new Date()
  await user.save()

  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  })

  res.json({
    success: true,
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
})

authRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.sub).select("-passwordHash")
  if (!user) {
    res.status(401).json({ success: false, message: "User not found" })
    return
  }

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    },
  })
})

authRouter.post("/logout", requireAuth, (_req, res) => {
  // JWT is stateless — client discards the token
  res.json({ success: true, message: "Logged out" })
})
