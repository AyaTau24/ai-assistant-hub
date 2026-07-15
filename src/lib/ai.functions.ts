import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_CHAT_MODEL } from "./ai-gateway.server";

const EmailInput = z.object({
  audience: z.string().min(1),
  tone: z.string().min(1),
  purpose: z.string().min(1),
  additional: z.string().optional().default(""),
});

function extractSection(text: string, label: string) {
  const re = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:Subject|Body|Email|Closing)\\s*:|$)`, "i");
  const m = text.match(re);
  return m ? m[1].trim() : "";
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => EmailInput.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `Write a ${data.tone} email to a ${data.audience}.
Purpose: ${data.purpose}
Additional context: ${data.additional || "(none)"}

Return the response in EXACTLY this format, with these three labels on their own lines:

Subject: <one-line subject>
Body: <the full email body, well-formatted with paragraphs>
Closing: <the sign-off closing line only>`;
    const { text } = await generateText({ model: gateway(DEFAULT_CHAT_MODEL), prompt });
    return {
      subject: extractSection(text, "Subject"),
      body: extractSection(text, "Body"),
      closing: extractSection(text, "Closing"),
      raw: text,
    };
  });

const SummarizerInput = z.object({ notes: z.string().min(10) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => SummarizerInput.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `You are an expert meeting analyst. Summarize the following meeting notes into a clear, professional Markdown document with these sections in this exact order and headings:

## Executive Summary
## Key Decisions
## Action Items
## Assigned Responsibilities
## Deadlines
## Follow-up Recommendations

Use bullet points inside each section. Be concise and specific. If information for a section is missing, say "Not mentioned."

MEETING NOTES:
${data.notes}`;
    const { text } = await generateText({ model: gateway(DEFAULT_CHAT_MODEL), prompt });
    return { markdown: text };
  });

const ResearchInput = z.object({ content: z.string().min(5) });

export const researchAssistant = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ResearchInput.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `You are an AI Research Assistant. Analyze the following input (a topic, question, article, report, or website content) and produce a structured Markdown research brief with these sections in this exact order and headings:

## Summary
## Key Insights
## Important Facts
## Recommendations
## Simplified Explanation
## Conclusion

Use bullet points where appropriate. Be accurate and well-reasoned.

INPUT:
${data.content}`;
    const { text } = await generateText({ model: gateway(DEFAULT_CHAT_MODEL), prompt });
    return { markdown: text };
  });