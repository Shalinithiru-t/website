import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { v2 as cloudinary } from "cloudinary"
import { env, isCloudinaryConfigured } from "../config/env.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads")

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const MAX_BYTES = 5 * 1024 * 1024

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }
}

export function isAllowedImageMime(mime: string) {
  return ALLOWED_MIME.has(mime)
}

export function maxUploadBytes() {
  return MAX_BYTES
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export type UploadedImage = {
  url: string
  provider: "local" | "cloudinary"
  filename: string
}

export async function storeImageBuffer(
  buffer: Buffer,
  originalName: string,
  mime: string,
  publicBaseUrl: string
): Promise<UploadedImage> {
  if (!isAllowedImageMime(mime)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed")
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller")
  }

  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : mime === "image/gif" ? "gif" : "jpg"
  const safeBase = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  const filename = `${Date.now()}-${safeBase || "image"}.${ext}`

  if (isCloudinaryConfigured()) {
    configureCloudinary()
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: env.CLOUDINARY_FOLDER || "mountroof",
          resource_type: "image",
          public_id: filename.replace(/\.[^.]+$/, ""),
        },
        (err, uploaded) => {
          if (err || !uploaded) reject(err || new Error("Cloudinary upload failed"))
          else resolve(uploaded as { secure_url: string; public_id: string })
        }
      )
      stream.end(buffer)
    })
    return {
      url: result.secure_url,
      provider: "cloudinary",
      filename: result.public_id,
    }
  }

  ensureUploadsDir()
  const dest = path.join(UPLOADS_DIR, filename)
  await fs.promises.writeFile(dest, buffer)
  const base = publicBaseUrl.replace(/\/$/, "")
  return {
    url: `${base}/uploads/${filename}`,
    provider: "local",
    filename,
  }
}
