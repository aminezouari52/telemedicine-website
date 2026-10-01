import { useEffect, useState } from "react";

// Same width as the Tailwind `md` screen, where AuthLayout shows the
// illustration beside the form.
const SPLIT_LAYOUT_QUERY = "(min-width: 960px)";

// Clerk renders the logo inside the card, centred above the form title, and
// links it to the home page.
const LOGO_OPTIONS = {
  logoImageUrl: "/assets/logo.png",
  logoLinkUrl: "/",
  logoPlacement: "inside",
};

const FLAT = { boxShadow: "none", border: "none", background: "transparent" };

// Tighter than Clerk's default 1rem spacing so the form fits shorter screens;
// every margin, padding and gap derives from it.
const VARIABLES = { spacing: "0.75rem" };
const LOGO_BOX = { height: "2.75rem" };

// Small screens: the card keeps its border, shadow and white background.
const CARD_APPEARANCE = {
  options: LOGO_OPTIONS,
  variables: VARIABLES,
  elements: { logoBox: LOGO_BOX },
};

// Large screens: the form sits flat on the page next to the illustration.
const FLAT_APPEARANCE = {
  options: LOGO_OPTIONS,
  variables: VARIABLES,
  elements: {
    logoBox: { height: "3.5rem" },
    cardBox: FLAT,
    card: FLAT,
    footer: { background: "transparent" },
  },
};

/** Appearance for Clerk's <SignIn /> and <SignUp /> on the auth pages. */
export default function useAuthFormAppearance() {
  const [isSplitLayout, setIsSplitLayout] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(SPLIT_LAYOUT_QUERY);
    setIsSplitLayout(query.matches);
    const onChange = (event) => setIsSplitLayout(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isSplitLayout ? FLAT_APPEARANCE : CARD_APPEARANCE;
}
