"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function ConfirmAppointmentButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" size={14} className="animate-spin" />
      ) : (
        <Check aria-hidden="true" size={14} />
      )}
      {pending ? "Confirming..." : "Confirm"}
    </Button>
  );
}
