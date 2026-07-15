import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_CHAT_MODEL } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are an AI Workplace Productivity Assistant. You help office workers, students, managers, and professionals with:
- Writing professional emails and messages
- Summarizing documents and meeting notes
- Explaining concepts clearly
- Planning projects and preparing for meetings
- Research and analysis

Respond in clear, well-structured Markdown. Be concise, actionable, and professional. When helpful, use headings, bullet lists, and short paragraphs.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(DEFAULT_CHAT_MODEL),
          system: SYSTEM_PROMPT,
          messages: convertToModelMessages(messages as UIMessage[]),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});