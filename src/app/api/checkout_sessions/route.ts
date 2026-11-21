import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type CheckoutBooking = {
  _id: string;
  userId: string;
  serviceId: string;
  serviceName?: string;
  servicePrice?: number;
  status: string;
  paymentStatus: string;
};

type CheckoutService = {
  serviceName: string;
  price: number;
};

export async function POST(request: Request) {
  try {
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authSession?.session.token) {
      return NextResponse.redirect(new URL("/signin", request.url), 303);
    }

    const userRole = authSession.user.role?.toLowerCase();
    if (userRole !== "customer" && userRole !== "user") {
      return NextResponse.json(
        { error: "Only customers can pay for appointments." },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const bookingId = formData.get("bookingId");

    if (typeof bookingId !== "string" || !bookingId) {
      return NextResponse.json(
        { error: "An appointment is required for checkout." },
        { status: 400 },
      );
    }

    const authorization = {
      authorization: `Bearer ${authSession.session.token}`,
    };
    const bookingsResponse = await fetch(`${baseUrl}/bookings`, {
      headers: authorization,
      cache: "no-store",
    });

    if (!bookingsResponse.ok) {
      return NextResponse.json(
        { error: "Could not verify this appointment." },
        { status: bookingsResponse.status },
      );
    }

    const bookings: CheckoutBooking[] = await bookingsResponse.json();
    const booking = bookings.find(
      (item) =>
        item._id === bookingId &&
        item.userId === authSession.user.id &&
        item.status === "Confirmed" &&
        item.paymentStatus === "Unpaid",
    );

    if (!booking) {
      return NextResponse.json(
        { error: "This confirmed unpaid appointment was not found." },
        { status: 404 },
      );
    }

    let serviceName = booking.serviceName;
    let servicePrice = booking.servicePrice;

    if (servicePrice === undefined) {
      const serviceResponse = await fetch(
        `${baseUrl}/services/${encodeURIComponent(booking.serviceId)}`,
        { cache: "no-store" },
      );

      if (!serviceResponse.ok) {
        return NextResponse.json(
          { error: "Could not load the appointment service." },
          { status: serviceResponse.status },
        );
      }

      const service: CheckoutService = await serviceResponse.json();
      serviceName = service.serviceName;
      servicePrice = service.price;
    }

    if (
      typeof servicePrice !== "number" ||
      !Number.isFinite(servicePrice) ||
      servicePrice <= 0
    ) {
      return NextResponse.json(
        { error: "The service price is invalid." },
        { status: 422 },
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      new URL(request.url).origin;
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: authSession.user.email,
      client_reference_id: bookingId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: serviceName || "Salon service" },
            unit_amount: Math.round(servicePrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId,
        userId: authSession.user.id,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/success?cancelled=1`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.redirect(checkoutSession.url, 303);
  } catch (error) {
    console.error("Could not create Stripe checkout session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start the payment.",
      },
      { status: 500 },
    );
  }
}
