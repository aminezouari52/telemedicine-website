import { SYSTEM_CONTEXT, AI_TOOLS } from "@/constants/patient";

/**
 * Builds the assistant's system prompt on the server. The browser only sends
 * the ids of the tools the patient toggled on; ids that aren't in AI_TOOLS are
 * ignored, so a client can't change the prompt's instructions.
 */
export function buildSystemPrompt(selectedTools) {
  const tools = AI_TOOLS.filter(
    (tool) => Array.isArray(selectedTools) && selectedTools.includes(tool.id),
  );
  if (tools.length === 0) return SYSTEM_CONTEXT;

  const ids = tools.map((tool) => tool.id);
  const labels = tools.map((tool) => tool.label);
  const emphasis =
    `\n\n## Patient-requested tools\n` +
    `The patient has toggled on ${ids.length > 1 ? "these tools" : "this tool"}: ` +
    `${labels.join(", ")} (${ids.join(", ")}), signalling they want ` +
    `${ids.length > 1 ? "them" : "it"} used. Strongly prefer calling ` +
    `${ids.length > 1 ? "each one" : "it"} when it is relevant to their ` +
    `message. If a requested tool needs information the patient hasn't ` +
    `given yet, ask for it before calling rather than calling with empty ` +
    `arguments. If a requested tool genuinely does not fit their query, ` +
    `do NOT force it — skip it and briefly note that it wasn't relevant ` +
    `to this message. You may also call other tools you deem relevant.`;

  return SYSTEM_CONTEXT + emphasis;
}
