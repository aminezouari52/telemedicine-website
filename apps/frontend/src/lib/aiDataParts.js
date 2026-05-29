export const PART_TYPES = {
  TEXT: "text",
  TOOL_CALL: "tool-call",
  TOOL_RESULT: "tool-result",
  SOURCE: "source",
  REASONING: "reasoning",
  REDACTED_REASONING: "redacted-reasoning",
  IMAGE: "image",
  FILE: "file",
};

export function textPart(text) {
  return { type: PART_TYPES.TEXT, text };
}

export function toolCallPart(toolCallId, toolName, args) {
  return { type: PART_TYPES.TOOL_CALL, toolCallId, toolName, args };
}

export function toolResultPart(toolCallId, toolName, result) {
  return { type: PART_TYPES.TOOL_RESULT, toolCallId, toolName, result };
}

export function sourcePart(source) {
  return { type: PART_TYPES.SOURCE, source };
}

export function reasoningPart(reasoning, details) {
  return { type: PART_TYPES.REASONING, reasoning, details: details || [] };
}

export function filePart(data, mimeType) {
  return { type: PART_TYPES.FILE, data, mimeType };
}

export function getText(message) {
  const part = message.parts?.find((p) => p.type === PART_TYPES.TEXT);
  return part?.text ?? "";
}

export function getSources(message) {
  return message.parts?.filter((p) => p.type === PART_TYPES.SOURCE) ?? [];
}

export function getReasoning(message) {
  const part = message.parts?.find((p) => p.type === PART_TYPES.REASONING);
  return part?.reasoning ?? null;
}

export function getFileParts(message) {
  return message.parts?.filter((p) => p.type === PART_TYPES.FILE) ?? [];
}

export function hasParts(message) {
  return Array.isArray(message.parts) && message.parts.length > 0;
}

export function toChatMessage(msg) {
  const parts = [textPart(msg.text || "")];
  if (msg.toolCalls) {
    for (const tc of msg.toolCalls) {
      parts.push({
        type: `tool-${tc.toolName}`,
        toolCallId: tc.toolCallId,
        args: tc.args,
      });
    }
  }
  return {
    id: msg.id,
    role: msg.role === "ai" ? "assistant" : "user",
    parts,
    metadata: msg.pdfName
      ? { pdfName: msg.pdfName, pdfSize: msg.pdfSize }
      : undefined,
  };
}

export function toChatMessages(messages) {
  return (messages || []).map(toChatMessage);
}

export function toSaveMessage(msg) {
  const toolCalls = (msg.parts ?? [])
    .filter(
      (p) =>
        typeof p.type === "string" &&
        p.type.startsWith("tool-") &&
        p.type !== "tool-result",
    )
    .map((p) => ({
      toolCallId: p.toolCallId,
      toolName: p.type.replace("tool-", ""),
      args: p.args,
    }));
  return {
    id: msg.id,
    role: msg.role === "assistant" ? "ai" : msg.role,
    text: getText(msg),
    ...(toolCalls.length > 0 ? { toolCalls } : {}),
    ...(msg.metadata?.pdfName
      ? { pdfName: msg.metadata.pdfName, pdfSize: msg.metadata.pdfSize }
      : {}),
  };
}

export function toSaveMessages(messages) {
  return messages.map(toSaveMessage);
}

export function buildUserMessage(input, pdfInfo) {
  return {
    role: "user",
    parts: [textPart(input)],
    ...(pdfInfo
      ? { metadata: { pdfName: pdfInfo.name, pdfSize: pdfInfo.size } }
      : {}),
  };
}

export function buildAssistantMessage(text, sources) {
  const parts = [textPart(text)];
  if (sources?.length) {
    parts.push(...sources.map(sourcePart));
  }
  return { role: "assistant", parts };
}

export function isValidPart(part) {
  if (!part || typeof part !== "object") return false;
  return Object.values(PART_TYPES).includes(part.type);
}

export function isValidPartsArray(parts) {
  return Array.isArray(parts) && parts.every(isValidPart);
}
