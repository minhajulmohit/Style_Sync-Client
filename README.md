# StyleSync Client

StyleSync is a salon booking application built with Next.js, React, TypeScript,
Tailwind CSS, Better Auth, and Stripe.

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The client runs at `http://localhost:3000` by default. The Express API runs
separately from the `stylesync-server` repository.

## Environment variables

Set these in a local `.env.local` file. Do not commit credentials.

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_URL` | Base URL for the Better Auth API |
| `BETTER_AUTH_SECRET` | Better Auth session and token signing secret |
| `MONGODB_URL` | MongoDB connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Express API |
| `NEXT_PUBLIC_APP_URL` | Public URL of the Next.js app, for example `https://stylesyncclient.vercel.app` |
| `IMAGEBB_API` | Server-side ImgBB image-upload API key |
| `STRIPE_SECRET_KEY` | Server-side Stripe API secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

`NEXT_PUBLIC_` variables are available to browser code. Do not put secret
credentials behind that prefix. Older local configurations using
`NEXT_PUBLIC_IMAGEBB_API` remain supported server-side; rename that key to
`IMAGEBB_API` and rotate it if it was previously exposed in a browser bundle.

## Main routes

- `/` — home page, service categories, and featured services
- `/services` — service search, category filter, and price sorting
- `/services/[id]` — service details and booking
- `/signin` and `/signup` — email/password and Google authentication
- `/dashboard/customer` — customer dashboard and appointments
- `/dashboard/admin` — admin dashboard and management pages
- `/success` — Stripe checkout result

## Checks

```bash
npm run lint
npm run build
```
