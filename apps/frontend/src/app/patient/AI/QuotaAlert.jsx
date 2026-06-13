import { AlertCircle, X } from "lucide-react";

/** Dismissible banner shown when the chat API returns a quota / rate-limit error. */
export default function QuotaAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-10 pt-4 shrink-0">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
        <div className="flex-1">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-red-400 hover:text-red-600"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
