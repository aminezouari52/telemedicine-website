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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} from "@/services/aiService";
import { getText, toChatMessages, toSaveMessages } from "@/lib/aiDataParts";
import { SYSTEM_CONTEXT, AI_TOOLS } from "@/constants/patient";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";
import ConversationList from "./ConversationList";
import QuotaAlert from "./QuotaAlert";
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

  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const conversationIdRef = useRef(null);
  const isSavingRef = useRef(false);
  const isLoadingMessages = useRef(false);
  const hasAutoSelectedRef = useRef(false);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: () => ({ systemContext: SYSTEM_CONTEXT }),
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

  // Show the "Thinking…" orb for the entire in-flight turn, pinned at the bottom
  // of the list (just above the composer). It stays in view while the answer
  // streams into the message above it, so the live activity never scrolls away.
  const showThinking = isSending;

  const [quotaAlert, setQuotaAlert] = useState(null);

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

  const handleSend = useCallback(async () => {
    const trimmed = userInput.trim();
    if (!trimmed || isSending) return;

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
  }, [
    userInput,
    isSending,
    pdfInfo,
    pdfFile,
    imageFile,
    sendMessage,
    clearPdf,
    clearImage,
  ]);

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
    clearPdf();
    clearImage();
  }, [setMessages, clearPdf, clearImage]);

  const selectConversation = useCallback(
    (conv) => {
      isLoadingMessages.current = true;
      conversationIdRef.current = conv.id;
      setCurrentId(conv.id);
      setMessages(toChatMessages(conv.messages));
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

            {showThinking && (
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-primary-500">
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
            <div className="flex gap-2 mb-3 flex-wrap pb-1">
              {AI_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setUserInput(tool.prompt)}
                  className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full border border-primary-200 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                >
                  <span className="text-sm">{tool.emoji}</span>
                  {tool.label}
                </button>
              ))}
            </div>
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
                {!pdfInfo && (
                  <label
                    htmlFor="file-input"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer border border-primary-200 shrink-0"
                    title="Attach PDF"
                  >
                    <Paperclip className="w-4 h-4" />
                    <input
                      id="file-input"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
                {!imageInfo && (
                  <label
                    htmlFor="image-input"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer border border-primary-200 shrink-0"
                    title="Attach Image"
                  >
                    <Image className="w-4 h-4" />
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
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
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={handleSend}
                  disabled={!canSend}
                  title={isSending ? "Generating response..." : "Send message"}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>
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
