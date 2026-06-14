import { Sparkles } from "lucide-react";

/**
 * Tappable follow-up question chips shown beneath the latest assistant reply.
 * Selecting one immediately sends it as the next message.
 */
export default function FollowUpChips({ suggestions, onSelect, disabled }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        <Sparkles className="w-3.5 h-3.5" />
        Suggested
      </span>
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(text)}
          className="text-left px-3 py-1.5 rounded-full border border-primary-200 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
