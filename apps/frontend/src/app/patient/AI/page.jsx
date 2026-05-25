"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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

const SYSTEM_CONTEXT = `
You are a clinical AI assistant designed to help patients understand their health concerns. You are NOT a replacement for a real doctor — always include a disclaimer.

## Clinical approach

1. **Triage first** — if symptoms suggest an emergency (chest pain, severe bleeding, difficulty breathing, stroke signs, etc.), tell the patient to call emergency services immediately before anything else.
2. **Ask clarifying questions** — act like a doctor taking a history: onset, duration, severity, location, aggravating/relieving factors, associated symptoms.
3. **Provide differential possibilities** — list 2-3 possible causes ranked by likelihood, but clearly state you cannot diagnose.
4. **Give practical advice** — home care, when to see a GP vs a specialist, what to tell the doctor.
5. **End with a disclaimer** — "This information is for educational purposes only. Please consult a qualified healthcare professional for medical advice."

## Response style

- Use markdown: ## headings, numbered lists, **bold** for emphasis.
- Keep each section concise (2-4 bullet points max).
- Tone: professional, calm, and empathetic — like a doctor speaking to a patient.
- If a PDF (lab report, referral, etc.) is provided, summarize the key findings in plain language and explain what they might mean.

`.trim();

const THINKING_MESSAGES = [
  "AI is thinking...",
  "Analyzing data...",
  "Formulating response...",
];

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

function AiThinkingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
      if (++count >= THINKING_MESSAGES.length - 1) clearInterval(interval);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex m-4">
      <p className="text-md animate-pulse text-primary-600">
        {THINKING_MESSAGES[index]}
      </p>
    </div>
  );
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
        <p className="font-medium text-primary-700">
          {message.parts?.[0]?.text ?? ""}
        </p>
      </div>
    </div>
  );
}

function AiMessage({ message }) {
  return (
    <>
      <div className="whitespace-pre-wrap">
        <ReactMarkdown>
          {message.parts?.find((p) => p.type === "text")?.text ?? ""}
        </ReactMarkdown>
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
    <aside className="min-h-[100%] fixed right-0 hidden md:flex w-80 flex-col border-l border-gray-200 bg-white min-h-[80vh]">
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
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={`w-full text-left p-3 rounded-lg flex items-start gap-2 group hover:bg-primary-50 transition-colors ${
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
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

function toChatMessages(convMessages) {
  return (convMessages || []).map((m) => ({
    id: m.id,
    role: m.role === "ai" ? "assistant" : "user",
    parts: [{ type: "text", text: m.text || "" }],
    metadata: m.pdfName
      ? { pdfName: m.pdfName, pdfSize: m.pdfSize }
      : undefined,
  }));
}

function toSaveMessages(messages) {
  return messages.map((m) => ({
    id: m.id,
    role: m.role === "assistant" ? "ai" : m.role,
    text: m.parts?.find((p) => p.type === "text")?.text ?? "",
    ...(m.metadata?.pdfName
      ? { pdfName: m.metadata.pdfName, pdfSize: m.metadata.pdfSize }
      : {}),
  }));
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
      setConversations(conversationsData);
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
    const text = firstUserMsg?.parts?.[0]?.text ?? "";
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
          "overflow-y-auto h-[100vh] flex-1 flex flex-col items-center gap-24 md:mr-[325px]",
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
              <div key={message.id} className="flex items-start mb-4 gap-4">
                {message.role === "assistant" ? (
                  <AiMessage message={message} />
                ) : (
                  <>
                    <div className="flex-1" />
                    <UserMessage message={message} />
                  </>
                )}
              </div>
            ))}

            {isSending && <AiThinkingLoader />}

            <div ref={bottomRef} />
          </div>

          <div className="sticky bottom-0 flex flex-col pb-8 bg-background">
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
