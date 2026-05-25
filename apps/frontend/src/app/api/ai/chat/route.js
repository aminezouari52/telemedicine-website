import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  const { messages, systemContext, pdfContent } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required." }, { status: 400 });
  }

  const recentMessages = messages.slice(-10);

  const toCoreMessage = (m) => {
    let text =
      m.content ||
      (m.parts
        ? m.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("\n")
        : "");
    if (
      pdfContent &&
      m.role === "user" &&
      m === recentMessages[recentMessages.length - 1]
    ) {
      text += "\n\nPDF content:\n" + pdfContent;
    }
    return { role: m.role, content: text };
  };

  const processedMessages = recentMessages.map(toCoreMessage);

  try {
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemContext,
      messages: processedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI streaming error:", error.message, error.stack);
    return Response.json({ error: "AI streaming failed" }, { status: 500 });
  }
}
