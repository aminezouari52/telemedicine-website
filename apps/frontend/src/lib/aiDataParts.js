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
  return (
    message.parts
      ?.filter((p) => p.type === PART_TYPES.TEXT)
      .map((p) => p.text ?? "")
      .join("") ?? ""
  );
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

function toolPart(toolName, toolCallId, input, output, state) {
  const hasOutput = output !== undefined && output !== null;
  return {
    type: `tool-${toolName}`,
    toolCallId,
    // AI SDK v5 stores input + output on a single tool part. Only mark a part
    // as "output-available" when we actually have the output, otherwise the
    // server will reject it (or ignoreIncompleteToolCalls will drop it).
    state: hasOutput ? "output-available" : state ?? "input-available",
    input,
    ...(hasOutput ? { output } : {}),
  };
}

export function toChatMessage(msg) {
  const parts = [textPart(msg.text || "")];
  if (msg.reasoning) {
    parts.push({
      type: "reasoning",
      text: msg.reasoning,
      state: "done",
    });
  }

  if (msg.toolInvocations) {
    // Current unified format: input + output preserved together.
    for (const ti of msg.toolInvocations) {
      parts.push(
        toolPart(ti.toolName, ti.toolCallId, ti.input, ti.output, ti.state),
      );
    }
  } else if (msg.toolCalls) {
    // Legacy format: merge separate toolCalls + toolResults back into
    // single v5 tool parts so reloaded history converts cleanly.
    const resultsById = {};
    for (const tr of msg.toolResults ?? []) {
      resultsById[tr.toolCallId] = tr.result;
    }
    for (const tc of msg.toolCalls) {
      parts.push(
        toolPart(
          tc.toolName,
          tc.toolCallId,
          tc.args ?? tc.input,
          resultsById[tc.toolCallId],
        ),
      );
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
  // AI SDK v5 represents each tool invocation as a single `tool-<name>` part
  // carrying both `input` and `output`. Persist them together so the result
  // survives the round-trip (a missing result breaks convertToModelMessages).
  const toolInvocations = (msg.parts ?? [])
    .filter(
      (p) =>
        typeof p.type === "string" &&
        p.type.startsWith("tool-") &&
        p.type !== "tool-result",
    )
    .map((p) => ({
      toolCallId: p.toolCallId,
      toolName: p.type.replace("tool-", ""),
      state: p.state,
      input: p.input ?? p.args,
      output: p.output ?? p.result,
    }));
  const reasoning = (msg.parts ?? [])
    .filter((p) => p.type === "reasoning")
    .map((p) => p.text ?? "")
    .join("");

  const filePart = (msg.parts ?? []).find(
    (p) => p.type === "file" && p.mediaType?.startsWith("application/pdf"),
  );

  return {
    id: msg.id,
    role: msg.role === "assistant" ? "ai" : msg.role,
    text: getText(msg),
    ...(toolInvocations.length > 0 ? { toolInvocations } : {}),
    ...(reasoning ? { reasoning } : {}),
    ...(msg.metadata?.pdfName
      ? { pdfName: msg.metadata.pdfName, pdfSize: msg.metadata.pdfSize }
      : filePart?.filename
        ? { pdfName: filePart.filename, pdfSize: 0 }
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
