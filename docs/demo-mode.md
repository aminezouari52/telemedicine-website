# Demo mode

Demo mode adds two fixed login accounts (a doctor and a patient) and shows them, with copy buttons, on the sign-in and sign-up pages. It's meant for a public demo deployment. **It is off by default:** if you don't set the variables below, nothing demo-related appears or gets seeded.

## Turning it on

1. In `apps/backend/.env`, set `DEMO_DOCTOR_EMAIL`, `DEMO_PATIENT_EMAIL` and `DEMO_PASSWORD`. Pick a password that isn't in a public breach list, or Clerk forces a reset at sign-in.
2. Create the accounts in Clerk and MongoDB:

   ```bash
   pnpm -F=backend seed:logins
   ```

   `seed:all` runs this step for you when the variables are set. If you reseed doctors later, run `seed:logins` again, because `seed:doctor` deletes the demo doctor. See [Sample data](seeding.md).

3. In `apps/frontend/.env` (and your frontend host's environment variables), set `NEXT_PUBLIC_DEMO_MODE=true` and `NEXT_PUBLIC_DEMO_DOCTOR_EMAIL`, `NEXT_PUBLIC_DEMO_PATIENT_EMAIL`, `NEXT_PUBLIC_DEMO_PASSWORD` to the same values. `NEXT_PUBLIC_*` values are built into the frontend, so rebuild after changing them.

## Removing the demo

To turn it off, leave the variables unset. To delete the code entirely:

1. Delete `apps/frontend/src/components/demo/DemoCredentials.jsx`.
2. In `apps/frontend/src/components/layout/AuthLayout.jsx`, delete the `DemoCredentials` import and the `<DemoCredentials />` line.
3. Delete `apps/backend/src/seeders/loginAccounts.seeder.js`, the `seed:logins` script in `apps/backend/package.json`, and the `seed:logins` step in `apps/backend/src/seeders/all.seeder.js`.
4. Remove the `DEMO_*` keys from `apps/backend/src/config/config.js` (schema and the `demo` block), the `demoPatientEmail` lines in `apps/backend/src/seeders/patient.seeder.js`, and the demo sections of both `.env.example` files.
5. If you ran `seed:logins` before, delete the two demo users in the Clerk dashboard.

Step 4 is optional: with the variables unset, that code does nothing.
