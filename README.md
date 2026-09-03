# Meridian — AI Workplace Productivity Assistant

Meridian is a modern, responsive web application that helps busy professionals automate daily work tasks with AI. It provides a clean, professional SaaS-style dashboard with a sidebar navigation and five interactive AI tools.

## Features

- **Smart Email Generator** — Write polished workplace emails by choosing tone, audience, and length. Outputs a subject line, full body, and a short explanation of why the message works.
- **Meeting Notes Summarizer** — Paste raw notes or transcripts and get a structured summary, key points, action items with owners, deadlines, and open questions.
- **AI Task Planner** — Turn a task dump into a prioritized plan with scheduled focus blocks, deferred items, and risk notes.
- **AI Research Assistant** — Generate concise research briefs with an executive summary, key insights, trade-offs, recommended next steps, and items that need verification.
- **AI Chatbot Interface** — Ask Meridian workplace questions in a conversational chat.

## Design

Meridian uses a dark, operator-grade design system with warm terracotta accents and semantic color tokens. The layout is fully responsive: a collapsible sidebar on desktop and an overlay navigation on mobile.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework with SSR and server functions
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — type-safe development
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling with custom theme tokens
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway) — AI model access via `google/gemini-3.7-flash`

## Project Structure

```text
src/
  components/       # Shared UI components (AppShell, ToolSurface, AiOutput)
  hooks/            # React hooks including useAiTask
  lib/              # Server functions and utilities
  routes/           # TanStack Start file-based routes
  styles.css        # Global design tokens and Tailwind theme
public/             # Static assets
```

## Getting Started

This project was built with [Lovable](https://lovable.dev). To run it locally:

```sh
git clone <repository-url>
cd <repository-name>
npm install
npm run dev
```

Open `http://localhost:8080` in your browser.

## AI Outputs

All AI-generated content is clearly marked with a disclaimer: **“AI-generated content may require human review.”**

## License

Copyright © 2026. Built with Lovable.
