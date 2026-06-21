import StoryExperience from "@/components/telemedicine-story/StoryExperience";

export const metadata = {
  title: "The Future of Care Is Connected | Télémedecine",
  description:
    "A scroll-driven 3D journey through modern telemedicine — connected patients, virtual consultations, AI-assisted insight, remote monitoring, and global care.",
};

/**
 * Route: /telemedicine-story
 *
 * Server component shell. The immersive experience itself is a client island
 * (`StoryExperience`) that lazy-loads the Three.js scene, so this page adds no
 * WebGL weight to the server render.
 */
export default function TelemedicineStoryPage() {
  return <StoryExperience />;
}
