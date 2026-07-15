import type { UIMessage } from "ai";

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const THREADS_KEY = "chat-threads-v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadThreads(): ChatThread[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(THREADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  if (!isBrowser()) return;
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

function newId() {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID();
  return `t_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function createThread(): ChatThread {
  return { id: newId(), title: "New chat", updatedAt: Date.now(), messages: [] };
}

export function getOrCreateInitialThread(): string {
  const list = loadThreads();
  if (list.length > 0) return list[0].id;
  const t = createThread();
  saveThreads([t]);
  return t.id;
}

export function upsertThread(t: ChatThread) {
  const list = loadThreads();
  const idx = list.findIndex((x) => x.id === t.id);
  const updated: ChatThread = { ...t, updatedAt: Date.now() };
  if (idx >= 0) list[idx] = updated;
  else list.unshift(updated);
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  saveThreads(list);
}

export function deleteThread(id: string) {
  saveThreads(loadThreads().filter((t) => t.id !== id));
}

export function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  return text.length > 48 ? text.slice(0, 45) + "..." : text || "New chat";
}