# Telemedicine Website — Agent Guide

## Quick start

```bash
pnpm install        # pnpm@8.15.6 required, Node >=20
pnpm dev            # turbo dev → runs backend + frontend concurrently
pnpm build          # turbo build
pnpm lint           # prettier --write + eslint on both apps
```

## Monorepo structure

pnpm workspace (`apps/*`) orchestrated by Turborepo.

The frontend runs on React 19: the App Router uses the React that Next 16 bundles, even though `package.json` still lists `react@18`. Pick React-19-compatible libraries.

| Package  | Path            | Entry                           | Type                         |
| -------- | --------------- | ------------------------------- | ---------------------------- |
| backend  | `apps/backend`  | `src/index.js`                  | Express + Mongoose, CommonJS |
| frontend | `apps/frontend` | Next.js App Router (`src/app/`) | React 19, JavaScript (JSX)   |

## Focused commands

```bash
pnpm -F=backend dev              # nodemon backend only
pnpm -F=frontend dev             # Next.js dev server only
pnpm -F=backend lint             # eslint src/**/*.js -f pretty
pnpm -F=frontend lint            # eslint src/**/*.jsx -f pretty
pnpm -F=backend seed:all         # every seeder in dependency order (docs/seeding.md); deletes doctors, patients, consultations
pnpm -F=backend seed:doctor      # individual seeders
pnpm -F=backend seed:patient
pnpm -F=backend seed:consultation
pnpm -F=backend seed:embeddings  # AI search vectors (calls Gemini)
pnpm -F=backend seed:admin       # creates ADMIN_EMAIL in Clerk + MongoDB
pnpm -F=backend seed:logins      # demo doctor/patient accounts in Clerk + MongoDB (needs DEMO_* env)
pnpm start                       # turbo start (production-like)
```

Backend production: `pm2 start ecosystem.config.json --no-daemon`

## Required env files

Copy from `.env.example` in each app directory. `docs/configuration.md` explains the services and which values must match across apps.

- **backend**: `MONGODB_URL`, `CLOUDINARY_*`, `LIVEKIT_*`, `GEMINI_API_KEY`, `WEB_FRONTEND_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLERK_SECRET_KEY` (optional `CLERK_JWT_KEY` for networkless token verification; optional `AI_MESSAGES_PER_HOUR`, default 30; optional `DEMO_DOCTOR_EMAIL`, `DEMO_PATIENT_EMAIL`, `DEMO_PASSWORD` for demo mode)
- **frontend**: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_V1_URL`, `NEXT_PUBLIC_LIVEKIT_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (same Clerk application as the backend), `GEMINI_API_KEY` (used server-side by `src/app/api/ai/*` routes), optional `NEXT_PUBLIC_DEMO_MODE` + `NEXT_PUBLIC_DEMO_*` (demo logins on auth pages — see `docs/demo-mode.md`)

## Linting & formatting

Pre-commit (husky): `pnpm lint-staged` — runs prettier + eslint on staged `.js` / `.jsx`.

`.prettierrc` uses semicolons and double quotes.

- Backend: ESLint 9 flat config (`eslint.config.mjs`), `no-unused-vars: warn`, `no-undef: warn`
- Frontend: ESLint 8 legacy (`react-app` preset), `no-unused-vars: error` with `_` prefix exemption, `react-hooks/exhaustive-deps: off`

## Architecture notes

- API base: `/v1/*` (routes: auth, doctor, patient, consultation, livekit, payment, admin)
- Auth: Clerk (`@clerk/nextjs` v7 / Core 3) on frontend, `@clerk/backend` on backend
  - Sign-in/sign-up use Clerk's prebuilt `<SignIn>`/`<SignUp>` in `src/app/auth/{login,register}/[[...]]` catch-all routes; `src/proxy.js` (Next 16 middleware) protects `/patient`, `/doctor`, `/admin`, `/consultation`
  - The axios interceptor (`src/lib/axiosAuth.js`) attaches a fresh Clerk session token as the `authtoken` header; backend `middlewares/auth.js` verifies it and sets `req.user = { uid, email }`
  - Roles live in MongoDB, not Clerk. `/auth/login-user` creates the MongoDB user on first sign-in using the role set by the sign-up page (`unsafeMetadata.role`): `/auth/register` → patient, `/auth/register/doctor` → doctor (admins are seeded)
- Real-time chat: LiveKit room (`useChat`, `useRemoteParticipants`, `useDataChannel("consultation")` for the "ended" signal) in `features/consultation/Chat/ConsultationRoom.jsx`; no Socket.io. Consultation status cron jobs live in backend `src/jobs/consultationCron.js`
- Video calls: LiveKit (backend SDK + frontend `@livekit/components-react`)
- AI assistant: Gemini via the Vercel AI SDK in Next route handlers (`src/app/api/ai/*`); the backend builds RAG embeddings with LangChain (`services/medicalEmbedding.service.js`). The routes require a Clerk session, build the system prompt server-side (`src/lib/aiSystemPrompt.js`), and count each call against a per-user hourly limit kept by the backend (`POST /v1/patient/ai-usage`). See `docs/ai-assistant.md`
- Profile updates: `PATCH /v1/doctor/:id` and `/v1/patient/:id` only accept the caller's own id, and Joi schemas in `src/validations/` list the fields a user may change (anything else, such as `approvalStatus`, is rejected)
- State: Redux Toolkit (`userReducer`, `searchReducer`)
- Data fetching: TanStack React Query
- Forms: React Hook Form + Zod
- UI: Tailwind CSS + shadcn/ui + ReactBits for animation (`rsc: false`, `tsx: false`)
- Image hosts allowed in `next.config.ts`: `res.cloudinary.com`, `images.unsplash.com`
- Site name, description and theme colour live in `apps/frontend/src/site.config.js`; the web app manifest is generated by `src/app/manifest.js` from it. `docs/branding.md` lists every file to change to rebrand

## No test framework

There is no Jest, Vitest, or any test runner configured. Do not assume tests exist or run any test command.

## Deployment

- Frontend: Netlify (`netlify.toml` uses `@netlify/plugin-nextjs`)
- Backend: Render.com (via pm2)

## Stripe Payment

- Payment is handled via Stripe Checkout (hosted page) — no frontend card elements needed
- Flow: booking form → VerifyData (shows price) → redirect to Stripe → return to `/payment/success`, which calls `POST /v1/payment/confirm-payment` (checks the session with Stripe and creates the consultation). The webhook does the same if the tab was closed; `fulfillPayment` runs once per payment
- Backend endpoint: `POST /v1/payment/webhook` (raw body, registered before `express.json()`)
- Free consultations (`price <= 0`) skip payment entirely
- **Required env vars**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (backend `.env`). The frontend's `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is unused unless you add Stripe Elements
- Full guide: `docs/payments.md`

### Testing locally

You need the Stripe CLI running in a **separate terminal** alongside the dev server:

```bash
# terminal 1 — run the app
pnpm dev

# terminal 2 — forward Stripe events to local backend
stripe listen --forward-to localhost:8000/v1/payment/webhook
```

Use test card `4242 4242 4242 4242` (any future expiry, any CVC) in Stripe Checkout.
