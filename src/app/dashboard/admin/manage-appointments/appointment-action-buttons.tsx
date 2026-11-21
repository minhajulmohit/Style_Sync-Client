"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  updateAppointmentStatus,
  type AppointmentStatusUpdate,
} from "@/lib/actions/admin-appointments";

type AppointmentActionButtonsProps = {
  bookingId: string;
  status: string;
};

export function AppointmentActionButtons({
  bookingId,
  status,
}: AppointmentActionButtonsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] =
    useState<AppointmentStatusUpdate | null>(null);

  const handleUpdate = async (newStatus: AppointmentStatusUpdate) => {
    setLoadingAction(newStatus);

    try {
      const result = await updateAppointmentStatus(bookingId, newStatus);

      if (result.ok) {
        toast.add({
          type: "success",
          title:
            newStatus === "Confirmed"
              ? "Appointment confirmed"
              : "Appointment cancelled",
          description: result.message,
        });
        router.refresh();
      } else {
        toast.add({
          type: "error",
          title: "Could not update appointment",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Appointment update failed:", error);
      toast.add({
        type: "error",
        title: "Could not update appointment",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const isBusy = loadingAction !== null;

  return (
    <div className="flex items-center gap-2">
      {/* শুধু Pending appointment confirm করা যাবে */}
      {status === "Pending" && (
        <Button
          type="button"
          size="sm"
          disabled={isBusy}
          aria-busy={loadingAction === "Confirmed"}
          onClick={() => handleUpdate("Confirmed")}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {loadingAction === "Confirmed" ? (
            <LoaderCircle aria-hidden="true" size={14} className="animate-spin" />
          ) : (
            <Check aria-hidden="true" size={14} />
          )}
          {loadingAction === "Confirmed" ? "Confirming..." : "Confirm"}
        </Button>
      )}

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isBusy}
        aria-busy={loadingAction === "Cancelled"}
        onClick={() => handleUpdate("Cancelled")}
        className="inline-flex items-center gap-1 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50"
      >
        {loadingAction === "Cancelled" ? (
          <LoaderCircle aria-hidden="true" size={14} className="animate-spin" />
        ) : (
          <X aria-hidden="true" size={14} />
        )}
        {loadingAction === "Cancelled" ? "Cancelling..." : "Cancel"}
      </Button>
    </div>
  );
}
