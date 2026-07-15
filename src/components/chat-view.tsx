import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  MessageSquarePlus,
  Sparkles,
  Trash2,
  MessagesSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import {
  createThread,
  deleteThread,
  deriveTitle,
  loadThreads,
  saveThreads,
  upsertThread,
  type ChatThread,
} from "@/lib/chat-threads";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Write a professional email.",
  "Summarize this report.",
  "Explain cloud computing.",
  "Help me prepare for a meeting.",
  "Create a project plan.",
];

export function ChatView({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setThreads(loadThreads());
    setHydrated(true);
  }, []);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === threadId),
    [threads, threadId],
  );

  // Ensure the URL thread exists in storage once hydrated
  useEffect(() => {
    if (!hydrated) return;
    if (!activeThread) {
      const t: ChatThread = { id: threadId, title: "New chat", updatedAt: Date.now(), messages: [] };
      const next = [t, ...threads];
      saveThreads(next);
      setThreads(next);
    }
  }, [hydrated, activeThread, threadId, threads]);

  const initialMessages = activeThread?.messages ?? [];

  const { messages, sendMessage, status, setMessages } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  // Persist messages per thread
  const lastSavedRef = useRef<string>("");
  useEffect(() => {
    if (!hydrated) return;
    if (status === "streaming" || status === "submitted") return;
    const key = JSON.stringify(messages);
    if (key === lastSavedRef.current) return;
    lastSavedRef.current = key;
    const title = deriveTitle(messages as UIMessage[]);
    upsertThread({ id: threadId, title, updatedAt: Date.now(), messages: messages as UIMessage[] });
    setThreads(loadThreads());
  }, [messages, status, threadId, hydrated]);

  const [input, setInput] = useState("");

  const handleSubmit = (m: PromptInputMessage) => {
    const text = (m.text ?? input).trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  const newChat = () => {
    const t = createThread();
    upsertThread(t);
    setThreads(loadThreads());
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const removeThread = (id: string) => {
    deleteThread(id);
    const remaining = loadThreads();
    setThreads(remaining);
    if (id === threadId) {
      if (remaining.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id } });
      } else {
        const t = createThread();
        upsertThread(t);
        setThreads(loadThreads());
        navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
      }
    }
  };

  const clearActive = () => {
    setMessages([]);
    upsertThread({ id: threadId, title: "New chat", updatedAt: Date.now(), messages: [] });
    setThreads(loadThreads());
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl gap-4 px-2 py-4 md:h-[calc(100vh-6rem)] md:px-6">
      {/* Threads sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col md:flex">
        <Card className="flex h-full flex-col p-3">
          <Button onClick={newChat} className="mb-3 w-full justify-start" variant="default">
            <MessageSquarePlus className="mr-2 h-4 w-4" /> New chat
          </Button>
          <div className="text-xs font-medium text-muted-foreground px-1 mb-1">Recent</div>
          <div className="flex-1 space-y-1 overflow-y-auto pr-1">
            {threads.length === 0 && (
              <div className="px-2 py-4 text-xs text-muted-foreground">No chats yet.</div>
            )}
            {threads.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors",
                  t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {t.title || "New chat"}
                </Link>
                <button
                  type="button"
                  aria-label="Delete chat"
                  onClick={(e) => {
                    e.preventDefault();
                    removeThread(t.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </aside>

      {/* Chat panel */}
      <Card className="flex min-w-0 flex-1 flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <MessagesSquare className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate text-sm font-medium">
              {activeThread?.title || "New chat"}
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={newChat} className="md:hidden">
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={clearActive} disabled={messages.length === 0}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </div>

        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="How can I help today?"
                description="Ask anything, or try one of these prompts."
              >
                <div className="mt-4 grid w-full max-w-md gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage({ text: s })}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                return (
                  <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                    {m.role === "assistant" ? (
                      <div className="group flex w-full flex-col gap-1">
                        <MessageResponse>{text}</MessageResponse>
                        {text && (
                          <button
                            className="self-start text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                            onClick={() => {
                              navigator.clipboard.writeText(text);
                              toast.success("Copied");
                            }}
                          >
                            <Copy className="mr-1 inline h-3 w-3" /> Copy
                          </button>
                        )}
                      </div>
                    ) : (
                      <MessageContent>{text}</MessageContent>
                    )}
                  </Message>
                );
              })
            )}
            {isBusy && (
              <Message from="assistant">
                <Shimmer>Thinking...</Shimmer>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border p-3">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI anything..."
              autoFocus
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isBusy && !input.trim()} />
            </PromptInputFooter>
          </PromptInput>
          <div className="mt-2">
            <AIDisclaimer />
          </div>
        </div>
      </Card>
    </div>
  );
}