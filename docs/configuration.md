# Configuration

Each app reads its settings from a `.env` file. Copy `apps/backend/.env.example` to `apps/backend/.env` and `apps/frontend/.env.example` to `apps/frontend/.env`, then fill in the values. Both example files have a comment on every variable.

The backend checks its variables at startup. If a required one is missing, it stops with an error that names it.

## Required services

| Service                                  | Used for                                             | Variables                                                           |
| ---------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| [MongoDB](https://www.mongodb.com/atlas) | Database. Atlas is needed for the AI's vector search | `MONGODB_URL`                                                       |
| [Clerk](https://clerk.com)               | Sign-in and sign-up                                  | `CLERK_SECRET_KEY` (both apps), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |

With only these two, the app runs: patients can find doctors and book consultations, and doctors and admins can use their dashboards.

## Optional services

Each optional service turns its feature on once all of its variables are set. There is no separate on/off switch: leave a service's variables unset, or empty, to run without it.

| Service                                      | Used for                                    | Variables                                                              | When it's not set                                           |
| -------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Stripe](https://stripe.com)                 | Paying for consultations                    | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`                           | Every consultation is booked for free                       |
| [LiveKit](https://livekit.io)                | Video calls and consultation chat           | `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `NEXT_PUBLIC_LIVEKIT_URL`     | The consultation room says video isn't set up               |
| [Cloudinary](https://cloudinary.com)         | Doctor profile photos                       | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Doctors can't upload a photo                                |
| [Google Gemini](https://aistudio.google.com) | AI assistant and medical-history embeddings | `GEMINI_API_KEY` (both apps)                                           | The AI assistant is hidden and `seed:embeddings` is skipped |

All of them can be used for free during development (Stripe in test mode).

Setting only some of a service's backend variables, such as `STRIPE_SECRET_KEY` without `STRIPE_WEBHOOK_SECRET`, stops the backend at startup with an error that names the missing one. At startup the backend also logs which optional services are off. The frontend reads the same list from `GET /v1/features`.

Turning payments off makes every booking free, whatever price a doctor has set. Don't leave Stripe unset in production if you charge for consultations.

## Values that must match across the two apps

- **Clerk:** both apps must use keys from the same Clerk application.
- **Gemini:** set `GEMINI_API_KEY` in both, or in neither. The frontend uses it for the chat, the backend for embeddings.
- **LiveKit:** set `NEXT_PUBLIC_LIVEKIT_URL` in the frontend whenever the backend has `LIVEKIT_*` keys.
- **Backend URL:** `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_V1_URL` point at the backend. Locally that's `http://localhost:8000`, the backend's default `PORT`. The AI chat also calls the backend from the server to count each user's messages, so if this URL is wrong the assistant refuses every message.
- **Demo accounts:** the frontend's `NEXT_PUBLIC_DEMO_*` values must equal the backend's `DEMO_*` values. See [Demo mode](demo-mode.md).

## `WEB_FRONTEND_URL` affects sign-in and payments

The backend's `WEB_FRONTEND_URL` is the frontend's origin, such as `http://localhost:3000` locally or `https://your-app.netlify.app` in production. Write it without a trailing slash. Two features depend on it:

- **Sign-in.** The backend only accepts Clerk session tokens issued for this origin. If it's wrong, every API call fails with 401 Unauthorized after a successful sign-in.
- **Payments.** Stripe Checkout sends the patient back to `WEB_FRONTEND_URL/payment/success` after paying, or to the booking page after cancelling. If it's wrong, the patient lands on a broken page after paying.

When you deploy the frontend to a new domain, update `WEB_FRONTEND_URL` on the backend too.

## Frontend variables are fixed at build time

Next.js copies every `NEXT_PUBLIC_*` value into the frontend code when it builds. After you change one, restart `pnpm dev` or rebuild the production site.
