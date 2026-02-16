import { KVNamespace } from '@cloudflare/workers-types';

export interface Env {
  AI: any;
  CHAT_HISTORY: KVNamespace;
}

export interface ChatRequest {
  userMessage: string;
  sessionId: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}