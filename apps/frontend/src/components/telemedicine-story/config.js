/** Deep space-navy backdrop for the whole journey. */
export const STORY_BG = "#05070f";

/**
 * Accent palette — brand-only. Every tone is drawn from the indigo `primary`
 * ramp (+ `secondary`) in tailwind.config.js, so the 3D scenes and the DOM
 * overlays stay on the same colours as the rest of the site. Tonal variety
 * comes from lightness across the ramp rather than from a second hue.
 */
export const PALETTE = {
  indigoDeep: "#3a3897", // primary-700
  indigo: "#615efc", // primary-500 — core brand
  secondary: "#7e8ef1", // secondary-500
  indigoLight: "#9896fd", // primary-400
  glow: "#b0aefe", // primary-300 — bright accent
  glowLight: "#c8c7fe", // primary-200 — lightest accent / emissive cores
  ice: "#e6f0ff",
  fog: "#070b18",
};

/** World-space anchor for each chapter's 3D content (a corridor down -Z). */
export const SECTION_CENTERS = {
  hero: [0, 0, 0],
  network: [0, 0, -20],
  consultation: [0, 0, -42],
  ai: [0, 0, -64],
  monitoring: [0, 0, -84],
  globe: [0, 0, -112],
};

/**
 * Camera waypoints — one per chapter. The rig eases between consecutive
 * waypoints based on master scroll progress, flying the viewer through the
 * corridor of scenes. Kept monotonic in Z so the motion always reads as
 * "travelling forward through the future of care."
 */
export const CAMERA_KEYFRAMES = [
  { position: [0, 0, 12], target: [0, 0, -2] }, // 1 · hero
  { position: [0, 1.4, -7], target: [0, 0, -20] }, // 2 · patient network
  { position: [3.2, 0.6, -30], target: [0, 0, -43] }, // 3 · consultation
  // No dwell waypoint for the neural mesh: the camera flies straight from the
  // consultation to the monitoring waypoint, passing through the NeuralNetwork
  // scene (z -64) so it reads as a background flourish rather than its own beat.
  { position: [2.6, 0.4, -74], target: [0, 0, -85] }, // 4 · monitoring
  { position: [0, 1.6, -98], target: [0, 0, -112] }, // 5 · globe
  { position: [0.5, 3.2, -90], target: [0, -0.5, -112] }, // 6 · finale (pull back)
];

/** DOM copy for each scroll chapter. */
export const STORY_SECTIONS = [
  {
    id: "hero",
    index: 0,
    title: "Healthcare\nWithout Boundaries",
    body: "Connect with doctors, specialists, and care teams from anywhere.",
    align: "center",
    hero: true,
    cta: { label: "Start Your Journey", href: "/auth/register" },
  },
  {
    id: "network",
    index: 1,
    eyebrow: "Connecting patients",
    title: "Millions connected,\ninstantly to care.",
    body: "Every node is a person and a provider. As you move, the network finds them — weaving new connections in real time.",
    align: "left",
  },
  {
    id: "consultation",
    index: 2,
    eyebrow: "Virtual consultation",
    title: "Face-to-face care,\nfrom anywhere.",
    body: "Holographic consultation rooms bring your clinician, your charts, and your history into a single calm surface.",
    align: "right",
    // This chapter's visual is the DOM <StatisticsOverlay> rather than a 3D
    // scene, so its copy card is suppressed to keep the cards uncluttered. The
    // section block itself is kept for scroll height / progress banding.
    overlay: "statistics",
  },
  // No "ai" chapter card: the NeuralNetwork scene (z -64) still renders and is
  // flown through as a background flourish on the way from consultation to
  // monitoring, but it gets no copy card and no dedicated scroll screen.
  {
    id: "monitoring",
    index: 3,
    eyebrow: "Remote monitoring",
    title: "Your vitals,\nalways in view.",
    body: "Wearables stream continuously. Dashboards assemble themselves as the data arrives — no clinic visit required.",
    align: "right",
    metrics: [
      { label: "Heart rate", value: 72, decimals: 0, suffix: " bpm" },
      { label: "Oxygen", value: 98, decimals: 0, suffix: "% SpO₂" },
      { label: "Activity", value: 8.4, decimals: 1, suffix: "k steps" },
      { label: "Sleep", value: 7.7, decimals: 1, suffix: " hrs" },
    ],
  },
  {
    id: "globe",
    index: 4,
    eyebrow: "Global healthcare",
    title: "Accessible anywhere,\nanytime.",
    body: "Care hubs light up across continents, linked by pulsing pathways. Distance stops being a diagnosis.",
    align: "left",
  },
  // The journey ends on the globe chapter — the camera's finale pull-back (the
  // last CAMERA_KEYFRAMES entry) now plays out at the bottom of this chapter,
  // and the marketing sections (client reviews, FAQ) scroll straight up over
  // the starfield once the globe has receded. No empty "finale" screen.
];

export const SECTION_COUNT = STORY_SECTIONS.length;
