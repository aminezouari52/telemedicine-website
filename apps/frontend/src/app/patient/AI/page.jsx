"use client";

import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Paperclip, X } from "lucide-react";
import Image from "next/image";
import pdfToText from "react-pdftotext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { askPatientAi } from "@/services/aiService";

const CONTEXT = `
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
`;

function AiThinkingLoader() {
  const aiMessages = [
    "AI is thinking...",
    "Analyzing data...",
    "Formulating response...",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let count = 0;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiMessages.length);
      count++;

      if (count >= 2) {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [aiMessages.length]);

  return (
    <div className="flex">
      <div className="flex flex-col space-y-2 m-4">
        <div className="h-6">
          <p className="text-md animate-pulse text-primary-600">
            {aiMessages[currentIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PatientAIPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfInfo, setPdfInfo] = useState({ name: "", size: 0 });
  const inputElement = useRef();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      input,
      pdfBase64: pdfContent,
      conversationHistory,
    }) => {
      const response = await askPatientAi({
        input,
        pdfContent,
        context: CONTEXT,
        conversationHistory,
      });
      return response?.data?.text || "No response";
    },
    onSuccess: (aiResponse) => {
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I am unable to answer right now. Please try again.",
        },
      ]);
    },
  });

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", text: userInput, hasPdf: !!pdfBase64 };
    setMessages((prev) => [...prev, userMsg]);

    mutate({ input: userInput, pdfBase64, conversationHistory: messages });

    setUserInput("");
    setPdfBase64(null);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdfInfo({ name: file.name, size: file.size });
    const pdfText = await pdfToText(file);
    setPdfBase64(pdfText);

    inputElement.current.focus();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-24 bg-background">
      {messages.length === 0 && (
        <h1 className="text-2xl font-semibold text-primary-500 text-center">
          What&apos;s bothering you today?
        </h1>
      )}
      <div className="flex flex-col w-full max-w-3xl lg:max-w-5xl px-10 pt-6">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-start mb-4 gap-4">
            {msg.role === "ai" ? (
              <>
                <div className="whitespace-pre-wrap">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className="flex-1" />
              </>
            ) : (
              <>
                <div className="flex-1" />
                <div
                  className={`flex flex-col gap-4 items-${
                    msg.hasPdf ? "end" : "start"
                  }`}
                >
                  {msg.hasPdf && (
                    <div className="flex items-center gap-2 border border-primary-300 rounded-xl h-[60px] mt-6 px-3 py-2 bg-primary-50">
                      <Image
                        src="/assets/pdf.svg"
                        alt="PDF icon"
                        width={25}
                        height={25}
                        className="h-[25px]"
                      />
                      <div className="ms-2">
                        <p className="text-md text-primary-800 font-medium">
                          {pdfInfo.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {(pdfInfo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="bg-primary-100 px-3 py-2 rounded-md">
                    <p className="font-medium text-primary-700">{msg.text}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        {isPending && <AiThinkingLoader />}

        <div className="sticky bottom-0 flex flex-col pb-8 bg-background">
          <div className="w-full relative flex items-end">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {!pdfBase64 && (
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer border border-primary-200"
                  title="Attach file"
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

            {pdfBase64 && (
              <div className="absolute left-3 top-3 flex ms-2">
                <div className="flex items-center gap-2 border border-primary-300 rounded-xl h-[60px] px-3 py-2 bg-primary-50">
                  <Image
                    src="/assets/pdf.svg"
                    alt="PDF icon"
                    width={25}
                    height={25}
                    className="h-[25px]"
                  />
                  <div className="ms-2">
                    <p className="text-md text-primary-800 font-medium">
                      {pdfInfo.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {(pdfInfo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-2 w-6 h-6 rounded-full text-black"
                    onClick={() => setPdfBase64(null)}
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Input
              ref={inputElement}
              type="text"
              value={userInput}
              placeholder="Ask anything..."
              className={`w-full shadow-md rounded-3xl border ${
                pdfBase64 ? "pl-4 pt-12 h-[140px]" : "pl-14 h-[60px]"
              } pr-14 bg-white`}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending && userInput.trim()) {
                  handleSend();
                }
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                onClick={handleSend}
                disabled={isPending || !userInput.trim()}
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
