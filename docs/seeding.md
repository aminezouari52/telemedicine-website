# Sample data

The backend has seed scripts that fill the database with fake doctors, patients, consultations and payments, so every page has something to show.

> **The seeders delete data.** `seed:doctor` deletes every doctor, `seed:patient` every patient, and `seed:consultation` every consultation and payment. Never run them against a production database with real users.

## Seed everything

```bash
pnpm -F=backend seed:all
```

This runs the seeders below in the right order. It skips `seed:logins` when the `DEMO_*` variables are unset, and `seed:admin` when `ADMIN_EMAIL` or `ADMIN_PASSWORD` is unset. It stops at the first seeder that fails.

The backend dev server can keep running while you seed.

## The seeders

They run in this order, because each one needs data from the steps before it:

| Script              | Creates                                                                                  | Deletes first                  | Needs                                                      |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| `seed:doctor`       | 20 approved doctors with complete profiles                                               | Every doctor                   | Nothing                                                    |
| `seed:patient`      | 20 patients with medical profiles. The first one gets `DEMO_PATIENT_EMAIL` when it's set | Every patient                  | Nothing                                                    |
| `seed:logins`       | The demo doctor and patient, in Clerk and MongoDB ([Demo mode](demo-mode.md))            | Nothing; updates them in place | `DEMO_DOCTOR_EMAIL`, `DEMO_PATIENT_EMAIL`, `DEMO_PASSWORD` |
| `seed:admin`        | The admin account, in Clerk and MongoDB                                                  | The admin's own MongoDB record | `ADMIN_EMAIL`, `ADMIN_PASSWORD`                            |
| `seed:consultation` | 4,000 paid consultations from the past nine months to two months ahead                   | Every consultation and payment | At least one doctor and one patient                        |
| `seed:embeddings`   | AI search data for every patient and the 100 most recent consultations                   | All AI search data             | Patients, consultations and a working `GEMINI_API_KEY`     |

Why the order matters:

- `seed:doctor` deletes the demo doctor along with the others, so `seed:logins` has to run after it.
- `seed:consultation` only uses doctors and patients that already exist, so it runs after the accounts are created. Running it after `seed:logins` gives the demo doctor and patient their own consultation history.
- `seed:embeddings` reads patients and consultations, so it runs last. It calls the Gemini API about 120 times, one call at a time. If it fails on a rate limit, run it again on its own.

## Who can sign in

Only the accounts from `seed:logins` and `seed:admin` can sign in, because only they are created in Clerk. The other seeded doctors and patients exist only in MongoDB, so they appear in lists and consultations but have no login.

To sign in as a doctor or patient without demo mode, register through the app. New doctors must be approved by an admin before patients can book them.
