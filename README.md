# 📈 AI Stock Guru: Full-Stack Market Analyst

A modern, full-stack stock analysis application that uses **Cloudflare Workers** to securely bridge **Polygon.io** data with **OpenAI's GPT-4o-mini** for intelligent trading insights.

## 🚀 Key Features
- **Serverless Architecture:** Decoupled backend logic using Cloudflare Workers.
- **AI Gateway:** Optimized OpenAI requests with caching and rate-limiting via Cloudflare AI Gateway.
- **Secure Data Fetching:** Polygon.io API keys are kept secret within Cloudflare environment variables, never exposed to the client.
- **Smart Analytics:** Transforms raw stock price data into human-readable trading reports.

## 🏗️ Architecture
The app follows a secure "relay" pattern:
1. **Frontend:** Collects tickers and dates from the user.
2. **Polygon Worker:** Securely fetches historical data from Polygon.io.
3. **OpenAI Worker:** Sends data through the **Cloudflare AI Gateway** to OpenAI.
4. **Guru Report:** Renders a trading recommendation (Buy/Hold/Sell) in the UI.



## 🛠️ Tech Stack
- **Frontend:** Vanilla JS, CSS3, HTML5, Vite
- **Backend:** Cloudflare Workers (Serverless)
- **APIs:** Polygon.io (Market Data), OpenAI (LLM)
- **Tools:** Cloudflare AI Gateway, Wrangler CLI

## 🔧 Setup & Installation

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/ai-stock-guru](https://github.com/YOUR_USERNAME/stock-guru.git)
cd AI STOCK GURU

```

## 2. Frontend Setup 
Create a .env file in the root (though most keys are now in Workers):

Plaintext

VITE_POLYGON_API_KEY=your_key_here (for local testing only)

## 3. Worker Deployment
Navigate to each worker folder (/polygon-api-worker and /openai-api-worker) and deploy:

```
npx wrangler deploy
Note: Ensure you have added your POLYGON_API_KEY and OPENAI_API_KEY as secrets in the Cloudflare Dashboard.
```

## 🌟 Lessons Learned
Implementing CORS "Handshake" headers to allow local development to communicate with Cloudflare.

Moving secrets from the client-side to Serverless Workers for improved security.

Using AI Gateway Caching to reduce API costs and latency.


---

### 🚀 Final Deployment Steps
1. **Check your `.env`:** Ensure it is ignored by running `git status`. If `.env` is listed in red under "untracked files," you are safe.
2. **Commit:**
   ```bash
   git add .
   git commit -m "Initial commit: Secure Full-Stack Architecture"
   git push origin main
   ```

## Website
[ai-stock-guru.pages.dev](https://ai-stock-guru.pages.dev/)
