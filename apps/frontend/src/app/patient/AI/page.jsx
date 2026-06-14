"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  Paperclip,
  Image,
  MessageSquareText,
  Square,
  Check,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  listConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  fetchSuggestions,
} from "@/services/aiService";
import { getText, toChatMessages, toSaveMessages } from "@/lib/aiDataParts";
import {
  SYSTEM_CONTEXT,
  AI_TOOLS,
  AI_STARTER_QUESTIONS,
} from "@/constants/patient";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";
import ConversationList from "./ConversationList";
import QuotaAlert from "./QuotaAlert";
import FollowUpChips from "./FollowUpChips";
import PulseOrb from "@/components/PulseOrb";
import PdfPreviewCard from "./PdfPreviewCard";
import ImagePreviewCard from "./ImagePreviewCard";

/** Reads a File into a data-URL "file" message part for the chat API. */
function fileToPart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        type: "file",
        mediaType: file.type,
        filename: file.name,
        url: reader.result,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PatientAIPage() {
  const [userInput, setUserInput] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  // Tools the patient has explicitly toggled on — the AI is told it MUST call
  // these. Mirrored into a ref so the transport's `body` callback reads the
  // live selection at send time rather than a stale closure value.
  const [selectedTools, setSelectedTools] = useState([]);

  const [attachOpen, setAttachOpen] = useState(false);

  const inputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const bottomRef = useRef(null);
  const conversationIdRef = useRef(null);
  const isSavingRef = useRef(false);
  const isLoadingMessages = useRef(false);
  const hasAutoSelectedRef = useRef(false);
  const selectedToolsRef = useRef([]);
  selectedToolsRef.current = selectedTools;

  const { messages, sendMessage, status, setMessages, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: () => {
        const ids = selectedToolsRef.current;
        if (ids.length === 0) return { systemContext: SYSTEM_CONTEXT };

        const labels = ids
          .map((id) => AI_TOOLS.find((t) => t.id === id)?.label)
          .filter(Boolean);
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

        return { systemContext: SYSTEM_CONTEXT + emphasis };
      },
    }),
    onError: (err) => {
      console.error("[AI Chat] useChat error:", err);
    },
  });

  // Chat loading states:
  // - isSubmitting: request sent, waiting for the first token (show spinner)
  // - isStreaming:  tokens are arriving and being rendered
  // - isSending:    either of the above — the composer is locked
  const isSubmitting = status === "submitted";
  const isStreaming = status === "streaming";
  const isSending = isSubmitting || isStreaming;

  const [quotaAlert, setQuotaAlert] = useState(null);

  // Follow-up chips for the latest assistant reply. `forId` pins them to a
  // specific message so they only render under the freshest answer.
  const [suggestions, setSuggestions] = useState({ items: [], forId: null });

  useEffect(() => {
    if (!error) {
      setQuotaAlert(null);
      return;
    }
    const msg = error.message?.toLowerCase() || "";
    const isQuota =
      msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("429") ||
      msg.includes("insufficient") ||
      msg.includes("resource exhausted");
    if (isQuota) {
      setQuotaAlert(
        error.message ||
          "API quota exceeded. Please try again later or check your plan.",
      );
    } else if (status === "error") {
      setQuotaAlert("Something went wrong. Please try again in a moment.");
    }
  }, [error, status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["ai-conversations"],
    queryFn: async () => {
      const res = await listConversations();
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (conversationsData) {
      setConversations(
        [...conversationsData].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        ),
      );
    }
  }, [conversationsData]);

  useEffect(() => {
    if (
      conversations.length > 0 &&
      currentId === null &&
      !hasAutoSelectedRef.current
    ) {
      const latest = conversations[0];
      isLoadingMessages.current = true;
      conversationIdRef.current = latest.id;
      setCurrentId(latest.id);
      setMessages(toChatMessages(latest.messages));
      hasAutoSelectedRef.current = true;
    }
  }, [conversations, currentId, setMessages]);

  const createMutateRef = useRef(null);
  const updateMutateRef = useRef(null);

  const createMutation = useMutation({
    mutationFn: (data) => createConversation(data),
    onSuccess: (res) => {
      const conv = res.data;
      conversationIdRef.current = conv.id;
      setCurrentId(conv.id);
      setConversations((prev) => [conv, ...prev]);
      isSavingRef.current = false;
      refetchConversations();
    },
    onError: () => {
      isSavingRef.current = false;
    },
  });
  createMutateRef.current = createMutation.mutate;

  const updateMutation = useMutation({
    mutationFn: ({ convId, data }) => updateConversation(convId, data),
    onSuccess: (res) => {
      const updated = res.data;
      setConversations((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      isSavingRef.current = false;
    },
    onError: () => {
      isSavingRef.current = false;
    },
  });
  updateMutateRef.current = updateMutation.mutate;

  const deleteMutation = useMutation({
    mutationFn: (convId) => deleteConversation(convId),
    onSuccess: (_data, convId) => {
      if (currentId === convId) {
        startNewConversation();
      }
      refetchConversations();
    },
  });

  const saveConversation = useCallback(async (msgs) => {
    if (msgs.length === 0 || isSavingRef.current) return;

    const firstUserMsg = msgs.find((m) => m.role === "user");
    const text = getText(firstUserMsg ?? {});
    const title = text
      ? text.slice(0, 60) + (text.length > 60 ? "..." : "")
      : "New conversation";

    const data = { title, messages: toSaveMessages(msgs) };
    const id = conversationIdRef.current;

    isSavingRef.current = true;
    if (!id) {
      createMutateRef.current(data);
    } else {
      updateMutateRef.current({ convId: id, data });
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    if (isLoadingMessages.current) {
      isLoadingMessages.current = false;
      return;
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && status === "ready") {
      const text = getText(lastMsg);
      if (text.trim()) {
        saveConversation(messages);

        const lastId = lastMsg.id;
        const payload = messages.map((m) => ({
          role: m.role,
          text: getText(m),
        }));
        fetchSuggestions(payload).then((items) => {
          if (items.length > 0) setSuggestions({ items, forId: lastId });
        });
      }
    }
  }, [messages, status, saveConversation]);

  const clearPdf = useCallback(() => {
    setPdfFile(null);
    setPdfInfo(null);
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImageInfo(null);
  }, []);

  const submit = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      // Hide stale follow-up chips the moment a new turn begins.
      setSuggestions({ items: [], forId: null });

      const metadata = {
        createdAt: Date.now(),
        ...(pdfInfo ? { pdfName: pdfInfo.name, pdfSize: pdfInfo.size } : {}),
      };

      const files = await Promise.all(
        [pdfFile, imageFile].filter(Boolean).map(fileToPart),
      );

      sendMessage({
        text: trimmed,
        metadata,
        files: files.length > 0 ? files : undefined,
      });

      setUserInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      clearPdf();
      clearImage();
    },
    [isSending, pdfInfo, pdfFile, imageFile, sendMessage, clearPdf, clearImage],
  );

  const handleSend = useCallback(() => submit(userInput), [submit, userInput]);

  const toggleTool = useCallback((id) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    setPdfFile(file);
    setPdfInfo({ name: file.name, size: file.size });
    inputRef.current?.focus();
  }, []);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    setImageFile(file);
    setImageInfo({ name: file.name, size: file.size });
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const startNewConversation = useCallback(() => {
    conversationIdRef.current = null;
    setCurrentId(null);
    setMessages([]);
    setSuggestions({ items: [], forId: null });
    clearPdf();
    clearImage();
  }, [setMessages, clearPdf, clearImage]);

  const selectConversation = useCallback(
    (conv) => {
      isLoadingMessages.current = true;
      conversationIdRef.current = conv.id;
      setCurrentId(conv.id);
      setMessages(toChatMessages(conv.messages));
      setSuggestions({ items: [], forId: null });
      clearPdf();
      clearImage();
    },
    [setMessages, clearPdf, clearImage],
  );

  const deleteConversationHandler = useCallback(
    (e, id) => {
      e.stopPropagation();
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const canSend = !isSending && userInput.trim().length > 0;

  return (
    <div className="flex h-full bg-background overflow-x-hidden">
      <div className="h-full flex-1 flex flex-col min-w-0">
        {/* Mobile history trigger — the sidebar is a drawer on small screens */}
        <div className="md:hidden flex items-center justify-end px-4 py-2 border-b border-gray-100 shrink-0">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <MessageSquareText className="w-4 h-4" />
            History
          </button>
        </div>

        <QuotaAlert message={quotaAlert} onClose={() => setQuotaAlert(null)} />

        {/* Scroll region — only the messages scroll; the composer below never moves */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="w-full max-w-3xl mx-auto px-10 pt-6 min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-10">
                {/* TEMP: concept comparison — remove once a direction is chosen */}
                <div className="flex items-end gap-12">
                  <div className="flex flex-col items-center gap-4">
                    <PulseOrb size="lg" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-primary-500 text-center">
                  What&apos;s bothering you today?
                </h1>
              </div>
            ) : (
              <div className="flex flex-col lg:max-w-5xl">
                {messages.map((message, i) => (
                  <div
                    key={message.id}
                    className="flex items-start mb-4 gap-4 flex-wrap"
                  >
                    {message.role === "assistant" ? (
                      <AiMessage
                        message={message}
                        isStreaming={isStreaming && i === messages.length - 1}
                      />
                    ) : (
                      <>
                        <div className="flex-1" />
                        <UserMessage message={message} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isSending &&
              suggestions.items.length > 0 &&
              messages[messages.length - 1]?.id === suggestions.forId && (
                <FollowUpChips
                  suggestions={suggestions.items}
                  onSelect={submit}
                  disabled={isSending}
                />
              )}

            {isSending && (
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-primary-500">
                <PulseOrb size="sm" floating={false} />
                Thinking…
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Composer — fixed footer, outside the scroll region */}
        <div className="shrink-0 bg-background">
          <div className="w-full max-w-3xl mx-auto px-10 flex flex-col pb-8">
            {messages.length === 0 && (
              <FollowUpChips
                suggestions={AI_STARTER_QUESTIONS}
                onSelect={submit}
                disabled={isSending}
              />
            )}
            {selectedTools.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pb-1">
                {AI_TOOLS.filter((tool) => selectedTools.includes(tool.id)).map(
                  (tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      title={`${tool.label} will be requested — click to remove`}
                      className="inline-flex items-center gap-1.5 shrink-0 pl-3 pr-2 py-1.5 rounded-full border border-primary-500 bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors"
                    >
                      <span className="text-sm">{tool.emoji}</span>
                      {tool.label}
                      <X className="w-3 h-3" />
                    </button>
                  ),
                )}
              </div>
            )}
            <div className="w-full flex flex-col gap-2">
              <div className="flex gap-2">
                {pdfInfo && (
                  <PdfPreviewCard
                    name={pdfInfo.name}
                    size={pdfInfo.size}
                    onRemove={clearPdf}
                  />
                )}
                {imageInfo && (
                  <ImagePreviewCard
                    name={imageInfo.name}
                    size={imageInfo.size}
                    onRemove={clearImage}
                  />
                )}
              </div>
              <div className="flex items-end gap-2 bg-white shadow-md rounded-3xl border border-primary-500 p-2 transition-shadow">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Popover open={attachOpen} onOpenChange={setAttachOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      title="Add attachment or tool"
                      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer border border-primary-200 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      {selectedTools.length > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-primary-500 text-white text-[0.625rem] font-semibold">
                          {selectedTools.length}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" side="top" className="w-60 p-1">
                    <p className="px-2.5 pt-1.5 pb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">
                      Attach
                    </p>
                    <button
                      type="button"
                      disabled={!!pdfInfo}
                      onClick={() => {
                        setAttachOpen(false);
                        pdfInputRef.current?.click();
                      }}
                      className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    >
                      <Paperclip className="w-4 h-4 text-primary-600" />
                      Attach PDF
                    </button>
                    <button
                      type="button"
                      disabled={!!imageInfo}
                      onClick={() => {
                        setAttachOpen(false);
                        imageInputRef.current?.click();
                      }}
                      className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    >
                      <Image className="w-4 h-4 text-primary-600" />
                      Attach Image
                    </button>

                    <div className="my-1 h-px bg-gray-100" />

                    <p className="px-2.5 pt-1 pb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">
                      Tools
                    </p>
                    {AI_TOOLS.map((tool) => {
                      const selected = selectedTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => toggleTool(tool.id)}
                          aria-pressed={selected}
                          className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-sm text-left transition-colors ${
                            selected
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-base leading-none">
                            {tool.emoji}
                          </span>
                          <span className="flex-1">{tool.label}</span>
                          {selected && (
                            <Check className="w-4 h-4 text-primary-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </PopoverContent>
                </Popover>
                <textarea
                  ref={inputRef}
                  value={userInput}
                  placeholder="Ask anything..."
                  rows={1}
                  className="flex-1 resize-none outline-none bg-transparent text-sm p-2 leading-relaxed max-h-40 scrollbar-thin"
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onInput={(e) => {
                    const el = e.target;
                    el.style.height = "auto";
                    el.style.height = el.scrollHeight + "px";
                  }}
                />
                {isSending ? (
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={stop}
                    title="Stop generating"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={handleSend}
                    disabled={!canSend}
                    title="Send message"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConversationList
        conversations={conversations}
        currentId={currentId}
        onSelect={selectConversation}
        onNew={startNewConversation}
        onDelete={deleteConversationHandler}
        isLoading={isLoadingConversations}
        mobileOpen={historyOpen}
        onMobileClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
