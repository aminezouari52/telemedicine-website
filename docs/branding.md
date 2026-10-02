# Branding checklist

Everything you change to put your own name, logo and colours on the app. Paths are relative to `apps/frontend` unless they say otherwise.

## 1. Name and description

Edit `src/site.config.js`. It sets:

- `name`: shown in browser tab titles (`<page title> | <name>`), the footer copyright line and the logo's alt text.
- `shortName`: the label under the app icon when someone installs the site on a phone.
- `title`: the home page title.
- `description`: the text search engines show under your link.
- `themeColor` and `backgroundColor`: the browser and installed-app colours.

The web app manifest (`src/app/manifest.js`) reads these values, so you don't edit it.

## 2. Logo and images

Replace these files and keep the same file names. You don't need to change any code.

| File                          | Where it appears                           | Current size | Notes                                                                            |
| ----------------------------- | ------------------------------------------ | ------------ | -------------------------------------------------------------------------------- |
| `public/assets/logo.png`      | Headers and the sign-in and sign-up forms  | 500 × 146    | Wide logo on a transparent background. Displayed 180 px wide in headers.         |
| `public/assets/logo-dark.png` | Footer                                     | 500 × 146    | The footer turns it solid white with a CSS filter, so only the shape matters.    |
| `public/favicon.png`          | Browser tab icon and installed-app icon    | 512 × 512    | Square. Keep 512 × 512 or update `sizes` in `src/app/manifest.js`.               |
| `public/assets/login.webp`    | Photo beside the sign-in and sign-up forms | 1125 × 750   | Landscape. Cropped to fill half the screen, so keep the subject near the centre. |

## 3. Colours

- **Brand colours:** the `primary` and `secondary` palettes in `tailwind.config.js`. `primary.500` (`#615EFC`) is the main brand colour. The other `primary` steps are lighter and darker shades of it.
- **Hardcoded copies:** a few files write the hex values directly instead of using the Tailwind palette. Find them with:

  ```bash
  grep -rniE "615efc|9896fd|dfdffe|7e8ef1" apps/frontend/src
  ```

  This finds the Clerk sign-in theme (`src/app/clerk-provider.jsx`), the home page chart and hero, the patient dashboard chart, the gradient headings on the marketing pages and the 3D landing page palette (`src/components/telemedicine-story/config.js`).

- **Neutral UI colours** (backgrounds, borders, muted text, cards, popovers): the HSL variables in `src/app/globals.css`, in shadcn/ui's format. Change them only if you want a different neutral tone, not to change the brand colour.
- **App theme colour:** `themeColor` in `src/site.config.js`.

## 4. Fonts

The app uses Plus Jakarta Sans and Lora from Google Fonts. To change them, update all three places:

1. The Google Fonts `<link>` in `src/app/layout.jsx`.
2. `fontFamily` in `tailwind.config.js`.
3. `fontFamily` in `src/app/clerk-provider.jsx`.

## 5. Footer

`src/components/home/Footer.jsx` holds the contact email and the GitHub and LinkedIn links. Replace them with your own.

The footer's newsletter form is a placeholder: it checks the email address but doesn't send it anywhere. Connect it to your email provider in the form's `onSubmit`, or delete the Newsletter block.

## 6. Third-party dashboards

Some branding lives in the services, not in this code:

- **Clerk** (Configure → Settings): the application name shown on the sign-in and sign-up forms. Also check the email templates and their sender name, because Clerk sends the verification emails.
- **Stripe** (Settings → Branding): the business name, icon and colours on the hosted Checkout page.

## 7. Package names (optional)

The root `package.json` is named `telemedicine-website`, and the apps are `backend` and `frontend`. The app names are what the `pnpm -F=backend` and `pnpm -F=frontend` commands use. If you rename them, update those commands in the root `package.json`, `AGENTS.md` and the files in `docs/`.
