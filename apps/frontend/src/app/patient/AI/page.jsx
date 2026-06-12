"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import {
  ArrowUp,
  Paperclip,
  Plus,
  MessageSquareText,
  Trash2,
  ChevronDown,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} from "@/services/aiService";
import { getText, toChatMessages, toSaveMessages } from "@/lib/aiDataParts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SYSTEM_CONTEXT, TOOL_DISPLAY, AI_TOOLS } from "@/constants/patient";
import { formatTime } from "@/utils/patient/ai";
import PdfPreviewCard from "./PdfPreviewCard";
import ImagePreviewCard from "./ImagePreviewCard";

function UserMessage({ message }) {
  const pdfParts =
    message.parts?.filter(
      (p) => p.type === "file" && p.mediaType?.startsWith("application/pdf"),
    ) ?? [];
  const imageParts =
    message.parts?.filter(
      (p) => p.type === "file" && p.mediaType?.startsWith("image/"),
    ) ?? [];

  return (
    <div className="flex flex-col items-end gap-2">
      {imageParts.map((part, i) => (
        <img
          className="rounded-md max-w-xs max-h-80 object-contain border"
          key={`${message.id}-img-${i}`}
          src={part.url}
          alt={part.filename ?? `image-${i}`}
        />
      ))}
      {pdfParts.map((part, i) => (
        <iframe
          className="pb-4"
          key={`${message.id}-${i}`}
          src={part.url}
          width="500"
          height="600"
          title={part.filename ?? `attachment-${i}`}
        />
      ))}
      <div className="bg-primary-100 px-3 py-2 rounded-md max-w-prose">
        <p className="font-medium text-primary-700">{getText(message)}</p>
      </div>
    </div>
  );
}

