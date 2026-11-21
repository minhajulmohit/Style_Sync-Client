# SalonBook - Salon Service Booking Platform

The client-side salon booking application for Assignment 9. The current
application UI is branded as StyleSync.

## Important Features

- **Public:** Responsive design, dynamic hero statistics, featured services,
  category filters, search, and sorting.
- **Customer dashboard:** Overview, appointment history, cancellation of
  pending bookings, and Stripe Checkout for confirmed appointments.
- **Admin dashboard:** Analytics overview, service CRUD with ImgBB image
  uploads, appointment status management, customer block/unblock, and a
  transactions ledger.

## Technology Stack

![Next.js App Router](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000?logo=shadcnui)
![Better Auth Client](https://img.shields.io/badge/Better_Auth-client-333333)
![Lucide Icons](https://img.shields.io/badge/Lucide-icons-f67373)
![ImgBB API](https://img.shields.io/badge/ImgBB-image_upload-4b9ce2)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635bff?logo=stripe)

## Installation Instructions

```bash
git clone https://github.com/minhajulmohit/Style_Sync-Client.git
cd Style_Sync-Client
npm install
```

Create `.env.local` and add the environment variable names listed below.
Never commit secret values.

## How to Run the Project Locally

Start the server in a separate terminal first, then start the client:

```bash
npm run dev
```

The client runs at `http://localhost:3000`. The local API defaults to
`http://localhost:8000`.

## Required Environment Variables

Core:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `MONGODB_URL`
- `API_JWT_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`

Feature-dependent:

- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `IMAGEBB_API`

## Live Website Link

[StyleSync Client](https://stylesyncclient.vercel.app)

## Client and Server Repository Links

- Client: [Style_Sync-Client](https://github.com/minhajulmohit/Style_Sync-Client)
- Server: [Style_Sync-Server](https://github.com/minhajulmohit/Style_Sync-Server)
