# Mrs. Dangu 💖

A pyaari AI assistant API powered by **OpenAI ChatGPT** and **Google Gemini**.

- 🌍 Multilingual (Hindi, Hinglish, English, and any language)
- 🖼️ Image vision support (send a photo, get a description)
- 😊 Human-like, emoji-friendly persona
- 🤝 Two providers in one API — pick `openai` or `gemini` per request

> **AI:** Mrs. Dangu  
> **Inventor:** Mr. Suraj Sir 🌟

---

## API

### `POST /chat`

Body (JSON or `multipart/form-data`):

| field     | type                  | required | description                          |
| --------- | --------------------- | -------- | ------------------------------------ |
| `message` | string                | yes\*    | The user's message                   |
| `model`   | `"openai"` \| `"gemini"` | no    | Default `"openai"`                   |
| `image`   | file or base64 string | no       | Optional photo to analyze            |

\* Either `message` or `image` is required.

**Response:**

```json
{
  "ai": "Mrs. Dangu",
  "inventor": "Mr. Suraj Sir",
  "model": "openai",
  "reply": "Namaste! 💖 ..."
}
```

### `GET /about` — info  
### `GET /healthz` — health check  
### `GET /` — branded landing page with a built-in tester

---

## Run locally

```bash
npm install
cp .env.example .env
# fill in OPENAI_API_KEY and GEMINI_API_KEY
npm start
```

Open http://localhost:8080

---

## Deploy on Railway

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to <https://railway.app/new> → **Deploy from GitHub repo** → pick `mrs-dangu-api`.
3. Railway will auto-detect Node.js and run `npm install && npm start`.
4. In the Railway project → **Variables** → add:
   - `OPENAI_API_KEY` — get from <https://platform.openai.com/api-keys>
   - `GEMINI_API_KEY` — get from <https://aistudio.google.com/apikey>
   - (`PORT` is set automatically by Railway)
5. Click **Deploy**. Once it goes live, click **Settings → Networking → Generate Domain** to get your public URL.

That's it — your live URL will look like `https://mrs-dangu-api-production.up.railway.app`.

---

## cURL examples

**Text chat:**

```bash
curl -X POST https://YOUR-URL/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"openai","message":"Hello Mrs. Dangu, kaisi ho?"}'
```

**Image analysis:**

```bash
curl -X POST https://YOUR-URL/chat \
  -F "model=gemini" \
  -F "message=Is photo me kya hai?" \
  -F "image=@/path/to/photo.jpg"
```

---

Made with 💖 by **Mr. Suraj Sir**.
