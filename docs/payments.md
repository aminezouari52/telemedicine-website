# Payments

Patients pay for consultations through [Stripe Checkout](https://stripe.com/payments/checkout), a payment page hosted by Stripe. The app never handles card details, so the frontend needs no Stripe keys.

## How a booking is paid

1. The patient picks a doctor and a time slot, then confirms the price.
2. The backend creates a Checkout session (`POST /v1/payment/create-checkout-session`) and the patient is sent to Stripe's payment page.
3. After paying, Stripe sends the patient back to `/payment/success`. That page asks the backend to check the session with Stripe (`POST /v1/payment/confirm-payment`), and the backend creates the consultation.
4. Stripe also calls the backend's webhook (`POST /v1/payment/webhook`). This creates the consultation if the patient closed the tab before step 3, and marks expired or failed sessions as failed.

Steps 3 and 4 can both run for the same payment. Only the first one creates the consultation.

If a doctor has no price set, or a price of 0, the booking skips Stripe and the consultation is created straight away.

Prices are charged in US dollars. To change the currency, edit `currency` in `apps/backend/src/services/payment.service.js`.

## Setup

1. In the Stripe dashboard, copy your secret key into `STRIPE_SECRET_KEY` in `apps/backend/.env`. Use a test-mode key (`sk_test_…`) while developing.
2. Set `STRIPE_WEBHOOK_SECRET`:
   - **Locally**, use the secret that the Stripe CLI prints (see below).
   - **In production**, add a webhook endpoint in the Stripe dashboard pointing at `https://<your-backend>/v1/payment/webhook`. Subscribe it to `checkout.session.completed`, `checkout.session.expired` and `checkout.session.async_payment_failed`, then copy its signing secret.
3. Check that `WEB_FRONTEND_URL` is right, because Stripe redirects there after payment. See [Configuration](configuration.md#web_frontend_url-affects-sign-in-and-payments).

## Testing locally

Run the Stripe CLI in a second terminal, next to `pnpm dev`, to forward webhook events to your local backend:

```bash
stripe listen --forward-to localhost:8000/v1/payment/webhook
```

It prints a webhook signing secret (`whsec_…`). Put it in `STRIPE_WEBHOOK_SECRET` and restart the backend.

On the Checkout page, pay with the test card `4242 4242 4242 4242`, any future expiry date and any CVC.

Without the CLI, payments still work as long as the patient reaches the success page, but abandoned sessions are never marked as failed.

## The webhook needs the raw request body

Stripe signs each webhook request, and the backend checks that signature against the exact bytes Stripe sent. That's why `apps/backend/src/app.js` registers the webhook route with `express.raw()` **before** `app.use(express.json())`. If the JSON parser runs first, the body is no longer the original bytes and every webhook fails signature verification. Keep that order if you add middleware.
