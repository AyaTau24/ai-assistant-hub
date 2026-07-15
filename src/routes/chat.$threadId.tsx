import { createFileRoute } from "@tanstack/react-router";
import { ChatView } from "@/components/chat-view";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Chatbot Assistant — Workplace AI" },
      { name: "description", content: "Chat with an AI productivity assistant." },
    ],
  }),
  component: ChatThreadRoute,
});

function ChatThreadRoute() {
  const { threadId } = Route.useParams();
  return <ChatView threadId={threadId} />;
}