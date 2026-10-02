# Configuration

Each app reads its settings from a `.env` file. Copy `apps/backend/.env.example` to `apps/backend/.env` and `apps/frontend/.env.example` to `apps/frontend/.env`, then fill in the values. Both example files have a comment on every variable.

The backend checks its variables at startup. If one is missing, it stops with an error that names it.

## Services you need

| Service                                      | Used for                                             | Variables                                                              |
| -------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| [MongoDB](https://www.mongodb.com/atlas)     | Database. Atlas is needed for the AI's vector search | `MONGODB_URL`                                                          |
| [Clerk](https://clerk.com)                   | Sign-in and sign-up                                  | `CLERK_SECRET_KEY` (both apps), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`    |
| [Cloudinary](https://cloudinary.com)         | Doctor profile photos                                | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| [LiveKit](https://livekit.io)                | Video calls and consultation chat                    | `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `NEXT_PUBLIC_LIVEKIT_URL`     |
| [Google Gemini](https://aistudio.google.com) | AI assistant and medical-history embeddings          | `GEMINI_API_KEY` (both apps)                                           |
| [Stripe](https://stripe.com)                 | Paying for consultations                             | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`                           |

All six can be used for free during development (Stripe in test mode).

## Values that must match across the two apps

- **Clerk:** both apps must use keys from the same Clerk application.
- **Gemini:** set `GEMINI_API_KEY` in both. The frontend uses it for the chat, the backend for embeddings.
- **Backend URL:** `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_V1_URL` point at the backend. Locally that's `http://localhost:8000`, the backend's default `PORT`.
- **Demo accounts:** the frontend's `NEXT_PUBLIC_DEMO_*` values must equal the backend's `DEMO_*` values. See [Demo mode](demo-mode.md).

## `WEB_FRONTEND_URL` affects sign-in and payments

The backend's `WEB_FRONTEND_URL` is the frontend's origin, such as `http://localhost:3000` locally or `https://your-app.netlify.app` in production. Write it without a trailing slash. Two features depend on it:

- **Sign-in.** The backend only accepts Clerk session tokens issued for this origin. If it's wrong, every API call fails with 401 Unauthorized after a successful sign-in.
- **Payments.** Stripe Checkout sends the patient back to `WEB_FRONTEND_URL/payment/success` after paying, or to the booking page after cancelling. If it's wrong, the patient lands on a broken page after paying.

When you deploy the frontend to a new domain, update `WEB_FRONTEND_URL` on the backend too.

## Frontend variables are fixed at build time

Next.js copies every `NEXT_PUBLIC_*` value into the frontend code when it builds. After you change one, restart `pnpm dev` or rebuild the production site.
