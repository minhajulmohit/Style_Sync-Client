import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeleteServiceButton() {
  return (
    <Button type="button" variant="destructive" className="h-10 rounded-xl">
      <Trash2 aria-hidden="true" />
      Delete
    </Button>
  )
}
