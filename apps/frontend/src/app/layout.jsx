import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: {
    default: "The Future of Care Is Connected | Télémedecine",
    template: "%s | Télémedecine",
  },
  description:
    "A scroll-driven 3D journey through modern telemedicine — connected patients, virtual consultations, AI-assisted insight, remote monitoring, and global care.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
