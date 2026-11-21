# StyleSync - Salon Service Booking Platform

\*\*StyleSync\*\* is a full-stack, fully responsive web application designed to streamline appointment scheduling for salons and beauty parlors. Built using \*\*Next.js (App Router)\*\*, \*\*Express.js\*\*, \*\*MongoDB\*\*, \*\*Better Auth\*\*, and \*\*Stripe\*\*, the platform connects customers with professional salon services seamlessly while providing administrators with a powerful dashboard to manage services, bookings, users, and financial transactions in real time.

## Important Features

\### 👤 Customer Features \* \*\*Service Discovery:\*\* Explore salon services categorized by styling, skincare, coloring, and treatment, with live search, category filtering, and price sorting. \* \*\*Hassle-Free Booking:\*\* Interactive appointment request system allowing users to select dates, predefined time slots, and add custom notes. \* \*\*Appointment Tracking:\*\* Real-time dashboard to monitor booking status (\`Pending\`, \`Confirmed\`, \`Cancelled\`) and cancel pending requests. \* \*\*Secure Online Payments:\*\* Seamless integration with \*\*Stripe Checkout\*\* for fast and secure payments once appointments are confirmed. \* \*\*Personal Profile:\*\* Easily manage user details and update profile pictures via \*\*ImgBB API\*\*. ### 🛠️ Admin Control &amp; Dashboard \* \*\*Analytics Overview:\*\* High-level overview displaying total customers, active services, appointment metrics, and overall revenue. \* \*\*Service Management (CRUD):\*\* Add, update, delete, and toggle status (\`Active\`/\`Inactive\`) of salon services with strict payload validation. \* \*\*Appointment Workflow:\*\* Review incoming appointment requests and approve (\`Confirmed\`) or decline (\`Cancelled\`) bookings. \* \*\*User Oversight &amp; Security:\*\* View all registered customers with server-enforced \*\*Block/Unblock\*\* security controls. \* \*\*Financial Ledger:\*\* Immutable transaction tracking synced automatically via verified \*\*Stripe Webhooks\*\*.

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