function AiMessage({ message, isStreaming }) {
  const [showReasoning, setShowReasoning] = useState(true);
  const toolParts =
    message.parts
      ?.filter(
        (p) =>
          typeof p.type === "string" &&
          p.type.startsWith("tool-") &&
          p.type !== "tool-result",
      )
      .filter(
        (p, i, arr) =>
          arr.findIndex(
            (t) => t.type.replace("tool-", "") === p.type.replace("tool-", ""),
          ) === i,
      ) ?? [];

  const reasoningParts =
    message.parts?.filter((p) => p.type === "reasoning") ?? [];

  const reasoningText = reasoningParts.map((p) => p.text ?? "").join("");
  const isReasoningStreaming = reasoningParts.some(
    (p) => p.state === "streaming",
  );

  useEffect(() => {
    if (isReasoningStreaming) {
      setShowReasoning(true);
    }
  }, [isReasoningStreaming]);

  return (
    <>
      {toolParts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {toolParts.map((tc) => {
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
          {isStreaming && (
            <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-600 text-xs font-medium border border-amber-200">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              Thinking...
            </span>
          )}
        </div>
      )}

      {reasoningText && (
        <div className="mb-3 w-full">
          <button
            type="button"
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-1"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showReasoning ? "rotate-0" : "-rotate-90"
              }`}
            />
            {showReasoning ? "Hide" : "Show"} reasoning
            {isReasoningStreaming && (
              <span className="inline-flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            )}
          </button>
          {showReasoning && (
            <div className="p-3 rounded-md bg-amber-50 border-l-4 border-amber-400 text-xs text-amber-900 leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
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
                {isReasoningStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-amber-600 animate-pulse" />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {message.parts?.map((part, index) => {
        if (part.type === "file" && part.mediaType?.startsWith("image/")) {
          return (
            <img
              className="rounded-md max-w-xs max-h-80 object-contain border my-2"
              key={`${message.id}-img-${index}`}
              src={part.url}
              alt={part.filename ?? `image-${index}`}
            />
          );
        }
        if (
          part.type === "file" &&
          part.mediaType?.startsWith("application/pdf")
        ) {
          return (
            <iframe
              key={`${message.id}-${index}`}
              src={part.url}
              width="500"
              height="600"
              title={part.filename ?? `attachment-${index}`}
            />
          );
        }
        return null;
      })}
      <div className="whitespace-pre-wrap">
        <ReactMarkdown>{getText(message)}</ReactMarkdown>
      </div>
      <div className="flex-1" />
    </>
  );
}

function ConversationList({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  isLoading,
}) {
  return (
    <aside className="h-[100vh] hidden md:flex w-80 flex-col border-l border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-primary-700">History</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNew}
          className="gap-1 text-primary-600 hover:text-primary-800"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <p className="text-gray-400 text-sm text-center pt-8">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-400 text-sm text-center pt-8">
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
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
                conv.id === currentId ? "bg-primary-100" : ""
              }`}
            >
              <MessageSquareText className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{conv.title}</p>
                <p className="text-xs text-gray-400">
                  {formatTime(conv.updatedAt)}
                </p>
              </div>
              <button
                onClick={(e) => onDelete(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded shrink-0"
                title="Delete conversation"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default function PatientAIPage() {
  const [userInput, setUserInput] = useState("");
  const [filePart, setPdfText] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);

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

  const isSending = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";

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

    if (!id) {
      isSavingRef.current = true;
      createMutateRef.current(data);
    } else {
      isSavingRef.current = true;
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

  const handleSend = useCallback(async () => {
    const trimmed = userInput.trim();
    if (!trimmed || isSending) return;

    const metadata = pdfInfo
      ? { pdfName: pdfInfo.name, pdfSize: pdfInfo.size }
      : undefined;

    const promises = [];
    if (filePart) {
      promises.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              type: "file",
              mediaType: filePart.type,
              filename: filePart.name,
              url: reader.result,
            });
          reader.onerror = reject;
          reader.readAsDataURL(filePart);
        }),
      );
    }
    if (imageFile) {
      promises.push(
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              type: "file",
              mediaType: imageFile.type,
              filename: imageFile.name,
              url: reader.result,
            });
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        }),
      );
    }
    const files = await Promise.all(promises);

    sendMessage({
      text: trimmed,
      metadata,
      files: files.length > 0 ? files : undefined,
    });

    setUserInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setPdfText(null);
    setPdfInfo(null);
    setImageFile(null);
    setImageInfo(null);
  }, [userInput, isSending, pdfInfo, filePart, imageFile, sendMessage]);

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    setPdfText(file);
    setPdfInfo({ name: file.name, size: file.size });
    inputRef.current?.focus();
  }, []);

  const handleImageChange = useCallback(async (event) => {
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

  const clearPdf = useCallback(() => {
    setPdfText(null);
    setPdfInfo(null);
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImageInfo(null);
  }, []);

  const startNewConversation = useCallback(() => {
    conversationIdRef.current = null;
    setCurrentId(null);
    setMessages([]);
    setPdfText(null);
    setPdfInfo(null);
    setImageFile(null);
    setImageInfo(null);
  }, [setMessages]);

  const selectConversation = useCallback(
    (conv) => {
      isLoadingMessages.current = true;
      conversationIdRef.current = conv.id;
      setCurrentId(conv.id);
      setMessages(toChatMessages(conv.messages));
      setPdfText(null);
      setPdfInfo(null);
      setImageFile(null);
      setImageInfo(null);
    },
    [setMessages],
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
    <div className="flex bg-background">
      <div className="h-[100vh] flex-1 flex flex-col">
        {quotaAlert && (
          <div className="w-full max-w-3xl mx-auto px-10 pt-4 shrink-0">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="flex-1">{quotaAlert}</div>
              <button
                type="button"
                onClick={() => setQuotaAlert(null)}
                className="shrink-0 text-red-400 hover:text-red-600"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Scroll region — only the messages scroll; the composer below never moves */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto px-10 pt-6 min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
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

                {status === "submitted" && <LoadingSpinner className="mb-2" />}
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
                  className="flex-1 resize-none outline-none bg-transparent text-sm p-2 leading-relaxed max-h-40"
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
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
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
      />
    </div>
  );
}
