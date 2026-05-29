"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import {
  ArrowUp,
  Paperclip,
  X,
  Plus,
  MessageSquareText,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import pdfToText from "react-pdftotext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  listConversations,
  createConversation,
  updateConversation,
  deleteConversation,
} from "@/services/aiService";
import { cn } from "@/lib/utils";
import { getText, toChatMessages, toSaveMessages } from "@/lib/aiDataParts";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SYSTEM_CONTEXT, TOOL_DISPLAY, AI_TOOLS } from "@/constants/patient";

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function PdfPreviewCard({ name, size, onRemove }) {
  return (
    <div className="flex items-center gap-2 border border-primary-300 rounded-xl h-[60px] px-3 py-2 bg-primary-50">
      <Image
        src="/assets/pdf.svg"
        alt="PDF icon"
        width={25}
        height={25}
        className="h-[25px] shrink-0"
      />
      <div className="ms-2 min-w-0">
        <p className="text-md text-primary-800 font-medium truncate max-w-[160px]">
          {name}
        </p>
        <p className="text-gray-500 text-sm">
          {(size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2 w-6 h-6 rounded-full text-black shrink-0"
          onClick={onRemove}
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="flex flex-col items-end gap-2">
      {message.metadata?.pdfName && message.metadata?.pdfSize !== undefined && (
        <PdfPreviewCard
          name={message.metadata.pdfName}
          size={message.metadata.pdfSize}
        />
      )}
      <div className="bg-primary-100 px-3 py-2 rounded-md max-w-prose">
        <p className="font-medium text-primary-700">{getText(message)}</p>
      </div>
    </div>
  );
}

function AiMessage({ message, cachedToolParts, isStreaming }) {
  const toolParts =
    cachedToolParts ??
    message.parts?.filter(
      (p) =>
        typeof p.type === "string" &&
        p.type.startsWith("tool-") &&
        p.type !== "tool-result",
    ) ??
    [];

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
    <aside className="min-h-[100%] right-0 hidden md:flex w-80 flex-col border-l border-gray-200 bg-white min-h-[80vh]">
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
  const [pdfText, setPdfText] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const conversationIdRef = useRef(null);
  const isSavingRef = useRef(false);
  const isLoadingMessages = useRef(false);
  const toolCallCacheRef = useRef({});

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: () => ({ systemContext: SYSTEM_CONTEXT, pdfContent: pdfText }),
    }),
    onError: (err) => console.error("[AI Chat] useChat error:", err),
  });

  const isSending = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useMemo(() => {
    const cache = toolCallCacheRef.current;
    for (const message of messages) {
      if (!message.parts || cache[message.id]) continue;
      const toolParts = message.parts.filter(
        (p) =>
          typeof p.type === "string" &&
          p.type.startsWith("tool-") &&
          p.type !== "tool-result",
      );
      if (toolParts.length > 0) {
        cache[message.id] = toolParts;
      }
    }
  }, [messages]);

  const { data: conversationsData, isLoading: isLoadingConversations } =
    useQuery({
      queryKey: ["ai-conversations"],
      queryFn: async () => {
        const res = await listConversations();
        return res.data;
      },
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
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (currentId === convId) {
        startNewConversation();
      }
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
      saveConversation(messages);
    }
  }, [messages, status, saveConversation]);

  const handleSend = useCallback(() => {
    const trimmed = userInput.trim();
    if (!trimmed || isSending) return;

    const metadata = pdfInfo
      ? { pdfName: pdfInfo.name, pdfSize: pdfInfo.size }
      : undefined;

    sendMessage({ text: trimmed, metadata });

    setUserInput("");
    setPdfText(null);
    setPdfInfo(null);
  }, [userInput, isSending, pdfInfo, sendMessage]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const text = await pdfToText(file);
    setPdfText(text);
    setPdfInfo({ name: file.name, size: file.size });
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSend();
    },
    [handleSend],
  );

  const clearPdf = useCallback(() => {
    setPdfText(null);
    setPdfInfo(null);
  }, []);

  const startNewConversation = useCallback(() => {
    conversationIdRef.current = null;
    setCurrentId(null);
    setMessages([]);
    setPdfText(null);
    setPdfInfo(null);
  }, [setMessages]);

  const selectConversation = useCallback(
    (conv) => {
      isLoadingMessages.current = true;
      conversationIdRef.current = conv.id;
      setCurrentId(conv.id);
      setMessages(toChatMessages(conv.messages));
      setPdfText(null);
      setPdfInfo(null);
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
      <div
        className={cn(
          "overflow-y-auto h-[100vh] flex-1 flex flex-col items-center gap-24",
          messages.length === 0 ? "justify-center" : "",
        )}
      >
        {messages.length === 0 && (
          <h1 className="text-2xl font-semibold text-primary-500 text-center">
            What&apos;s bothering you today?
          </h1>
        )}

        <div
          className={cn(
            "flex flex-col justify-between w-full max-w-3xl px-10 pt-6",
            messages.length === 0 ? "h-auto " : "h-full",
          )}
        >
          <div className="flex flex-col  lg:max-w-5xl">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start mb-4 gap-4 flex-wrap"
              >
                {message.role === "assistant" ? (
                  <AiMessage
                    message={message}
                    cachedToolParts={
                      toolCallCacheRef.current[message.id] ?? null
                    }
                    isStreaming={isSending}
                  />
                ) : (
                  <>
                    <div className="flex-1" />
                    <UserMessage message={message} />
                  </>
                )}
              </div>
            ))}

            {isSending && <LoadingSpinner className="mb-2" />}

            <div ref={bottomRef} />
          </div>

          <div className="sticky bottom-0 flex flex-col pb-8 bg-background">
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
            <div className="w-full relative flex items-end">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {pdfInfo ? (
                  <div className="absolute left-0 top-[-70px]">
                    <PdfPreviewCard
                      name={pdfInfo.name}
                      size={pdfInfo.size}
                      onRemove={clearPdf}
                    />
                  </div>
                ) : (
                  <label
                    htmlFor="file-input"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer border border-primary-200"
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
              </div>

              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                placeholder="Ask anything..."
                className={`w-full shadow-md rounded-3xl border-primary-500 focus-visible:outline-primary-500 pr-14 bg-white ${
                  pdfInfo ? "pl-4 pt-12 h-[160px]" : "pl-14 h-[60px]"
                }`}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button
                  type="button"
                  size="icon"
                  className="rounded-full"
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
