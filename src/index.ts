import { Env, ChatRequest, ChatMessage } from './types';
import { LANDING_PAGE } from './ui';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ROTA 1: Frontend (Serve o HTML)
    if (url.pathname === "/") {
      return new Response(LANDING_PAGE, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    }

    // ROTA 2: API Chat (Lida com a IA)
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { userMessage, sessionId } = await request.json() as ChatRequest;

        if (!userMessage) {
          return new Response(JSON.stringify({ error: "Message required" }), { status: 400 });
        }

        // 1. Recuperar histórico do KV
        // Se não existir, inicia array vazio
        let history = await env.CHAT_HISTORY.get(sessionId, { type: "json" }) as ChatMessage[] || [];
        
        // 2. Adicionar mensagem do utilizador
        history.push({ role: "user", content: userMessage });

        // 3. Preparar o contexto para o Llama 3.3
        // Limitamos o histórico às últimas 10 mensagens para não exceder limites de tokens
        const recentHistory = history.slice(-10);
        
        const systemPrompt = { 
          role: "system", 
          content: "You are an expert financial trading assistant. You specialize in HFT, Algorithms, and Market Structure. Provide technical, concise, and accurate answers. Use Markdown for code." 
        };
        
        const messages = [systemPrompt, ...recentHistory];

        // 4. Chamar a Cloudflare Workers AI
        const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
          messages: messages,
          stream: false
        });

        // 5. Adicionar resposta da IA ao histórico
        const aiResponse = response.response;
        history.push({ role: "assistant", content: aiResponse });

        // 6. Guardar histórico atualizado no KV (TTL de 24h)
        await env.CHAT_HISTORY.put(sessionId, JSON.stringify(history), { expirationTtl: 86400 });

        return new Response(JSON.stringify({ response: aiResponse }));

      } catch (e) {
        console.error("Worker Error:", e);
        return new Response(JSON.stringify({ response: "⚠️ System overload. Please try again." }), { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};