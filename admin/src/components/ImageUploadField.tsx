import { useRef, useState } from "react"
import { ImagePlus, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { uploadImage } from "@/lib/api"
import { FieldHint, fieldClass, labelClass } from "@/components/FormField"

type Props = {
  id: string
  label: string
  value: string
  onChange: (url: string) => void
  required?: boolean
  hint?: string
  placeholder?: string
  /** Upload button only — used to append into a multi-image list */
  uploadOnly?: boolean
}

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  required,
  hint,
  placeholder = "https://… or upload a file",
  uploadOnly = false,
}: Props) {
  const { token } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function onFile(file: File | undefined) {
    if (!file || !token) return
    setUploading(true)
    setError("")
    try {
      const url = await uploadImage(token, file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className={labelClass} htmlFor={uploadOnly ? undefined : id}>
        {label}
        {required ? " *" : ""}
      </label>
      {uploadOnly ? (
        <div className="mt-1.5">
          <button
            type="button"
            disabled={uploading || !token}
            onClick={() => inputRef.current?.click()}
            className="admin-btn admin-btn-secondary"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4" aria-hidden="true" />
            )}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
      ) : (
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id={id}
            className={fieldClass + " !mt-0"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
          />
          <button
            type="button"
            disabled={uploading || !token}
            onClick={() => inputRef.current?.click()}
            className="admin-btn admin-btn-secondary shrink-0"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4" aria-hidden="true" />
            )}
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      {hint && <FieldHint>{hint}</FieldHint>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
      {!uploadOnly && value && (
        <div className="mt-3 overflow-hidden rounded-xl border border-border-grey bg-[#f4f7fa]">
          <img src={value} alt="Preview" className="max-h-48 w-full object-cover" />
        </div>
      )}
    </div>
  )
}
