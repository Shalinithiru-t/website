import mongoose from "mongoose"
import { env } from "./env.js"

export async function connectDb(): Promise<void> {
  mongoose.set("strictQuery", true)
  await mongoose.connect(env.MONGODB_URI, { dbName: "mountroof" })
  console.log(`MongoDB connected: ${mongoose.connection.name}`)
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect()
}
