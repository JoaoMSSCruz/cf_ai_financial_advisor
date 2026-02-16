export const LANDING_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trading AI Assistant</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    :root { --primary: #0070f3; --bg: #f0f2f5; --chat-bg: #ffffff; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: var(--bg); color: #333; }
    .container { background: var(--chat-bg); padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); display: flex; flex-direction: column; height: 85vh; }
    h1 { color: #1a1a1a; text-align: center; margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 10px; }
    
    .chat-box { flex: 1; overflow-y: auto; padding: 15px; border: 1px solid #eaeaea; border-radius: 12px; background: #fafafa; margin-bottom: 20px; scroll-behavior: smooth; }
    
    .msg { margin: 12px 0; padding: 12px 18px; border-radius: 12px; max-width: 85%; line-height: 1.6; word-wrap: break-word; }
    .user { background: var(--primary); color: white; margin-left: auto; border-bottom-right-radius: 4px; }
    .ai { background: #e9ecef; color: #1a1a1a; margin-right: auto; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    
    /* Formatação Markdown dentro da resposta da AI */
    .ai pre { background: #2d2d2d; color: #ccc; padding: 10px; border-radius: 6px; overflow-x: auto; }
    .ai code { font-family: 'Consolas', monospace; font-size: 0.9em; }
    .ai p { margin: 0 0 10px 0; }
    .ai ul, .ai ol { margin: 0 0 10px 20px; padding: 0; }
    
    .input-area { display: flex; gap: 12px; }
    input { flex: 1; padding: 14px; border: 1px solid #ddd; border-radius: 8px; outline: none; font-size: 1rem; transition: border 0.2s; }
    input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(0,112,243,0.1); }
    button { padding: 14px 28px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: background 0.2s; }
    button:hover { background: #0051a2; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    
    .loading { font-size: 0.85rem; color: #666; text-align: center; margin-top: -15px; margin-bottom: 10px; height: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📈 Market Advisor Bot</h1>
    <div id="chat" class="chat-box">
      <div class="msg ai">Hello! I am your AI trading assistant. Ask me about HFT, market strategies, or coding.</div>
    </div>
    <div id="loading" class="loading"></div>
    <div class="input-area">
      <input type="text" id="msg" placeholder="Ex: Explain VWAP strategy..." onkeypress="handleKey(event)" />
      <button id="sendBtn" onclick="send()">Send</button>
    </div>
  </div>

  <script>
    // Gera ID único por sessão
    const sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    const chat = document.getElementById('chat');
    const loading = document.getElementById('loading');
    const btn = document.getElementById('sendBtn');
    
    async function send() {
      const input = document.getElementById('msg');
      const text = input.value.trim();
      if (!text) return;
      
      // UI Updates
      addMsg(text, 'user');
      input.value = '';
      input.disabled = true;
      btn.disabled = true;
      loading.textContent = "Analyzing market data...";

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userMessage: text, sessionId })
        });
        
        if (!res.ok) throw new Error("Network error");
        
        const data = await res.json();
        addMsg(data.response, 'ai');
      } catch (e) {
        addMsg("⚠️ Error: Unable to reach the AI service. Please try again.", 'ai');
      } finally {
        input.disabled = false;
        btn.disabled = false;
        loading.textContent = "";
        input.focus();
      }
    }

    function addMsg(text, type) {
      const div = document.createElement('div');
      div.className = 'msg ' + type;
      
      if (type === 'user') {
        div.textContent = text;
      } else {
        // Usa a biblioteca 'marked' para renderizar Markdown
        div.innerHTML = marked.parse(text);
      }
      
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function handleKey(e) {
      if (e.key === 'Enter' && !document.getElementById('sendBtn').disabled) send();
    }
  </script>
</body>
</html>
`;