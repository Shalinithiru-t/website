import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import EnquiryForm, { type EnquiryPrefill } from "@/components/shared/EnquiryForm"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefill?: EnquiryPrefill
}

export default function EnquiryDialog({ open, onOpenChange, prefill }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const title = "Get a Product Quote"
  const description = "Share your requirement and our technical sales team will get in touch within one business day."

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <EnquiryForm prefill={prefill} productLocked />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-2xl px-5 pb-8">
        <SheetHeader className="px-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <EnquiryForm prefill={prefill} productLocked />
      </SheetContent>
    </Sheet>
  )
}
