"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [confirmationAction, setConfirmationAction] =
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
      setConfirmationAction(null);
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
          onClick={() => setConfirmationAction("Confirmed")}
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
        onClick={() => setConfirmationAction("Cancelled")}
        className="inline-flex items-center gap-1 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50"
      >
        {loadingAction === "Cancelled" ? (
          <LoaderCircle aria-hidden="true" size={14} className="animate-spin" />
        ) : (
          <X aria-hidden="true" size={14} />
        )}
        {loadingAction === "Cancelled" ? "Cancelling..." : "Cancel"}
      </Button>

      <AlertDialog
        open={confirmationAction !== null}
        onOpenChange={(open) => {
          if (!isBusy && !open) {
            setConfirmationAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmationAction === "Confirmed"
                ? "Confirm this appointment?"
                : "Cancel this appointment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationAction === "Confirmed"
                ? "This will confirm the customer's appointment request."
                : "This will cancel the appointment. The customer will be notified of the updated status."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>Go back</AlertDialogCancel>
            <Button
              type="button"
              variant={
                confirmationAction === "Cancelled" ? "destructive" : "default"
              }
              disabled={isBusy}
              onClick={() => {
                if (confirmationAction) {
                  void handleUpdate(confirmationAction);
                }
              }}
            >
              {isBusy
                ? loadingAction === "Confirmed"
                  ? "Confirming..."
                  : "Cancelling..."
                : confirmationAction === "Confirmed"
                  ? "Confirm appointment"
                  : "Cancel appointment"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
