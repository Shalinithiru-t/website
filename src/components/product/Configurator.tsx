import { useMemo, useState } from "react"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Check, ArrowLeft } from "lucide-react"
import EnquiryDialog from "@/components/shared/EnquiryDialog"
import EnquiryForm, { type EnquiryPrefill } from "@/components/shared/EnquiryForm"

export default function Configurator({ product }: { product: Product }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [colour, setColour] = useState(product.colourOptions[0].name)
  const [thickness, setThickness] = useState(product.thicknessOptions[2] || product.thicknessOptions[0])
  const [length, setLength] = useState("6")
  const [quantity, setQuantity] = useState("50")
  const [surfaceMaterial, setSurfaceMaterial] = useState(product.surfaceMaterialOptions[0])
  const [dialogOpen, setDialogOpen] = useState(false)

  const selectedSwatch = product.colourOptions.find((c) => c.name === colour) || product.colourOptions[0]

  // Effective width in metres, derived from the product's spec (e.g. "1060mm" -> 1.06)
  const effectiveWidthM = useMemo(() => {
    const raw = product.specifications["Effective Width"] || ""
    const match = raw.match(/(\d+)\s*mm/)
    return match ? Number(match[1]) / 1000 : 1
  }, [product.specifications])

  const estimatedArea = useMemo(() => {
    const l = parseFloat(length) || 0
    const q = parseFloat(quantity) || 0
    const sqm = l * effectiveWidthM * q
    const sqft = sqm * 10.7639
    return { sqm, sqft }
  }, [length, quantity, effectiveWidthM])

  const prefill: EnquiryPrefill = {
    product: product.name,
    colour,
    thickness,
    length,
    area: estimatedArea.sqft > 0 ? Math.round(estimatedArea.sqft).toString() : "",
    quantity,
    surfaceMaterial,
  }

  return (
    <div className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: Configure card */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-charcoal">Configure Your Requirement</h3>
          </div>

          {/* Step indicator */}
          <div className="mt-4 flex items-center gap-2 text-xs font-medium sm:text-sm">
            <span className={`flex items-center gap-1.5 ${step === 1 ? "text-accent" : "text-steel"}`}>
              <span className={`flex size-5 items-center justify-center rounded-full text-[11px] ${step === 1 ? "bg-accent text-white" : "bg-surface text-steel"}`}>1</span>
              Product Requirements
            </span>
            <span className="h-px w-6 shrink-0 bg-border-grey sm:w-10" aria-hidden="true" />
            <span className={`flex items-center gap-1.5 ${step === 2 ? "text-accent" : "text-steel"}`}>
              <span className={`flex size-5 items-center justify-center rounded-full text-[11px] ${step === 2 ? "bg-accent text-white" : "bg-surface text-steel"}`}>2</span>
              Project Details
            </span>
          </div>

          {step === 1 ? (
            <div className="mt-6 space-y-5">
              <div>
                <Label htmlFor="cfg-product">Product</Label>
                <Input id="cfg-product" value={product.name} readOnly className="mt-1.5 bg-muted" />
              </div>

              <div>
                <Label>Colour</Label>
                <div className="mt-2 flex flex-wrap gap-3" role="group" aria-label="Select panel colour">
                  {product.colourOptions.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColour(c.name)}
                      aria-pressed={colour === c.name}
                      aria-label={c.name}
                      title={c.name}
                      className={`relative size-10 rounded-full border-2 transition ${
                        colour === c.name ? "border-accent ring-2 ring-accent/30" : "border-border-grey"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {colour === c.name && (
                        <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-steel">Selected: {colour}.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="cfg-thickness">Thickness</Label>
                  <Select value={thickness} onValueChange={setThickness}>
                    <SelectTrigger id="cfg-thickness" className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.thicknessOptions.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cfg-length">Panel Length (m)</Label>
                  <Input id="cfg-length" type="number" min="0" value={length} onChange={(e) => setLength(e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="cfg-qty">Quantity (Panels)</Label>
                  <Input id="cfg-qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="cfg-surface">Substrate / Surface</Label>
                  <Select value={surfaceMaterial} onValueChange={setSurfaceMaterial}>
                    <SelectTrigger id="cfg-surface" className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.surfaceMaterialOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="cfg-area">Estimated Area</Label>
                <Input
                  id="cfg-area"
                  readOnly
                  value={estimatedArea.sqft > 0 ? `${Math.round(estimatedArea.sqft).toLocaleString("en-IN")} sq ft (${estimatedArea.sqm.toFixed(1)} sq m)` : "-"}
                  className="mt-1.5 bg-muted"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="border-accent text-accent hover:bg-accent hover:text-white"
              >
                Next: Project Details <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-4 flex items-center gap-1.5 text-sm font-medium text-steel hover:text-accent"
              >
                <ArrowLeft className="size-4" aria-hidden="true" /> Back to Product Requirements
              </button>
              <EnquiryForm prefill={prefill} productLocked />
            </div>
          )}
        </div>

        {/* RIGHT: Summary */}
        <div className="h-fit rounded-xl bg-surface p-5">
          <h4 className="font-semibold text-charcoal">Configuration Summary</h4>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-border-grey bg-white p-3">
            <div className="size-12 shrink-0 rounded-md border border-border-grey" style={{ backgroundColor: selectedSwatch.hex }} aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-charcoal">{colour}</p>
              <p className="text-steel">Panel preview colour</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-steel">Product</dt><dd className="text-right font-medium text-charcoal">{product.shortName}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-steel">Thickness</dt><dd className="font-medium text-charcoal">{thickness}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-steel">Length</dt><dd className="font-medium text-charcoal">{length || "-"} m</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-steel">Quantity</dt><dd className="font-medium text-charcoal">{quantity || "-"}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-steel">Estimated Area</dt><dd className="font-medium text-charcoal">{estimatedArea.sqft > 0 ? `${Math.round(estimatedArea.sqft).toLocaleString("en-IN")} sq ft` : "-"}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-steel">Colour</dt><dd className="font-medium text-charcoal">{colour}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-steel">Substrate</dt><dd className="text-right font-medium text-charcoal">{surfaceMaterial}</dd></div>
          </dl>
          <Button onClick={() => setDialogOpen(true)} className="mt-5 w-full bg-accent hover:bg-[#D94716]">
            Request a Quote <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <EnquiryDialog open={dialogOpen} onOpenChange={setDialogOpen} prefill={prefill} />
    </div>
  )
}
