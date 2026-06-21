/** Deep space-navy backdrop for the whole journey. */
export const STORY_BG = "#05070f";

/**
 * Accent palette, anchored to the existing brand indigo (#615EFC / #9896fd from
 * tailwind.config.js) and extended with the requested cyan family.
 */
export const PALETTE = {
  indigo: "#615efc",
  indigoLight: "#9896fd",
  indigoDeep: "#3a3897",
  cyan: "#22d3ee",
  cyanLight: "#67e8f9",
  teal: "#2dd4bf",
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
  { position: [-3.4, 1.2, -52], target: [0, 0, -65] }, // 4 · AI
  { position: [2.6, 0.4, -74], target: [0, 0, -85] }, // 5 · monitoring
  { position: [0, 1.6, -98], target: [0, 0, -112] }, // 6 · globe
  { position: [0.5, 3.2, -90], target: [0, -0.5, -112] }, // 7 · finale (pull back)
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
  {
    id: "ai",
    index: 3,
    eyebrow: "AI-assisted healthcare",
    title: "Insight that moves\nat the speed of thought.",
    body: "A living neural mesh reads streaming medical signals, surfacing what matters so decisions arrive faster and safer.",
    align: "left",
  },
  {
    id: "monitoring",
    index: 4,
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
    index: 5,
    eyebrow: "Global healthcare",
    title: "Accessible anywhere,\nanytime.",
    body: "Care hubs light up across continents, linked by pulsing pathways. Distance stops being a diagnosis.",
    align: "left",
  },
  {
    id: "finale",
    index: 6,
    eyebrow: "The whole ecosystem, assembled",
    title: "The Future of Care\nIs Connected",
    body: "Patients, clinicians, intelligence, and monitoring — one continuous system of care.",
    align: "center",
    cta: { label: "Book a Virtual Consultation", href: "/auth/register" },
  },
];

export const SECTION_COUNT = STORY_SECTIONS.length;
