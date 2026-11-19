import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UpdateServiceButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 rounded-xl border-rose-100 text-[#d95272] hover:bg-rose-50"
    >
      <Pencil aria-hidden="true" />
      Update
    </Button>
  )
}
