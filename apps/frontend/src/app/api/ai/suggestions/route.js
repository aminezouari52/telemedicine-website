import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_ID = "gemini-2.5-flash";

const schema = z.object({
  suggestions: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("2-3 short follow-up questions the patient might ask next"),
});

/**
 * Generates contextual follow-up questions for the patient to tap after an
 * assistant reply. Kept deliberately lightweight (no streaming, no tools) so it
 * adds minimal latency/cost on top of the main chat turn.
 */
export async function POST(req) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ suggestions: [] });
  }

  // Only the tail matters for "what would I ask next".
  const transcript = messages
    .slice(-6)
    .map(
      (m) => `${m.role === "assistant" ? "Assistant" : "Patient"}: ${m.text}`,
    )
    .join("\n");

  try {
    const { object } = await generateObject({
      model: google(MODEL_ID),
      schema,
      // Disable thinking — these are quick, formulaic suggestions.
      providerOptions: {
        google: { thinkingConfig: { thinkingBudget: 0 } },
      },
      prompt: `You are helping a patient using a medical assistant chat. Based on the conversation below, suggest 2-3 natural follow-up questions the PATIENT would likely want to ask next.

Rules:
- Write from the patient's first-person point of view (e.g. "What home remedies can help?", "Should I see a doctor?").
- Keep each under 8 words.
- Make them specific to the conversation, not generic.
- Do not repeat questions already answered.

Conversation:
${transcript}`,
    });

    return Response.json({ suggestions: object.suggestions ?? [] });
  } catch (error) {
    console.error("[AI Suggestions] error:", error);
    // Suggestions are a nice-to-have — never surface an error to the chat UI.
    return Response.json({ suggestions: [] });
  }
}
