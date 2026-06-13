import { Clock, Cpu, Coins } from "lucide-react";

/** Human-readable model labels for the ids we stamp onto messages. */
const MODEL_LABELS = {
  "gemini-2.5-flash": "Gemini 2.5 Flash",
};

function formatTime(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/**
 * Small, subtle footer that surfaces a message's metadata: the time it was
 * sent and — for assistant replies — the model and token usage. Renders
 * nothing when no metadata is present (e.g. older saved messages).
 */
export default function MessageMeta({ message, align = "start" }) {
  const meta = message.metadata;
  if (!meta) return null;

  const time = meta.createdAt ? formatTime(meta.createdAt) : null;
  const model = meta.model ? MODEL_LABELS[meta.model] ?? meta.model : null;
  const tokens = typeof meta.totalTokens === "number" ? meta.totalTokens : null;

  if (!time && !model && tokens == null) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 ${
        align === "end" ? "justify-end" : ""
      }`}
    >
      {time && (
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {time}
        </span>
      )}
      {model && (
        <span className="inline-flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          {model}
        </span>
      )}
      {tokens != null && (
        <span className="inline-flex items-center gap-1">
          <Coins className="w-3 h-3" />
          {tokens.toLocaleString()} tokens
        </span>
      )}
    </div>
  );
}
