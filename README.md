# AI Workplace Productivity Hub

A modern, responsive AI-powered web app that helps professionals, students, and teams save time by automating common workplace tasks. Built with TanStack Start, React 19, Tailwind v4, and the Lovable AI Gateway.

## Features

- **Smart Email Generator** — Craft professional emails by audience, tone, and purpose. Generates subject, body, and closing.
- **Meeting Notes Summarizer** — Turn raw meeting notes into an executive summary, decisions, action items, responsibilities, deadlines, and follow-ups.
- **AI Research Assistant** — Analyze topics, questions, articles, or reports into a structured brief with insights, facts, recommendations, and a simplified explanation.
- **AI Chatbot Assistant** — ChatGPT-style conversational assistant with threaded history, suggested prompts, typing indicators, and per-message copy.
- **Settings** — Light/dark mode, adjustable font size, AI disclaimer, and About section.

## Design

- Premium UI inspired by Microsoft Copilot, Notion AI, and ChatGPT
- Fully responsive: desktop sidebar navigation, mobile bottom nav
- Dark and light modes with a professional color palette
- Rounded cards, smooth animations, loading states, toast notifications
- Accessible components and semantic HTML

## Tech Stack

- **Framework:** TanStack Start v1 (React 19, SSR, server functions)
- **Build:** Vite 7
- **Styling:** Tailwind CSS v4 with semantic design tokens
- **UI:** shadcn/ui + AI Elements
- **AI:** Lovable AI Gateway via the Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`)
- **State:** TanStack Query, React Context
- **Persistence:** Chat threads stored in `localStorage`

## Project Structure

```text
src/
  routes/            # File-based routes (dashboard, features, chat, settings)
    api/chat.ts      # Streaming chat endpoint
  components/        # App shell, UI primitives, AI elements
  lib/               # Server functions, AI gateway, chat threads
  styles.css         # Tailwind v4 theme + design tokens
```

## Getting Started

```bash
bun install
bun run dev
```

The app runs at `http://localhost:8080`.

### Environment

The AI features use the Lovable AI Gateway. When running in Lovable, `LOVABLE_API_KEY` is injected automatically. For local self-hosting, provide your own key in the server environment.

## AI Disclaimer

AI-generated content may contain mistakes or incomplete information. AI-generated content may need human review.

## License

MIT