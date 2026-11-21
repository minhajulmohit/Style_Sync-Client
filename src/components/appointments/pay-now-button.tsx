"use client";

import { useState } from "react";
import { CreditCard, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type PayNowButtonProps = {
  bookingId: string;
};

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export function PayNowButton({ bookingId }: PayNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("bookingId", bookingId);

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        body: formData,
      });

      let data: CheckoutResponse = {};
      try {
        data = await response.json();
      } catch {
        // JSON না আসলে নিচের default error দেখাবে
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not start the payment.");
      }

      // Stripe Checkout page এ পাঠাই (loader চলতে থাকবে)
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment start failed:", error);
      toast.add({
        type: "error",
        title: "Payment failed to start",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={isLoading}
      aria-busy={isLoading}
      onClick={handlePay}
      className="h-9 rounded-xl bg-[#e45c78] text-white hover:bg-[#d64f70]"
    >
      {isLoading ? (
        <LoaderCircle aria-hidden="true" className="animate-spin" />
      ) : (
        <CreditCard aria-hidden="true" />
      )}
      {isLoading ? "Processing..." : "Pay Now"}
    </Button>
  );
}
