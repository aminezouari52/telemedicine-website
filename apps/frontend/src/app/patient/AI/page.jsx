"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Paperclip, X } from "lucide-react";
import Image from "next/image";
import pdfToText from "react-pdftotext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { askPatientAi } from "@/services/aiService";

const SYSTEM_CONTEXT = `
You are a helpful AI medical assistant.
- Always provide concise, structured, and easy-to-read answers.
- Use markdown formatting properly:
  - Headings: ## Heading
  - Numbered lists: 1. 2. 3. (each on a new line)
  - Bullet points: - item (each on a new line)
- Limit answers to a maximum of 5 bullet points or 5 numbered items.
- Keep sentences short and clear.
- Tone: professional, empathetic, and supportive.
- If asked to explain something, give a summary first, then optional details.
- If a PDF is provided, summarize key findings instead of pasting the full text.
`.trim();

const THINKING_MESSAGES = [
  "AI is thinking...",
  "Analyzing data...",
  "Formulating response...",
];

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
      {message.pdfName && message.pdfSize !== undefined && (
        <PdfPreviewCard name={message.pdfName} size={message.pdfSize} />
      )}
      <div className="bg-primary-100 px-3 py-2 rounded-md max-w-prose">
        <p className="font-medium text-primary-700">{message.text}</p>
      </div>
    </div>
  );
}

function AiMessage({ message }) {
  return (
    <>
      <div className="whitespace-pre-wrap">
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
      <div className="flex-1" />
    </>
  );
}

export default function PatientAIPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pdfText, setPdfText] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ input, pdfContent, conversationHistory }) =>
      askPatientAi({
        input,
        pdfContent,
        context: SYSTEM_CONTEXT,
        conversationHistory,
      }).then((res) => res?.data?.text ?? "No response"),

    onSuccess: (aiResponse) => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: aiResponse },
      ]);
    },

    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "I am unable to answer right now. Please try again.",
        },
      ]);
    },
  });

  const handleSend = useCallback(() => {
    const trimmed = userInput.trim();
    if (!trimmed || isPending) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      ...(pdfInfo && { pdfName: pdfInfo.name, pdfSize: pdfInfo.size }),
    };

    setMessages((prev) => [...prev, userMsg]);
    mutate({
      input: trimmed,
      pdfContent: pdfText,
      conversationHistory: messages,
    });

    setUserInput("");
    setPdfText(null);
    setPdfInfo(null);
  }, [userInput, isPending, pdfText, pdfInfo, messages, mutate]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be re-selected later
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

  const canSend = !isPending && userInput.trim().length > 0;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-24 bg-background">
      {messages.length === 0 && (
        <h1 className="text-2xl font-semibold text-primary-500 text-center">
          What&apos;s bothering you today?
        </h1>
      )}

      <div className="flex flex-col w-full max-w-3xl lg:max-w-5xl px-10 pt-6">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start mb-4 gap-4">
            {message.role === "ai" ? (
              <AiMessage message={message} />
            ) : (
              <>
                <div className="flex-1" />
                <UserMessage message={message} />
              </>
            )}
          </div>
        ))}

        {isPending && <AiThinkingLoader />}

        <div ref={bottomRef} />

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
  );
}
