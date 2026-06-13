import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";
import { getText } from "@/lib/aiDataParts";
import { TOOL_DISPLAY } from "@/constants/patient";
import MessageAttachments from "./MessageAttachments";
import MessageMeta from "./MessageMeta";
import PulseDot from "./PulseDot";

/** Unique tool-call badges parsed from the message parts. */
function getToolBadges(message) {
  const toolParts =
    message.parts?.filter(
      (p) =>
        typeof p.type === "string" &&
        p.type.startsWith("tool-") &&
        p.type !== "tool-result",
    ) ?? [];

  const seen = new Set();
  return toolParts.filter((p) => {
    const name = p.type.replace("tool-", "");
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function ToolBadges({ message }) {
  const badges = getToolBadges(message);
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-1">
      {badges.map((tc) => {
        const toolName = tc.type.replace("tool-", "");
        const display = TOOL_DISPLAY[toolName];
        if (!display) return null;
        return (
          <span
            key={tc.toolCallId ?? toolName}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
          >
            <span className="text-sm">{display.emoji}</span>
            {display.label}
          </span>
        );
      })}
    </div>
  );
}

function ReasoningPanel({ message }) {
  const [showReasoning, setShowReasoning] = useState(true);

  const reasoningParts =
    message.parts?.filter((p) => p.type === "reasoning") ?? [];
  const reasoningText = reasoningParts.map((p) => p.text ?? "").join("");
  const isStreaming = reasoningParts.some((p) => p.state === "streaming");

  useEffect(() => {
    if (isStreaming) setShowReasoning(true);
  }, [isStreaming]);

  if (!reasoningText) return null;

  return (
    <div className="mb-3 w-full">
      <button
        type="button"
        onClick={() => setShowReasoning((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-1"
      >
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            showReasoning ? "rotate-0" : "-rotate-90"
          }`}
        />
        {showReasoning ? "Hide" : "Show"} reasoning
        {isStreaming && <PulseDot className="ml-1" />}
      </button>
      {showReasoning && (
        <div className="p-3 rounded-md bg-amber-50 border-l-4 border-amber-400 text-xs text-amber-900 leading-relaxed whitespace-pre-wrap break-words font-mono max-h-80 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="flex items-center gap-1.5 mb-2 text-amber-700 font-semibold not-italic">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a4 4 0 0 1 4 4c0 2-1.5 3.5-2.5 4.5A4 4 0 0 0 12 14" />
              <circle cx="12" cy="18" r="1" />
            </svg>
            Reasoning
          </div>
          <div className="italic">
            {reasoningText}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-amber-600 animate-pulse" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AiMessage({ message, isStreaming }) {
  return (
    <>
      <ReasoningPanel message={message} />
      <MessageAttachments message={message} />
      <div className="whitespace-pre-wrap break-words min-w-0 w-full font-serif text-[15px] leading-relaxed text-gray-800">
        <ReactMarkdown>{getText(message)}</ReactMarkdown>
      </div>
      {/* Tool badges + metadata stack vertically below the answer. The w-full
          wrapper forces them onto their own line in the parent's flex-wrap row
          (otherwise they'd sit side-by-side), and keeps them near the scroll
          anchor so they don't scroll out of view as the response streams in. */}
      <div className="w-full flex flex-col gap-2">
        <ToolBadges message={message} />
        {!isStreaming && <MessageMeta message={message} />}
      </div>
      <div className="flex-1" />
    </>
  );
}
