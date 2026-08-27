import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = async function comparePassword(plain: string) {
  return bcrypt.compare(plain, this.passwordHash)
}

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId
  comparePassword(plain: string): Promise<boolean>
}

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema)

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}
