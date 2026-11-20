"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
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
import { deleteService } from "@/lib/actions/services";

export function DeleteServiceButton({
  serviceId,
  serviceName,
  onDeleted,
}: {
  serviceId: string;
  serviceName: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteService(serviceId);
      if (onDeleted) {
        setIsOpen(false);
        onDeleted();
      } else {
        router.push("/dashboard/admin/manage-services");
        router.refresh();
      }
    } catch (error) {
      console.error("Could not delete service:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not delete this service. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isDeleting) {
          setIsOpen(open);
          if (!open) setErrorMessage("");
        }
      }}
    >
      <Button
        type="button"
        variant="destructive"
        className="h-10 rounded-xl"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 aria-hidden="true" />
        Delete
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this service?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {serviceName}. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          >
            {errorMessage}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete service"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
