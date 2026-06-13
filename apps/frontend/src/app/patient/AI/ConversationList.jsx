import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquareText,
  Trash2,
  PanelRightOpen,
  PanelRightClose,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/patient/ai";

const STORAGE_KEY = "ai-history-collapsed";

function ConversationItem({ conv, isActive, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(conv)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(conv);
        }
      }}
      role="button"
      tabIndex={0}
      className={`w-full text-left p-3 rounded-lg flex items-start gap-2 group hover:bg-primary-50 transition-colors cursor-pointer ${
        isActive ? "bg-primary-100" : ""
      }`}
    >
      <MessageSquareText className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{conv.title}</p>
        <p className="text-xs text-gray-400">{formatTime(conv.updatedAt)}</p>
      </div>
      <button
        onClick={(e) => onDelete(e, conv.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded shrink-0"
        title="Delete conversation"
      >
        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
      </button>
    </div>
  );
}

/** The scrollable list of conversations, shared by the desktop and mobile views. */
function ConversationItems({
  conversations,
  currentId,
  onSelect,
  onDelete,
  isLoading,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
      {isLoading ? (
        <p className="text-gray-400 text-sm text-center pt-8">Loading...</p>
      ) : conversations.length === 0 ? (
        <p className="text-gray-400 text-sm text-center pt-8">
          No conversations yet
        </p>
      ) : (
        conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conv={conv}
            isActive={conv.id === currentId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

export default function ConversationList({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  isLoading,
  mobileOpen = false,
  onMobileClose,
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Restore the user's preference after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  // On mobile, picking a conversation or starting a new one closes the drawer.
  const selectAndClose = (conv) => {
    onSelect(conv);
    onMobileClose?.();
  };
  const newAndClose = () => {
    onNew();
    onMobileClose?.();
  };

  return (
    <>
      {/* Desktop sidebar — static, collapsible */}
      <aside
        className={`h-full hidden md:flex flex-col border-l border-gray-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          collapsed ? "w-14" : "w-80"
        }`}
      >
        <div
          className={`border-b border-gray-200 flex items-center justify-between gap-1 ${
            collapsed ? "px-2 py-4" : "p-4"
          }`}
        >
          {!collapsed && (
            <h2 className="font-semibold text-primary-700">History</h2>
          )}
          <div
            className={`flex items-center gap-1 ${collapsed ? "mx-auto" : ""}`}
          >
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNew}
                className="gap-1 text-primary-600 hover:text-primary-800"
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="text-primary-600 hover:text-primary-800 shrink-0"
              title={collapsed ? "Expand history" : "Collapse history"}
              aria-label={collapsed ? "Expand history" : "Collapse history"}
            >
              {collapsed ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {collapsed ? (
          <div className="flex flex-col items-center pt-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNew}
              className="text-primary-600 hover:text-primary-800"
              title="New conversation"
              aria-label="New conversation"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <ConversationItems
            conversations={conversations}
            currentId={currentId}
            onSelect={onSelect}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        )}
      </aside>

      {/* Mobile drawer — slides in from the right */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-72 max-w-[80vw] flex-col bg-white shadow-xl md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-1">
          <h2 className="font-semibold text-primary-700">History</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={newAndClose}
              className="gap-1 text-primary-600 hover:text-primary-800"
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="text-gray-500 hover:text-gray-700 shrink-0"
              aria-label="Close history"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ConversationItems
          conversations={conversations}
          currentId={currentId}
          onSelect={selectAndClose}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </aside>
    </>
  );
}
