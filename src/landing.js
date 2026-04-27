export const landingHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Mrs. Dangu AI API</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(135deg, #ffe5ec 0%, #ffc2d4 50%, #ff9ebb 100%);
    color: #2b1a26; padding: 32px 20px;
  }
  .wrap { max-width: 760px; margin: 0 auto; }
  .card {
    background: rgba(255,255,255,0.78); backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.6); border-radius: 24px;
    padding: 28px 28px; box-shadow: 0 20px 60px rgba(178, 30, 90, 0.18);
    margin-bottom: 22px;
  }
  h1 { margin: 0 0 6px; font-size: 36px; letter-spacing: -0.02em; }
  .sub { margin: 0 0 4px; color: #7a3f5d; font-size: 15px; }
  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    background: #ff5c8a; color: white; font-size: 12px; font-weight: 600; margin-top: 10px;
  }
  h2 { margin: 0 0 12px; font-size: 18px; color: #c4346b; }
  pre {
    background: #1a0f17; color: #ffd8e5; padding: 14px 16px; border-radius: 14px;
    overflow-x: auto; font-size: 13px; line-height: 1.55; margin: 0 0 12px;
  }
  code.inline { background: #ffd9e4; color: #8a1844; padding: 2px 8px; border-radius: 6px; font-size: 13px; }
  .row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
  .pill { background: #fff; border: 1px solid #ffb3cc; color: #8a1844; padding: 6px 12px; border-radius: 999px; font-size: 13px; }
  textarea, select, input[type="file"], button {
    width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid #ffb3cc;
    font-size: 14px; font-family: inherit; background: white; color: #2b1a26;
  }
  textarea { min-height: 90px; resize: vertical; }
  label { font-size: 13px; font-weight: 600; color: #7a3f5d; display: block; margin: 12px 0 6px; }
  button {
    background: linear-gradient(135deg, #ff5c8a, #ff3d6f); color: white; border: none;
    font-weight: 700; cursor: pointer; margin-top: 16px;
    box-shadow: 0 8px 20px rgba(255, 61, 111, 0.35);
  }
  button:hover { filter: brightness(1.05); }
  button:disabled { opacity: 0.6; cursor: progress; }
  .reply {
    margin-top: 16px; background: #fff5f8; border: 1px solid #ffd1de; border-radius: 14px;
    padding: 14px 16px; white-space: pre-wrap; line-height: 1.55; min-height: 40px;
  }
  .reply.empty { color: #b88aa0; font-style: italic; }
  footer { text-align: center; color: #7a3f5d; font-size: 13px; margin-top: 14px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <h1>Mrs. Dangu 💖</h1>
    <p class="sub">Ek pyaari AI assistant — har language samjhe, photos dekhe, dil se jawab de.</p>
    <p class="sub"><strong>Inventor:</strong> Mr. Suraj Sir 🌟</p>
    <span class="badge">OpenAI ChatGPT + Gemini</span>
    <div class="row">
      <span class="pill">🌍 Multilingual</span>
      <span class="pill">🖼️ Image vision</span>
      <span class="pill">💬 Human-like</span>
      <span class="pill">😊 Emoji friendly</span>
    </div>
  </div>

  <div class="card">
    <h2>Try karo abhi 👇</h2>
    <label for="msg">Aapka sawaal / message</label>
    <textarea id="msg" placeholder="Mrs. Dangu se kuch bhi poochho..."></textarea>

    <label for="model">Model chuno</label>
    <select id="model">
      <option value="openai">OpenAI ChatGPT</option>
      <option value="gemini">Gemini</option>
    </select>

    <label for="img">Photo bhejo (optional)</label>
    <input id="img" type="file" accept="image/*" />

    <button id="send">Bhej do ✨</button>

    <div id="reply" class="reply empty">Mrs. Dangu ka jawab yahan dikhega...</div>
  </div>

  <div class="card">
    <h2>API Endpoints</h2>
    <p style="margin:0 0 8px;"><code class="inline">POST /chat</code> — chat with optional image</p>
    <p style="margin:0 0 8px;"><code class="inline">GET  /about</code> — info</p>
    <p style="margin:0 0 12px;"><code class="inline">GET  /healthz</code> — health check</p>

    <h2 style="margin-top:18px;">cURL example (text)</h2>
<pre>curl -X POST $URL/chat \\
  -H "Content-Type: application/json" \\
  -d '{"model":"openai","message":"Hello Mrs. Dangu, kaisi ho?"}'</pre>

    <h2>cURL example (with image)</h2>
<pre>curl -X POST $URL/chat \\
  -F "model=gemini" \\
  -F "message=Is photo me kya hai?" \\
  -F "image=@/path/to/photo.jpg"</pre>

    <h2>JSON response</h2>
<pre>{
  "ai": "Mrs. Dangu",
  "inventor": "Mr. Suraj Sir",
  "model": "openai",
  "reply": "Namaste! 💖 Main bilkul mast hoon..."
}</pre>
  </div>

  <footer>Made with 💖 by Mr. Suraj Sir</footer>
</div>

<script>
const $ = (id) => document.getElementById(id);
const send = $("send"), reply = $("reply"), msg = $("msg"), model = $("model"), img = $("img");

send.addEventListener("click", async () => {
  const text = msg.value.trim();
  const file = img.files?.[0];
  if (!text && !file) {
    reply.className = "reply empty";
    reply.textContent = "Pehle kuch likho ya photo do please 🙏";
    return;
  }
  send.disabled = true;
  reply.className = "reply empty";
  reply.textContent = "Mrs. Dangu soch rahi hai... ✨";

  try {
    const fd = new FormData();
    fd.append("model", model.value);
    fd.append("message", text);
    if (file) fd.append("image", file);

    const r = await fetch("/chat", { method: "POST", body: fd });
    const data = await r.json();
    if (!r.ok) {
      reply.className = "reply empty";
      reply.textContent = "Error: " + (data.error || "kuch gadbad") + (data.detail ? " — " + data.detail : "");
    } else {
      reply.className = "reply";
      reply.textContent = data.reply || "(khaali jawab)";
    }
  } catch (e) {
    reply.className = "reply empty";
    reply.textContent = "Network error: " + (e?.message || e);
  } finally {
    send.disabled = false;
  }
});
</script>
</body>
</html>`;
